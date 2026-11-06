// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IPropertyRegistry} from "./interfaces/IPropertyRegistry.sol";

/// @title RentalAgreement
/// @notice On-chain rental agreement and rent payment tracker for listed properties.
contract RentalAgreement is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");

    enum RentalStatus {
        Active,
        Completed,
        Terminated,
        Disputed
    }

    struct Rental {
        uint256 propertyId;
        address tenant;
        address landlord;
        uint256 monthlyRent;
        uint256 deposit;
        uint256 startDate;
        uint256 endDate;
        RentalStatus status;
    }

    struct Payment {
        uint256 amount;
        uint256 paidAt;
        address payer;
    }

    IPropertyRegistry public registry;
    uint256 public rentalCount;
    mapping(uint256 => Rental) public rentals;
    mapping(uint256 => Payment[]) private rentPayments;

    event RentalCreated(uint256 indexed rentalId, uint256 indexed propertyId, address indexed tenant);
    event RentPaid(uint256 indexed rentalId, address indexed tenant, uint256 amount);
    event RentalTerminated(uint256 indexed rentalId);
    event DepositReleased(uint256 indexed rentalId, uint256 amount);
    event RentalDisputed(uint256 indexed rentalId, address indexed raisedBy);

    error InvalidRental();
    error InvalidAmount();
    error InvalidStatus();
    error NotParticipant();

    /// @notice Deploys rental agreement manager.
    /// @param admin Admin and arbiter wallet.
    /// @param registryAddress Property registry address.
    constructor(address admin, address registryAddress) {
        require(admin != address(0), "admin required");
        require(registryAddress != address(0), "registry required");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ARBITER_ROLE, admin);
        registry = IPropertyRegistry(registryAddress);
    }

    /// @notice Creates a rental agreement and deposits the security deposit.
    /// @param propertyId Property id.
    /// @param monthlyRent Monthly rent in wei.
    /// @param startDate Rental start date.
    /// @param endDate Rental end date.
    /// @return rentalId Newly created rental id.
    function createRental(uint256 propertyId, uint256 monthlyRent, uint256 startDate, uint256 endDate)
        external
        payable
        whenNotPaused
        nonReentrant
        returns (uint256 rentalId)
    {
        address landlord = registry.ownerOfProperty(propertyId);
        require(landlord != address(0) && landlord != msg.sender, "invalid landlord");
        require(endDate > startDate && endDate > block.timestamp, "invalid dates");
        if (monthlyRent == 0 || msg.value == 0) revert InvalidAmount();
        rentalId = ++rentalCount;
        rentals[rentalId] = Rental({
            propertyId: propertyId,
            tenant: msg.sender,
            landlord: landlord,
            monthlyRent: monthlyRent,
            deposit: msg.value,
            startDate: startDate,
            endDate: endDate,
            status: RentalStatus.Active
        });
        emit RentalCreated(rentalId, propertyId, msg.sender);
    }

    /// @notice Pays rent to the landlord and records payment history.
    /// @param rentalId Rental id.
    function payRent(uint256 rentalId) external payable whenNotPaused nonReentrant {
        Rental storage rental = _rental(rentalId);
        if (rental.status != RentalStatus.Active) revert InvalidStatus();
        if (msg.sender != rental.tenant) revert NotParticipant();
        if (msg.value != rental.monthlyRent) revert InvalidAmount();
        rentPayments[rentalId].push(Payment({amount: msg.value, paidAt: block.timestamp, payer: msg.sender}));
        (bool ok,) = rental.landlord.call{value: msg.value}("");
        require(ok, "rent transfer failed");
        emit RentPaid(rentalId, msg.sender, msg.value);
    }

    /// @notice Terminates a rental. Early termination keeps 25% deposit as penalty.
    /// @param rentalId Rental id.
    function terminateRental(uint256 rentalId) external whenNotPaused nonReentrant {
        Rental storage rental = _rental(rentalId);
        if (rental.status != RentalStatus.Active) revert InvalidStatus();
        if (msg.sender != rental.tenant && msg.sender != rental.landlord) revert NotParticipant();
        rental.status = block.timestamp >= rental.endDate ? RentalStatus.Completed : RentalStatus.Terminated;
        emit RentalTerminated(rentalId);
    }

    /// @notice Releases deposit after completion or termination.
    /// @param rentalId Rental id.
    function releaseDeposit(uint256 rentalId) external whenNotPaused nonReentrant {
        Rental storage rental = _rental(rentalId);
        if (msg.sender != rental.landlord && !hasRole(ARBITER_ROLE, msg.sender)) revert NotParticipant();
        if (rental.status == RentalStatus.Active || rental.status == RentalStatus.Disputed) revert InvalidStatus();
        uint256 amount = rental.deposit;
        rental.deposit = 0;
        uint256 tenantAmount = amount;
        if (rental.status == RentalStatus.Terminated && block.timestamp < rental.endDate) {
            uint256 penalty = amount / 4;
            tenantAmount = amount - penalty;
            (bool landlordOk,) = rental.landlord.call{value: penalty}("");
            require(landlordOk, "penalty transfer failed");
        }
        (bool ok,) = rental.tenant.call{value: tenantAmount}("");
        require(ok, "deposit transfer failed");
        emit DepositReleased(rentalId, tenantAmount);
    }

    /// @notice Raises a rental dispute.
    /// @param rentalId Rental id.
    function raiseDispute(uint256 rentalId) external whenNotPaused {
        Rental storage rental = _rental(rentalId);
        if (msg.sender != rental.tenant && msg.sender != rental.landlord) revert NotParticipant();
        rental.status = RentalStatus.Disputed;
        emit RentalDisputed(rentalId, msg.sender);
    }

    /// @notice Returns rent payment history.
    /// @param rentalId Rental id.
    /// @return payments Payment records.
    function getRentPaymentHistory(uint256 rentalId) external view returns (Payment[] memory payments) {
        if (rentalId == 0 || rentalId > rentalCount) revert InvalidRental();
        return rentPayments[rentalId];
    }

    /// @notice Pauses rental operations.
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /// @notice Unpauses rental operations.
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _rental(uint256 rentalId) internal view returns (Rental storage rental) {
        if (rentalId == 0 || rentalId > rentalCount) revert InvalidRental();
        rental = rentals[rentalId];
    }
}
