// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @notice Minimal upgrade-safe reentrancy guard for packages without OZ's upgradeable guard.
abstract contract UpgradeableReentrancyGuard is Initializable {
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;
    uint256 private _reentrancyStatus;

    error ReentrantCall();

    function __UpgradeableReentrancyGuard_init() internal onlyInitializing {
        _reentrancyStatus = NOT_ENTERED;
    }

    modifier nonReentrant() {
        if (_reentrancyStatus == ENTERED) revert ReentrantCall();
        _reentrancyStatus = ENTERED;
        _;
        _reentrancyStatus = NOT_ENTERED;
    }
}
