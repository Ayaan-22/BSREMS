// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UpgradeableReentrancyGuard} from "./UpgradeableReentrancyGuard.sol";

/// @title PropertyRegistry
/// @notice Manages property listing, verification, delisting, escrow locks, and ownership lifecycle.
contract PropertyRegistry is Initializable, AccessControlUpgradeable, PausableUpgradeable, UpgradeableReentrancyGuard, UUPSUpgradeable {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant ESCROW_ROLE = keccak256("ESCROW_ROLE");

    enum PropertyStatus {
        Active,
        UnderContract,
        Sold,
        Delisted
    }

    struct Property {
        uint256 id;
        string ipfsMetadataHash;
        address owner;
        uint256 price;
        PropertyStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(uint256 => Property) public properties;
    mapping(address => uint256[]) public ownerProperties;
    mapping(uint256 => bool) public verifiedProperties;
    uint256 public propertyCount;

    event PropertyListed(uint256 indexed id, address indexed owner, uint256 price);
    event PropertyUpdated(uint256 indexed id, uint256 newPrice, PropertyStatus status);
    event PropertyVerified(uint256 indexed id);
    event OwnershipTransferred(uint256 indexed id, address from, address to);
    event PropertyDelisted(uint256 indexed id);
    event RegistryPaused(address indexed account);
    event RegistryUnpaused(address indexed account);

    error InvalidProperty();
    error InvalidMetadata();
    error InvalidPrice();
    error NotPropertyOwner();
    error NotTransferable();
    error InvalidPage();

    /// @notice Initializes the upgradeable registry.
    /// @param admin Address receiving admin, verifier, agent, and escrow roles.
    function initialize(address admin) public initializer {
        require(admin != address(0), "admin required");
        __AccessControl_init();
        __Pausable_init();
        __UpgradeableReentrancyGuard_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
        _grantRole(AGENT_ROLE, admin);
    }

    /// @notice Lists a property with IPFS metadata.
    /// @param ipfsHash IPFS CID or URI for the metadata document.
    /// @param price Asking price in wei.
    /// @return propertyId Newly assigned property id.
    function listProperty(string calldata ipfsHash, uint256 price)
        external
        whenNotPaused
        nonReentrant
        returns (uint256 propertyId)
    {
        if (bytes(ipfsHash).length == 0) revert InvalidMetadata();
        if (price == 0) revert InvalidPrice();

        propertyId = ++propertyCount;
        properties[propertyId] = Property({
            id: propertyId,
            ipfsMetadataHash: ipfsHash,
            owner: msg.sender,
            price: price,
            status: PropertyStatus.Active,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        ownerProperties[msg.sender].push(propertyId);
        emit PropertyListed(propertyId, msg.sender, price);
    }

    /// @notice Updates metadata and price for an active or delisted property.
    /// @param id Property id.
    /// @param ipfsHash New IPFS metadata hash.
    /// @param price New asking price in wei.
    function updateProperty(uint256 id, string calldata ipfsHash, uint256 price) external whenNotPaused {
        Property storage property = _ownedProperty(id);
        if (property.status == PropertyStatus.Sold || property.status == PropertyStatus.UnderContract) revert NotTransferable();
        if (bytes(ipfsHash).length == 0) revert InvalidMetadata();
        if (price == 0) revert InvalidPrice();
        property.ipfsMetadataHash = ipfsHash;
        property.price = price;
        property.status = PropertyStatus.Active;
        property.updatedAt = block.timestamp;
        emit PropertyUpdated(id, price, property.status);
    }

    /// @notice Delists an active property.
    /// @param id Property id.
    function delistProperty(uint256 id) external whenNotPaused {
        Property storage property = _ownedProperty(id);
        if (property.status != PropertyStatus.Active) revert NotTransferable();
        property.status = PropertyStatus.Delisted;
        property.updatedAt = block.timestamp;
        emit PropertyDelisted(id);
        emit PropertyUpdated(id, property.price, property.status);
    }

    /// @notice Marks a property as verified.
    /// @param id Property id.
    function verifyProperty(uint256 id) external onlyRole(VERIFIER_ROLE) whenNotPaused {
        _requireProperty(id);
        verifiedProperties[id] = true;
        properties[id].updatedAt = block.timestamp;
        emit PropertyVerified(id);
    }

    /// @notice Returns a property.
    /// @param id Property id.
    /// @return property Property record.
    function getProperty(uint256 id) external view returns (Property memory property) {
        _requireProperty(id);
        return properties[id];
    }

    /// @notice Returns all property ids owned by a wallet.
    /// @param owner Wallet to inspect.
    /// @return ids Property ids.
    function getPropertiesByOwner(address owner) external view returns (uint256[] memory ids) {
        return ownerProperties[owner];
    }

    /// @notice Returns active properties with pagination.
    /// @param offset Number of active records to skip.
    /// @param limit Maximum records to return.
    /// @return page Active property records.
    function getAllActiveProperties(uint256 offset, uint256 limit) external view returns (Property[] memory page) {
        if (limit == 0 || limit > 100) revert InvalidPage();
        uint256 activeCount;
        for (uint256 i = 1; i <= propertyCount; i++) {
            if (properties[i].status == PropertyStatus.Active) activeCount++;
        }
        if (offset >= activeCount) return new Property[](0);
        uint256 size = activeCount - offset;
        if (size > limit) size = limit;
        page = new Property[](size);
        uint256 seen;
        uint256 written;
        for (uint256 i = 1; i <= propertyCount && written < size; i++) {
            if (properties[i].status != PropertyStatus.Active) continue;
            if (seen++ < offset) continue;
            page[written++] = properties[i];
        }
    }

    /// @notice Returns the current property owner.
    /// @param id Property id.
    /// @return owner Owner wallet.
    function ownerOfProperty(uint256 id) external view returns (address owner) {
        _requireProperty(id);
        return properties[id].owner;
    }

    /// @notice Returns the current property price.
    /// @param id Property id.
    /// @return price Price in wei.
    function priceOf(uint256 id) external view returns (uint256 price) {
        _requireProperty(id);
        return properties[id].price;
    }

    /// @notice Returns the current property status.
    /// @param id Property id.
    /// @return status Property status.
    function statusOf(uint256 id) external view returns (PropertyStatus status) {
        _requireProperty(id);
        return properties[id].status;
    }

    /// @notice Locks an active property for escrow.
    /// @param id Property id.
    function escrowLock(uint256 id) external onlyRole(ESCROW_ROLE) whenNotPaused {
        _requireProperty(id);
        Property storage property = properties[id];
        if (property.status != PropertyStatus.Active) revert NotTransferable();
        property.status = PropertyStatus.UnderContract;
        property.updatedAt = block.timestamp;
        emit PropertyUpdated(id, property.price, property.status);
    }

    /// @notice Transfers property ownership after escrow completion.
    /// @param id Property id.
    /// @param to New owner.
    function transferPropertyOwnership(uint256 id, address to) external onlyRole(ESCROW_ROLE) whenNotPaused {
        _requireProperty(id);
        require(to != address(0), "to required");
        Property storage property = properties[id];
        if (property.status != PropertyStatus.UnderContract) revert NotTransferable();
        address from = property.owner;
        property.owner = to;
        property.status = PropertyStatus.Sold;
        property.updatedAt = block.timestamp;
        ownerProperties[to].push(id);
        emit OwnershipTransferred(id, from, to);
        emit PropertyUpdated(id, property.price, property.status);
    }

    /// @notice Pauses property operations.
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
        emit RegistryPaused(msg.sender);
    }

    /// @notice Unpauses property operations.
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit RegistryUnpaused(msg.sender);
    }

    function _ownedProperty(uint256 id) internal view returns (Property storage property) {
        _requireProperty(id);
        property = properties[id];
        if (property.owner != msg.sender && !hasRole(AGENT_ROLE, msg.sender)) revert NotPropertyOwner();
    }

    function _requireProperty(uint256 id) internal view {
        if (id == 0 || id > propertyCount) revert InvalidProperty();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
