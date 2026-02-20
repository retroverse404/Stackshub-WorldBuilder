# Vercel Setup (Stackshub-WorldBuilder)

This repo is ready to deploy from `main`:

- GitHub: `retroverse404/Stackshub-WorldBuilder`
- Branch: `main`

Use **two Vercel projects** from the same repo.

## 1) Project A: Public Site (Static)

- Vercel -> `Add New...` -> `Project`
- Import `Stackshub-WorldBuilder`
- Framework Preset: `Other`
- Root Directory: `Stackshub Website`
- Build Command: *(leave empty)*
- Output Directory: *(leave empty)*
- Install Command: *(leave empty)*
- Deploy

Expected base URL serves:

- `/GATES/stacks-hub-welcome.html`
- `/GATES/login-email.html`
- `/PAGES/single-scroll.html`

## 2) Project B: Privy Auth App (Next.js)

- Vercel -> `Add New...` -> `Project`
- Import `Stackshub-WorldBuilder` again
- Framework Preset: `Next.js`
- Root Directory: `Stackshub Website/PRIVY TEST/privy-stacks-integration-demo`
- Build/Install/Output: defaults
- Deploy

## 3) Environment Variables (Project B only)

Set in Vercel Project Settings -> `Environment Variables`:

- `NEXT_PUBLIC_PRIVY_APP_ID`
- `PRIVY_APP_SECRET`
- `QUORUMS_PUBLIC_KEY` (if used)
- `QUORUMS_PRIVATE_KEY` (if used)
- `QUORUMS_KEY` (if used)

Apply to `Production` and `Preview`.

## 4) Domain Mapping

Recommended:

- Project A (public site): `btchub.space`
- Project B (auth): `auth.btchub.space`

Then in Privy dashboard, allow:

- `https://btchub.space`
- `https://auth.btchub.space`

## 5) Wire the Bridge URL

Your flow expects:

- Public site origin as `websiteBase`
- Auth app origin as `privyBridge`

Production values:

- `websiteBase=https://btchub.space`
- `privyBridge=https://auth.btchub.space`

## 6) Post-Deploy Smoke Test

1. Open `https://btchub.space/GATES/stacks-hub-welcome.html`
2. Click `Onboard`
3. Click `Login with Email`
4. Verify Privy overlay opens from `auth.btchub.space`
5. Complete email OTP
6. Confirm redirect to `https://btchub.space/PAGES/single-scroll.html`

## 7) If Login Overlay Fails

- Confirm Project B deployed successfully (no runtime env errors).
- Confirm Privy allowed domains include both origins.
- Confirm `privyBridge` resolves to the live auth app domain.
- Confirm browser console has no blocked third-party/cookie policy errors.
