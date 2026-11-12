// pm2 config for the VPS: `pm2 start ecosystem.config.cjs` (from the repo root).
// Reads .env (and .env.local, which wins) from this folder and hands every value to the app,
// so the standalone server gets them no matter where it's started from.
// After editing .env: `pm2 restart ecosystem.config.cjs --update-env`.
const fs = require("fs");
const path = require("path");

function readEnv(file) {
  const out = {};
  const full = path.join(__dirname, file);
  if (!fs.existsSync(full)) return out;
  const text = fs.readFileSync(full, "utf8").replace(/^﻿/, "");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    const quoted = value.match(/^(["'])(.*)\1$/);
    if (quoted) value = quoted[2];
    else value = value.replace(/\s+#.*$/, "");
    out[m[1]] = value;
  }
  return out;
}

const env = { NODE_ENV: "production", PORT: "6001", ...readEnv(".env"), ...readEnv(".env.local") };

module.exports = {
  apps: [
    {
      name: "APCAMS",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      env,
    },
  ],
};
