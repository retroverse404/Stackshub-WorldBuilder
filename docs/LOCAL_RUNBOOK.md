# Local Runbook

This runbook keeps local testing predictable while preserving the current working app behavior.

For deployment steps, see:

- `Stackshub Website/docs/DEPLOY_GITHUB_VERCEL.md`

## Components

- Static site server (`Stackshub Website`): serves `GATES`, `PAGES`, `SPACES`, `WORLDS`.
- Privy Next app (`PRIVY TEST/privy-stacks-integration-demo`): serves `/gate-overlay` and `/gates-login`.

Default ports:

- Static: `8091`
- Privy: `3001`

## Start

```bash
bash "Stackshub Website/scripts/start-local.sh"
```

## Status

```bash
bash "Stackshub Website/scripts/status-local.sh"
```

## Smoke Test

```bash
bash "Stackshub Website/scripts/smoke-test.sh"
```

## Sync Canonical Pages/Gates To Privy Public Mirror

Dry-run:

```bash
bash "Stackshub Website/scripts/sync-public-mirror.sh" --dry-run
```

Apply:

```bash
bash "Stackshub Website/scripts/sync-public-mirror.sh"
```

## Security Check Before Push

```bash
bash "Stackshub Website/scripts/security-check.sh"
```

## Stop

```bash
bash "Stackshub Website/scripts/stop-local.sh"
```

## Manual Test Flow

1. Open `http://127.0.0.1:8091/`
2. Confirm redirect to `GATES/stacks-hub-welcome.html`
3. Click `Onboard`
4. On `login-email.html`, click `Login with Email`
5. Confirm Privy prompt appears and successful auth continues to `PAGES/single-scroll.html`
6. On Hero, click `Play Demo` -> Greenland launches in overlay -> close via `Exit Agent View`
7. In `What This Is`, click `Play Demo` -> VR Tour launches in overlay -> close via top overlay button

## Notes

- Local gate flow intentionally appends `privyBridge` and `websiteBase` query params from welcome page.
- Local login overlay adds `forceLogin=1` for easier repeated login testing.
- Production host/domain wiring should later replace local bridge defaults through environment/domain config.
