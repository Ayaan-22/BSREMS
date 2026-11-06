# BSREMS Pro

BSREMS Pro is a blockchain-based real estate management prototype. It combines Solidity contracts for property listings, sale escrow, rentals, and ERC-721 deeds with a React wallet interface and an Express API for off-chain data.

Use a local Hardhat network and synthetic property records for evaluation. See the [source audit](AUDIT.md) for integration gaps and deployment risks.

## Repository layout

| Path | Contents |
| --- | --- |
| `contracts/` | Solidity contracts and interfaces |
| `test/` | Hardhat contract tests |
| `scripts/` | Deployment, verification, upgrade, and local seed scripts |
| `frontend/` | React, Vite, and wagmi wallet interface |
| `backend/` | Express API, wallet authentication, MongoDB models, Redis caching, and Pinata integration |
| `.env.example` | Environment variable names and placeholders |

## Quick start

From the repository root, use Node.js 22 and pnpm 11. The root lockfile supplies dependencies for the contracts, frontend, and backend.

```sh
pnpm install --frozen-lockfile
pnpm compile
pnpm test
```

Start the local chain in a separate terminal and leave it running.

```sh
pnpm node
```

From another terminal at the repository root, deploy the contracts and optionally seed synthetic on-chain listings.

```sh
pnpm deploy:local
pnpm seed
```

Hardhat listens at `http://127.0.0.1:8545` on chain ID `31337`. Deployment writes addresses to `deployments/localhost.json`. Seeding submits transactions to the registry with placeholder IPFS references. Run it after starting the API if you want the API's live listener to see the new events.

### API and frontend

Start MongoDB and Redis locally. The API defaults to MongoDB at `mongodb://127.0.0.1:27017/bsrems_pro` and Redis at `redis://127.0.0.1:6379`.

Create `backend/.env` with a unique `JWT_SECRET`, `SEPOLIA_RPC_URL=http://127.0.0.1:8545` (the backend also uses this setting for local RPC), and `PROPERTY_REGISTRY_ADDRESS` set to the deployed registry address. Set `MONGODB_URI` and `REDIS_URL` if your services use different connection settings. For development without Pinata, leave `PINATA_JWT` unset to use placeholder IDs.

Create `frontend/.env.local` with the corresponding addresses from the deployment file:

| Deployment field | Frontend variable |
| --- | --- |
| `PropertyRegistry` | `VITE_CONTRACT_PROPERTY_REGISTRY` |
| `EscrowManager` | `VITE_CONTRACT_ESCROW_MANAGER` |
| `RentalAgreement` | `VITE_CONTRACT_RENTAL` |
| `PropertyToken` | `VITE_CONTRACT_TOKEN` |

Set `VITE_WALLETCONNECT_PROJECT_ID` if using WalletConnect. Vite exposes `VITE_*` values to browser clients, so keep signing keys, JWT secrets, and private provider credentials in server-side configuration.

Run these commands in separate terminals from the repository root.

```sh
pnpm backend:dev
pnpm frontend:dev
```

The default UI is `http://localhost:5173` and the API health endpoint is `http://localhost:5000/api/health`. If you change those origins, configure `FRONTEND_URL` in the backend and `VITE_API_URL` in the frontend. Connect an injected wallet to Hardhat for local transactions.

## Contracts

| Contract | Purpose |
| --- | --- |
| `PropertyRegistry` | UUPS-upgradeable registry for listings, verification, and ownership changes |
| `EscrowManager` | UUPS-upgradeable sale escrow with approvals, fees, refunds, and arbitration |
| `RentalAgreement` | Rent payments, deposits, and termination |
| `PropertyToken` | ERC-721 deed minting and royalties |

## API overview

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | API liveness |
| `GET /api/properties` | Paginated MongoDB listing search |
| `GET /api/properties/:id`, `GET /api/properties/:id/history` | Listing details and event history by MongoDB ID |
| `GET /api/user/:address/portfolio`, `GET /api/stats` | Wallet portfolio and platform statistics |
| `GET /api/auth/nonce/:address`, `POST /api/auth/verify` | Wallet challenge and JWT issuance |
| `POST /api/properties/metadata`, `POST /api/properties/ipfs/upload` | JWT-protected IPFS writes. Uploads use multipart field `file`. |
| `GET /api/admin/queue` | Verification queue for API users with the verifier or admin role |
| `POST /api/webhook/events` | Development event ingestion accepting an `events` array. Keep this endpoint off public networks. |

## Checks and Sepolia

```sh
pnpm test
pnpm coverage
pnpm frontend:build
pnpm --dir backend exec tsc --noEmit
```

For a Sepolia deployment, set `PRIVATE_KEY` and `SEPOLIA_RPC_URL` in the root `.env`. Run `pnpm deploy:sepolia`, then configure the frontend and backend with the addresses from `deployments/sepolia.json`. Set `VITE_SEPOLIA_RPC_URL` if the frontend needs an explicit browser-safe RPC URL. The optional `pnpm verify:sepolia` command uses `ETHERSCAN_API_KEY`. Review the output for each contract because the script logs individual verification failures and continues.

The root package declares MIT in its metadata. This checkout has no standalone license text.
