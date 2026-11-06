// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPropertyRegistry {
    enum PropertyStatus {
        Active,
        UnderContract,
        Sold,
        Delisted
    }

    function ownerOfProperty(uint256 id) external view returns (address);
    function priceOf(uint256 id) external view returns (uint256);
    function statusOf(uint256 id) external view returns (PropertyStatus);
    function escrowLock(uint256 id) external;
    function transferPropertyOwnership(uint256 id, address to) external;
}
