import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateSchema } from "@vercel/microfrontends/validation";
import { guideBridgeOrigin } from "../lib/guide-bridge.ts";

const expectedDigest = "794d525585a7f491e520b1332b3347e85f88cb580db6ef46883c918ed6e8458f";
const configPath = resolve(process.cwd(), "microfrontends.json");

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

try {
  if (!existsSync(configPath)) throw new Error("microfrontends.json must exist at the repository root");
  const config = validateSchema(readFileSync(configPath, "utf8"));
  const digest = createHash("sha256").update(JSON.stringify(canonicalize(config))).digest("hex");
  if (digest !== expectedDigest) throw new Error("microfrontends.json does not match the approved FDLC bridge routing contract");
  if (process.env.VC_MICROFRONTENDS_CONFIG !== undefined || process.env.VC_MICROFRONTENDS_CONFIG_FILE_NAME !== undefined) {
    throw new Error("Only the checked-in root microfrontends.json may configure this bridge");
  }
  guideBridgeOrigin();
  console.log(`[microfrontends:check] valid root bridge configuration ${digest}`);
} catch (error) {
  console.error(`[microfrontends:check] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
