# Demo POV Documentation (Message-First)

## Purpose

This document captures the **demo narrative** for this repo from a "show the message clearly" perspective.

Core message:

- Privy-authenticated users can trigger backend Stacks transactions.
- Privy-managed wallet keys can sign Stacks payloads through `raw_sign`.
- The app can broadcast usable Stacks transactions (transfer, contract call, contract deploy) after recovery-id normalization.

Narrative extension:

- The product is a headless/evolutionary media sandbox.
- Branching ARG modules are composed under one stack.
- Consensus can determine canon parent/child narrative paths over time.
- `Finding Nakamoto` is one narrative module in this model.
- UI presentation should stay faithful to authored interface design.
- Original authored content is preserved; GenAI supports extensions and variants.

## Demo Success Criteria

The demo is considered successful when an audience can see:

1. Entry starts at `GATES/stacks-hub-welcome.html`, then moves to `GATES/login-email.html` for sign-in.
2. A Privy wallet is available for the authenticated user.
3. A backend route signs and broadcasts at least one Stacks transaction.
4. The response returns a `txid` and signing metadata (including recovery-id used).

## Audience-Facing Story (What to Say)

Use this script in demos:

1. "We start with Privy login and embedded wallet context."
2. "The app never asks users to manually sign Stacks payloads in a browser wallet."
3. "Server builds an unsigned Stacks transaction and computes pre-sign hash."
4. "Privy-managed key signs that hash via `raw_sign`."
5. "Backend tests recovery-id variants and broadcasts the valid signature."
6. "We get back a real transaction ID and can inspect it on-chain."

## Recommended Live Flow

1. Open app root (`/`) and authenticate.
2. Landing page shows `GATES/stacks-hub-welcome.html`; click **Onboard** to go to `GATES/login-email.html`.
3. Click **Login with Email** to open Privy sign-in.
4. Ensure a wallet exists (client or server create wallet path).
5. Trigger `POST /api/transfer-stx` (testnet, safest for demos).
6. Show returned `txid`, `decodedSignature`, and `recoveryIdUsed`.
7. Optionally show:
   - `POST /api/deploy-contract` (testnet contract deploy)
   - `POST /api/buy-meme` / `POST /api/sell-meme` (mainnet STX.city examples)

## What This Demo Proves

- End-to-end Privy auth + wallet lookup in app context.
- Backend-generated Stacks transaction payloads.
- Privy key signing integration for Stacks via server route.
- Broadcast retry path with signature-recovery handling.

## What Is Intentionally Demo Scope (Not Production-Ready Yet)

- Mainnet meme routes include fixed contract/amount assumptions.
- Some auth/token checks are inconsistent across endpoints.
- No generalized signer abstraction yet for external Stacks wallets.
- UI copy still references Bitcoin in places while flow demonstrates Stacks signing.

## Demo Environment Checklist

Required in `.env.local`:

- `NEXT_PUBLIC_PRIVY_APP_ID`
- `PRIVY_APP_SECRET`
- `QUORUMS_PUBLIC_KEY`
- `QUORUMS_PRIVATE_KEY`
- `QUORUMS_KEY`

Also required:

- Privy app configured with matching origins.
- Testnet STX funding for the demo wallet if using transfer/deploy routes.

## Demo Endpoints Quick Reference

- `POST /api/create-wallet`
- `GET /api/get-wallet`
- `POST /api/transfer-stx` (testnet)
- `POST /api/deploy-contract` (testnet)
- `POST /api/buy-meme` (mainnet example)
- `POST /api/sell-meme` (mainnet example)

## Notes for Stakeholders

This demo is already effective for communicating capability:

- Privy can be used as the wallet/key control plane.
- Stacks signing can be driven from backend safely and repeatably.
- The architecture is extensible toward a production signing service with stronger policy and auth hardening.

For GitBook narrative positioning, pair this doc with:

- `docs/HEADLESS_ARG_COMPOSABILITY_POV.md`
