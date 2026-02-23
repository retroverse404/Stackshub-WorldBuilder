# Production Deploy Checklist (Privy + Stacks)

Use this checklist to deploy quickly without breaking current behavior.

## 1) Environment Variables

Set these in your host (Vercel/project env):

- `NEXT_PUBLIC_PRIVY_APP_ID` (safe for client; exposed to browser)
- `PRIVY_APP_SECRET` (server only)
- `QUORUMS_PRIVATE_KEY` (server only)
- `QUORUMS_PUBLIC_KEY`
- `QUORUMS_KEY` (used for additional signer on wallet creation)
- `PRIVY_WALLET_OWNER_ID` (used by raw signing helper)

Notes for this repo:

- `src/utils/exportPrivyWallet.ts` references both `NEXT_PUBLIC_PRIVY_APP_ID` and `PRIVY_APP_ID` in different paths.
- For safety, either standardize code to one env name or also set `PRIVY_APP_ID` to the same value as `NEXT_PUBLIC_PRIVY_APP_ID`.

## 2) Privy Dashboard

- Add exact production domains to allowed origins (including `https://www...` if used).
- Ensure protocol/domain match exactly (no mismatch between `http`/`https` or subdomains).
- Verify login methods enabled match app config in `src/providers.tsx`.

## 3) API Deployment Model

- This app expects same-origin Next.js API routes under `/api/*`.
- If deploying frontend and API separately, define and use an explicit API base URL in the frontend.
- Confirm each route is reachable in production:
  - `/api/create-wallet`
  - `/api/get-wallet`
  - `/api/transfer-stx`
  - `/api/deploy-contract`
  - `/api/buy-meme`
  - `/api/sell-meme`
  - `/api/export-key`

## 4) Auth / CORS / Cookies

- Current flow uses bearer tokens (`Authorization: Bearer ...`), not cookie sessions.
- If frontend and API stay same-origin, extra CORS config is usually unnecessary.
- If cross-domain calls are introduced later, add strict CORS allowlist and test preflight.

## 5) Runtime Compatibility

- Ensure Node runtime on host is compatible with your Next.js version.
- Keep all Privy secrets server-side only.
- Never expose `PRIVY_APP_SECRET` or quorum private keys to client bundles.

## 6) Stacks Network Settings

- Confirm testnet/mainnet intent per route before go-live.
- Verify contract addresses and parameters:
  - `src/app/api/buy-meme/route.ts`
  - `src/app/api/sell-meme/route.ts`
- Replace hardcoded wallet/amount demo values with dynamic user-bound values before production.

## 7) Minimum Smoke Test (Required)

1. Login with Privy in production.
2. Create or retrieve wallet.
3. Fetch wallet public key (`/api/get-wallet`).
4. Execute one testnet STX transfer (`/api/transfer-stx`).
5. Verify tx broadcast/txid on Stacks explorer.

## 8) Rollback Safety

- Keep previous deployment ready for instant rollback.
- Deploy with env vars first, then code.
- Run smoke test immediately after release.
