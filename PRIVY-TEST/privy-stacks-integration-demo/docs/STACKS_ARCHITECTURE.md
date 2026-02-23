# Stacks Architecture (As Implemented)

This document explains exactly how the current app works with Stacks and the safe path to add external Stacks wallets later.

## TL;DR

- Current state: Stacks transactions are signed through Privy-managed wallets on the backend.
- Wallet UI constraint: actions are gated to `walletClientType === 'privy'`.
- Not currently supported in-app: connecting Leather/Xverse through Privy modal as native Stacks external connectors.

## Current Flow (End-to-End)

1. User authenticates with Privy in `src/providers.tsx` and `src/app/page.tsx`.
2. Frontend gets Privy access token (`getAccessToken`) and sends it to API routes.
3. API route loads wallet metadata/public key from Privy (`walletApi.getWallet`).
4. API route builds unsigned Stacks tx:
   - STX transfer: `makeUnsignedSTXTokenTransfer`
   - Contract call: `makeUnsignedContractCall`
   - Contract deploy: `makeUnsignedContractDeploy`
5. API route computes pre-sign hash (`sigHashPreSign`) using `TransactionSigner`.
6. API route calls Privy `raw_sign` via `signRaw` (`src/utils/exportPrivyWallet.ts`).
7. Signature is tested with recovery variants in `broadcastWithRecoveryTesting` (`src/utils/stacks.ts`).
8. First successful signature variant is broadcast; txid and diagnostics returned to client.

## Where Stacks Addresses Come From

- Public key is fetched from Privy wallet data.
- Stacks addresses are derived locally from the same key:
  - client: `getAddressFromPublicKey(...)` in `src/app/page.tsx`
  - server: `publicKeyToAddress(...)` in transaction routes

This is why the app can operate on Stacks without a direct Leather/Xverse connector today.

## Network / Route Matrix

- `POST /api/transfer-stx`: testnet STX transfer.
- `POST /api/deploy-contract`: testnet contract deploy.
- `POST /api/buy-meme`: mainnet contract call (STX.city buy path).
- `POST /api/sell-meme`: mainnet contract call (STX.city sell path).

## Known Constraints

- Some routes use hardcoded addresses/amounts (demo values).
- Auth verification is not equally strict in every endpoint.
- External Stacks wallet connect UX (Leather/Xverse) is not wired in this app yet.

## Safe Provision Plan (No Breaking Changes)

Goal: add external Stacks wallets while keeping existing Privy flow fully functional.

1. Keep current Privy signer flow unchanged as `PrivyManagedSigner`.
2. Introduce a signer adapter contract:
   - `getStacksAddress()`
   - `signPrehash(hexHash)`
   - `kind` (`privy_managed` | `stacks_external`)
3. Add a second connect path for Stacks wallets (Leather/Xverse) outside Privy modal.
4. Reuse existing transaction-build + broadcast utilities by swapping only signer source.
5. Persist wallet linkage in app DB:
   - `privy_user_id`
   - `stx_address`
   - `wallet_source`

This avoids large refactors and preserves current demo behavior.

## DeGrants Notes Template

Use this wording in your notes/proposal:

- Authentication and user identity are managed by Privy.
- Stacks transactions are built with `@stacks/transactions` and signed via Privy `raw_sign`.
- Recovery-ID variant testing is implemented to improve signature acceptance on broadcast.
- Architecture is designed for incremental extension to external Stacks wallets (Leather/Xverse) via signer adapters, without replacing existing transaction logic.

## Product Context Extensions (Feb 17, 2026)

For current product direction (`stackshub.space` + `btchub.space`) and modular dapp planning, use these companion docs:

- `docs/PRODUCT_PRD_STACKS_BTC_HUB.md`
- `docs/PRODUCT_PRM_STACKS_BTC_HUB.md`
- `docs/STORY_FORK_EXTRACTION_FOR_STACKS_BTC_HUB.md`

## Modular Dapp Context

- This repo is a grant-evaluation submission on Stacks.
- The stack is modular by design.
- `Finding Nakamoto` is an ARG module in pre-production.
- `stackshub.space` and `btchub.space` package modules under one architecture.
- `story-fork-Study-Remix-` is the reference for paid branch mechanics.
- Ecosystem reference: `https://github.com/aibtcdev`

## Headless Evolutionary Media Model

This architecture should also be read as a headless media system:

- UI modules are presentation surfaces, not the source of narrative truth.
- Narrative structure is represented as branch relationships (parent -> child).
- Consensus signals (payments, votes, participation) influence canon transitions.
- AI-assisted branch generation is part of the evolution loop, not a side feature.

Reference POV doc:

- `docs/HEADLESS_ARG_COMPOSABILITY_POV.md`

## Story Fork Mechanics (Verified)

Source repo:

- `https://github.com/retroverse404/story-fork-Study-Remix-`

Verified behavior:

- Browse stories: `src/app/page.tsx`, `src/app/api/stories/route.ts`
- Read root free (`depth === 0`): `src/app/api/branches/[branchId]/read/route.ts`
- Read paywall amount comes from `readPrice` default `10`: `prisma/schema.prisma`
- Vote paywall amount comes from `votePrice` default `100`: `prisma/schema.prisma`
- Read and vote require `x-payment` when payments are enabled: `src/app/api/branches/[branchId]/read/route.ts`, `src/app/api/branches/[branchId]/vote/route.ts`
- Payment verification and settlement go through x402 helper: `src/lib/x402.ts`
- Canon recalculation on vote: `recalculateCanon(...)` in `src/app/api/branches/[branchId]/vote/route.ts`
- AI loop interval is `10 * 60 * 1000` ms: `openclaw-skill/src/tools.ts`

Flow:

```text
Browse -> Read -> Pay -> Vote -> Canon update -> AI branch generation
```
