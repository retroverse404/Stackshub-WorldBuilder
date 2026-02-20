const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");

if (process.platform === "win32") {
  // Windows permission bits don't map cleanly; skip hard checks.
  console.warn("[env-check] Skipping .env.local permission check on Windows.");
  process.exit(0);
}

if (!fs.existsSync(envPath)) {
  console.warn("[env-check] .env.local not found; skipping permission check.");
  process.exit(0);
}

const mode = fs.statSync(envPath).mode & 0o777;
const isGroupReadable = (mode & 0o040) !== 0;
const isOtherReadable = (mode & 0o004) !== 0;

if (isGroupReadable || isOtherReadable) {
  console.error(
    `[env-check] Insecure permissions on .env.local (${mode.toString(
      8
    )}). Run: chmod 600 .env.local`
  );
  process.exit(1);
}

process.exit(0);
