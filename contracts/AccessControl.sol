// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title BSREMSAccessControl
/// @notice Shared role registry for BSREMS operators.
contract BSREMSAccessControl is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    /// @notice Deploy role registry and assign all initial roles to the admin.
    /// @param admin Default admin, verifier, arbiter, and agent.
    constructor(address admin) {
        require(admin != address(0), "admin required");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
        _grantRole(ARBITER_ROLE, admin);
        _grantRole(AGENT_ROLE, admin);
    }

    /// @notice Returns true when an account can verify listings.
    /// @param account Wallet to inspect.
    /// @return allowed Whether the wallet has verifier permissions.
    function isVerifier(address account) external view returns (bool allowed) {
        return hasRole(VERIFIER_ROLE, account);
    }

    /// @notice Returns true when an account can resolve disputes.
    /// @param account Wallet to inspect.
    /// @return allowed Whether the wallet has arbiter permissions.
    function isArbiter(address account) external view returns (bool allowed) {
        return hasRole(ARBITER_ROLE, account);
    }
}
