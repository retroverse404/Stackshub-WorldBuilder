# Stacks Hub Modular UI (Milestone 3)

Proof-of-concept onboarding for a modular worldbuilding experience.

This milestone focuses on one problem: making onboarding simple for non-technical users while keeping blockchain and wallet setup logic behind the scenes.

## What This Demo Proves

- A user can start from a static onboarding page (`GATES/`).
- The user signs in with **email (Privy OTP)**.
- The system automatically checks for and provisions a **Privy embedded wallet** on **`bitcoin-segwit`**.
- The user is redirected into the modular worldbuilding experience (`PAGES/`, `SPACES/`, `WORLDS/`) without being exposed to backend wallet APIs.

## Milestone 3 Technical Goal (Clear Version)

We are using Stacks as the technical foundation for the onboarding pipeline by:

- establishing authenticated identity with Privy (email-first),
- preparing a Bitcoin-compatible wallet (`bitcoin-segwit`) for future Stacks/BTC interactions,
- and keeping the wallet creation/signing backend logic in the Privy bridge app instead of the static UI pages.

This is a **demo / proof of concept**, not a production release.

## Onboarding Flow (Implemented)

1. User lands on `GATES/stacks-hub-welcome.html` and clicks **Onboard**.
2. The page builds a login URL for `GATES/login-email.html` and passes environment-aware params (`websiteBase`, `privyBridge`).
3. `GATES/login-email.html` opens a Privy login experience:
   - preferred path: embedded iframe overlay (`/gate-overlay`)
   - fallback path: top-level login page (`/gates-login`) if embedding is blocked
4. The Next.js Privy bridge app authenticates with **Privy email login** (`loginMethods: ['email']`).
5. After auth, the bridge checks linked accounts for a wallet with `chainType === 'bitcoin-segwit'`.
6. If missing, it calls `POST /api/create-wallet` to create one server-side via Privy.
7. The bridge sends status updates back to the static gate via `window.postMessage`.
8. The static gate redirects the user into `PAGES/single-scroll.html`.

## How Stacks Is Used in the Onboarding (Important)

The onboarding does not ask the user to manually manage a wallet.

- The user sees an email login flow.
- The system provisions a **Bitcoin SegWit wallet** in the background through Privy.
- This wallet is the bridge into later Stacks/BTC actions (signing, transfers, contracts) implemented in the Next.js app APIs and utils.

In other words: **Stacks capability is prepared during onboarding, but the complexity is hidden**.

## Architecture (Modular + Hidden Backend)

### Frontend Modules (visible to user)

- `GATES/`: onboarding and login entry pages
- `PAGES/`: navigation / landing / single-scroll experience
- `SPACES/`: modular spatial experiences (VR tour, open areas)
- `WORLDS/`: packaged world instances
- `MODULES/`: reusable themed content blocks

### Privy Bridge App (backend-facing logic under the hood)

Location:

- `PRIVY TEST/privy-stacks-integration-demo/`

Responsibilities:

- Privy React auth provider (email login only)
- embedded gate overlay route (`/gate-overlay`)
- top-level gate login fallback route (`/gates-login`)
- server-side wallet creation (`/api/create-wallet`)
- wallet lookup and additional Stacks/BTC transaction utilities for later flows

## Code-Verified Implementation Notes

- Email login is explicitly configured in `src/providers.tsx` with `loginMethods: ['email']`.
- Onboarding overlay route (`src/app/gate-overlay/page.tsx`) checks linked wallets and looks for `chainType === 'bitcoin-segwit'`.
- If absent, it calls `/api/create-wallet` in the background and does **not block auth success**.
- `src/app/api/create-wallet/route.ts` creates a Privy wallet with `chainType: 'bitcoin-segwit'`.
- The static gate page updates UI state based on `postMessage` events:
  - `STACKS_PRIVY_FRAME_READY`
  - `STACKS_PRIVY_LOGIN_STARTED`
  - `STACKS_PRIVY_WALLET_STATUS`
  - `STACKS_PRIVY_AUTH_SUCCESS`

## Local Run (Reviewer-Friendly)

From `Stackshub Website/`:

```bash
npm install --prefix "PRIVY TEST/privy-stacks-integration-demo"
bash scripts/start-local.sh
bash scripts/smoke-test.sh
```

Default local URLs:

- Static site: `http://127.0.0.1:8091/`
- Privy bridge app: `http://127.0.0.1:3001/`

Start onboarding here:

- `http://127.0.0.1:8091/GATES/stacks-hub-welcome.html`

## Environment Variables (Privy Bridge App)

Create `.env.local` in `PRIVY TEST/privy-stacks-integration-demo/` using `.env.local.example`:

- `NEXT_PUBLIC_PRIVY_APP_ID`
- `PRIVY_APP_ID`
- `PRIVY_APP_SECRET`
- `QUORUMS_PUBLIC_KEY`
- `QUORUMS_PRIVATE_KEY`
- `QUORUMS_KEY`
- `PRIVY_WALLET_OWNER_ID`

## Scope / Limitations (POC)

- Demo prioritizes onboarding UX and wallet provisioning flow.
- Some advanced Stacks/BTC APIs exist in the Privy bridge app for experiments, but they are not required for the gate onboarding path.
- Production hardening (full audit logging, stricter token validation, rate limits, error telemetry, domain policies) is still pending.

## Why This Matters for the Modular Worldbuilding Direction

The onboarding flow is intentionally separated from the world modules:

- creators can keep expanding `SPACES/`, `WORLDS/`, and `MODULES/`
- while auth, wallet provisioning, and chain-specific logic remain centralized in the Privy bridge app

This supports a modular worldbuilding approach with a simpler user experience.
