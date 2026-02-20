# Deploy Guide (GitHub -> Vercel)

This is the simplest safe path to deploy what is currently working.

## 1. Use this app as deploy root

Deploy this folder:

`Stackshub Website/PRIVY TEST/privy-stacks-integration-demo`

## 2. Pre-deploy checks (required)

From your workspace root:

```bash
bash "Stackshub Website/scripts/sync-public-mirror.sh"
bash "Stackshub Website/scripts/security-check.sh"
bash "Stackshub Website/scripts/start-local.sh"
bash "Stackshub Website/scripts/smoke-test.sh"
bash "Stackshub Website/scripts/stop-local.sh"
```

If any command fails, do not deploy yet.

## 3. Push to GitHub

### Option A: existing repo remote

```bash
cd "Stackshub Website/PRIVY TEST/privy-stacks-integration-demo"
git add .
git commit -m "Prepare deploy: gate-first flow + demos + local ops scripts"
git push origin main
```

### Option B: new repo

```bash
cd "Stackshub Website/PRIVY TEST/privy-stacks-integration-demo"
git init
git add .
git commit -m "Initial deploy-ready app"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 4. Create project in Vercel

1. Open Vercel -> New Project.
2. Import your GitHub repo.
3. Set **Root Directory** to:
   `Stackshub Website/PRIVY TEST/privy-stacks-integration-demo`
4. Framework Preset: **Next.js**.
5. Build command/output: leave defaults.

## 5. Set Environment Variables in Vercel

Add these variables in Vercel Project Settings -> Environment Variables:

- `NEXT_PUBLIC_PRIVY_APP_ID`
- `PRIVY_APP_SECRET`
- `QUORUMS_PUBLIC_KEY`
- `QUORUMS_PRIVATE_KEY`
- `QUORUMS_KEY`

Set them for:

- Production
- Preview

Notes:

- `NEXT_PUBLIC_PRIVY_APP_ID` is public-safe.
- `PRIVY_APP_SECRET` and `QUORUMS_PRIVATE_KEY` are secrets. Never commit them.

## 6. Deploy and verify

After Vercel deploy finishes, test:

1. `/` loads `GATES/stacks-hub-welcome.html`
2. Click `Onboard` -> `GATES/login-email.html`
3. Click `Login with Email` -> Privy flow appears
4. Successful login -> `PAGES/single-scroll.html`
5. Hero `Play Demo` opens Greenland and closes back cleanly
6. `What This Is` `Play Demo` opens VR Tour and closes back cleanly

## 7. Connect custom domain later (`stackshub.space`)

1. Vercel Project -> Settings -> Domains -> add `stackshub.space`.
2. Update DNS records as Vercel instructs.
3. Re-run flow checks on domain.

## 8. If deployment fails

Check in this order:

1. Missing env vars in Vercel.
2. Wrong Root Directory.
3. Security check not run locally.
4. `sync-public-mirror.sh` not run before push.
