// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEscrowManager {
    enum EscrowStatus {
        Pending,
        Active,
        Completed,
        Disputed,
        Refunded,
        Cancelled
    }
}
