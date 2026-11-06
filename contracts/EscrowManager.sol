// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IPropertyRegistry} from "./interfaces/IPropertyRegistry.sol";
import {PropertyToken} from "./PropertyToken.sol";
import {UpgradeableReentrancyGuard} from "./UpgradeableReentrancyGuard.sol";

/// @title EscrowManager
/// @notice Holds buyer funds until real-estate sale conditions are approved or disputed.
contract EscrowManager is Initializable, AccessControlUpgradeable, OwnableUpgradeable, PausableUpgradeable, UpgradeableReentrancyGuard, UUPSUpgradeable {
    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");
    uint256 public constant FEE_DENOMINATOR = 10_000;

    enum EscrowStatus {
        Pending,
        Active,
        Completed,
        Disputed,
        Refunded,
        Cancelled
    }

    struct Escrow {
        uint256 propertyId;
        address buyer;
        address seller;
        uint256 amount;
        EscrowStatus status;
        uint256 depositedAt;
        uint256 deadline;
        bool buyerApproved;
        bool sellerApproved;
    }

    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => uint256) public propertyEscrow;
    uint256 public escrowCount;
    uint256 public platformFeePercent;
    uint256 public accruedFees;
    address public feeCollector;
    IPropertyRegistry public registry;
    PropertyToken public propertyToken;

    event EscrowCreated(uint256 indexed escrowId, uint256 indexed propertyId, address buyer);
    event FundsDeposited(uint256 indexed escrowId, uint256 amount);
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowDisputed(uint256 indexed escrowId, address raisedBy);
    event EscrowRefunded(uint256 indexed escrowId);
    event EscrowCancelled(uint256 indexed escrowId);
    event DisputeResolved(uint256 indexed escrowId, bool releaseToSeller);
    event FeeCollectorUpdated(address indexed feeCollector);
    event PlatformFeeUpdated(uint256 feeBps);

    error InvalidEscrow();
    error InvalidProperty();
    error InvalidAmount();
    error InvalidStatus();
    error NotParticipant();
    error DeadlineActive();

    /// @notice Initializes escrow manager.
    /// @param admin Admin and arbiter wallet.
    /// @param registryAddress Property registry address.
    /// @param tokenAddress Property token address.
    /// @param collector Platform fee collector.
    function initialize(address admin, address registryAddress, address tokenAddress, address collector) public initializer {
        require(admin != address(0), "admin required");
        require(registryAddress != address(0), "registry required");
        require(tokenAddress != address(0), "token required");
        require(collector != address(0), "collector required");
        __AccessControl_init();
        __Ownable_init(admin);
        __Pausable_init();
        __UpgradeableReentrancyGuard_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ARBITER_ROLE, admin);
        registry = IPropertyRegistry(registryAddress);
        propertyToken = PropertyToken(tokenAddress);
        feeCollector = collector;
        platformFeePercent = 200;
    }

    /// @notice Creates escrow and optionally deposits funds in the same transaction.
    /// @param propertyId Property id.
    /// @param seller Seller wallet.
    /// @param deadline Unix timestamp after which buyer can refund active escrow.
    /// @return escrowId Newly created escrow id.
    function createEscrow(uint256 propertyId, address seller, uint256 deadline)
        external
        payable
        whenNotPaused
        nonReentrant
        returns (uint256 escrowId)
    {
        if (propertyId == 0) revert InvalidProperty();
        if (seller == address(0) || seller != registry.ownerOfProperty(propertyId)) revert InvalidProperty();
        if (msg.sender == seller) revert NotParticipant();
        if (propertyEscrow[propertyId] != 0) revert InvalidStatus();
        uint256 price = registry.priceOf(propertyId);
        if (price == 0) revert InvalidAmount();

        escrowId = ++escrowCount;
        escrows[escrowId] = Escrow({
            propertyId: propertyId,
            buyer: msg.sender,
            seller: seller,
            amount: 0,
            status: EscrowStatus.Pending,
            depositedAt: 0,
            deadline: deadline == 0 ? block.timestamp + 30 days : deadline,
            buyerApproved: false,
            sellerApproved: false
        });
        propertyEscrow[propertyId] = escrowId;
        registry.escrowLock(propertyId);
        emit EscrowCreated(escrowId, propertyId, msg.sender);
        if (msg.value > 0) _deposit(escrowId, msg.value);
    }

    /// @notice Deposits buyer funds into escrow.
    /// @param escrowId Escrow id.
    function depositFunds(uint256 escrowId) external payable whenNotPaused nonReentrant {
        _deposit(escrowId, msg.value);
    }

    /// @notice Approves the deal as buyer or seller. Releases funds when both approve.
    /// @param escrowId Escrow id.
    function approveDeal(uint256 escrowId) external whenNotPaused nonReentrant {
        Escrow storage escrow = _escrow(escrowId);
        if (escrow.status != EscrowStatus.Active) revert InvalidStatus();
        if (msg.sender == escrow.buyer) escrow.buyerApproved = true;
        else if (msg.sender == escrow.seller) escrow.sellerApproved = true;
        else revert NotParticipant();
        if (escrow.buyerApproved && escrow.sellerApproved) _releaseFunds(escrowId);
    }

    /// @notice Releases funds when both parties have approved.
    /// @param escrowId Escrow id.
    function releaseFunds(uint256 escrowId) external whenNotPaused nonReentrant {
        Escrow storage escrow = _escrow(escrowId);
        if (!escrow.buyerApproved || !escrow.sellerApproved) revert InvalidStatus();
        _releaseFunds(escrowId);
    }

    /// @notice Raises a dispute by buyer or seller.
    /// @param escrowId Escrow id.
    function raiseDispute(uint256 escrowId) external whenNotPaused {
        Escrow storage escrow = _escrow(escrowId);
        if (escrow.status != EscrowStatus.Active) revert InvalidStatus();
        if (msg.sender != escrow.buyer && msg.sender != escrow.seller) revert NotParticipant();
        escrow.status = EscrowStatus.Disputed;
        emit EscrowDisputed(escrowId, msg.sender);
    }

    /// @notice Resolves a dispute by either releasing to seller or refunding buyer.
    /// @param escrowId Escrow id.
    /// @param releaseToSeller True to complete sale, false to refund.
    function resolveDispute(uint256 escrowId, bool releaseToSeller) external onlyRole(ARBITER_ROLE) whenNotPaused nonReentrant {
        Escrow storage escrow = _escrow(escrowId);
        if (escrow.status != EscrowStatus.Disputed) revert InvalidStatus();
        if (releaseToSeller) _releaseFunds(escrowId);
        else _refund(escrowId);
        emit DisputeResolved(escrowId, releaseToSeller);
    }

    /// @notice Cancels pending escrow or refunds an expired active escrow.
    /// @param escrowId Escrow id.
    function cancelEscrow(uint256 escrowId) external whenNotPaused nonReentrant {
        Escrow storage escrow = _escrow(escrowId);
        if (msg.sender != escrow.buyer && msg.sender != escrow.seller) revert NotParticipant();
        if (escrow.status == EscrowStatus.Pending) {
            escrow.status = EscrowStatus.Cancelled;
            propertyEscrow[escrow.propertyId] = 0;
            emit EscrowCancelled(escrowId);
            return;
        }
        if (escrow.status != EscrowStatus.Active) revert InvalidStatus();
        if (block.timestamp <= escrow.deadline) revert DeadlineActive();
        _refund(escrowId);
    }

    /// @notice Withdraws accrued platform fees.
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = accruedFees;
        accruedFees = 0;
        (bool ok,) = feeCollector.call{value: amount}("");
        require(ok, "fee transfer failed");
    }

    /// @notice Updates fee collector.
    /// @param collector New collector wallet.
    function setFeeCollector(address collector) external onlyOwner {
        require(collector != address(0), "collector required");
        feeCollector = collector;
        emit FeeCollectorUpdated(collector);
    }

    /// @notice Updates platform fee in basis points.
    /// @param feeBps Fee in basis points, capped at 10%.
    function setPlatformFeePercent(uint256 feeBps) external onlyOwner {
        require(feeBps <= 1000, "fee too high");
        platformFeePercent = feeBps;
        emit PlatformFeeUpdated(feeBps);
    }

    /// @notice Pauses escrow operations.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses escrow operations.
    function unpause() external onlyOwner {
        _unpause();
    }

    function _deposit(uint256 escrowId, uint256 amount) internal {
        Escrow storage escrow = _escrow(escrowId);
        if (msg.sender != escrow.buyer) revert NotParticipant();
        if (escrow.status != EscrowStatus.Pending) revert InvalidStatus();
        if (amount != registry.priceOf(escrow.propertyId)) revert InvalidAmount();
        escrow.amount = amount;
        escrow.status = EscrowStatus.Active;
        escrow.depositedAt = block.timestamp;
        emit FundsDeposited(escrowId, amount);
    }

    function _releaseFunds(uint256 escrowId) internal {
        Escrow storage escrow = _escrow(escrowId);
        if (escrow.status != EscrowStatus.Active && escrow.status != EscrowStatus.Disputed) revert InvalidStatus();
        escrow.status = EscrowStatus.Completed;
        propertyEscrow[escrow.propertyId] = 0;
        uint256 fee = (escrow.amount * platformFeePercent) / FEE_DENOMINATOR;
        uint256 sellerAmount = escrow.amount - fee;
        accruedFees += fee;
        registry.transferPropertyOwnership(escrow.propertyId, escrow.buyer);
        propertyToken.mintDeed(escrow.buyer, escrow.propertyId, "ipfs://deed-metadata-pending");
        (bool ok,) = escrow.seller.call{value: sellerAmount}("");
        require(ok, "seller transfer failed");
        emit EscrowCompleted(escrowId);
    }

    function _refund(uint256 escrowId) internal {
        Escrow storage escrow = _escrow(escrowId);
        uint256 amount = escrow.amount;
        escrow.amount = 0;
        escrow.status = EscrowStatus.Refunded;
        propertyEscrow[escrow.propertyId] = 0;
        (bool ok,) = escrow.buyer.call{value: amount}("");
        require(ok, "refund failed");
        emit EscrowRefunded(escrowId);
    }

    function _escrow(uint256 escrowId) internal view returns (Escrow storage escrow) {
        if (escrowId == 0 || escrowId > escrowCount) revert InvalidEscrow();
        escrow = escrows[escrowId];
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
