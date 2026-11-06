# BSREMS Pro source audit

This document records a repository preparation review dated 2026-11-06. The review covers the current Solidity contracts, deployment scripts, API, frontend configuration, and files eligible for the initial Git commit. It is a source review with local checks. Independent smart-contract security review, live Sepolia deployment, and end-to-end wallet and service validation are outstanding.

## Current architecture

- `PropertyRegistry` and `EscrowManager` use UUPS proxies. The deployment script assigns registry and deed-token permissions to the escrow contract.
- `PropertyToken` implements ERC-721 deed minting and royalties. `RentalAgreement` manages rent and deposit flows.
- The Express API implements wallet nonce authentication and JWT role checks. MongoDB stores off-chain records and event logs, and Redis can cache statistics.
- The React interface uses wagmi for Hardhat and Sepolia. Frontend contract addresses come from Vite environment variables.

## Open findings

| Priority | Finding | Release implication |
| --- | --- | --- |
| High | `backend/src/routes/webhook.ts` accepts unsigned requests and suppresses insertion errors. | An exposed route can accept fabricated event data, and a 202 response only reflects the submitted event count. Require authenticated ingestion and validate persistence before exposing it. |
| High | `backend/src/routes/auth.ts` and `backend/src/middleware/auth.ts` fall back to a known JWT signing secret. Nonce verification and consumption also use separate database operations. | Require a strong secret at startup and consume each nonce atomically before issuing a token. |
| High | The UUPS contracts authorize upgrades through their owner accounts. The deployment script initially uses the deployer for privileged roles. | Establish separate operational roles and controlled upgrade custody before using real assets. |
| Medium | `frontend/src/hooks/useIPFS.ts` omits bearer tokens for two authenticated API routes. | The browser's metadata and upload flow can receive 401 responses. Wire wallet authentication into both requests and test the listing flow end to end. |
| Medium | `backend/src/services/contracts.ts` listens for new `PropertyListed` events. It has no historical backfill and writes only a subset of listing fields. The API admin verification route updates MongoDB separately. | On-chain and indexed state can diverge. Test restart recovery, event identity, and synchronization before relying on the API as a property record. |
| Medium | The seed script uses placeholder IPFS references. The Pinata service returns placeholder IDs without a JWT. | Local demos can exercise contract flows while leaving off-chain content unavailable. Verify pinning and retrieval with synthetic data before relying on the upload flow. |

## Release evidence

- Local checks on Node.js 22.23.2 and pnpm 11.25.0 passed all 12 Hardhat tests, the frontend production build, and the backend TypeScript check. A frozen offline install passed with dependencies already present.

- The contract suite covers registry listing, authorization and pagination, escrow release/refunds and dispute resolution, restricted deed minting and royalty reporting, and rental payments and deposits.
- Frontend and backend Vitest scripts exist. The repository contains no corresponding checked-in test suites.
- For a testnet release, confirm each explorer verification result, validate proxy ownership and roles, and retain the network deployment and upgrade manifests. Keep signing keys, JWT secrets, provider credentials, and real property documents outside Git.
- Before public distribution, confirm the intended license and add its full text. The package currently declares MIT.
