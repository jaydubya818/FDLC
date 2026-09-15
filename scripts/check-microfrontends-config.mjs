import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateSchema } from "@vercel/microfrontends/validation";

const configPath = resolve(process.cwd(), "microfrontends.json");
const expectedDigest = "6520e43f55c4dc03c3c51b1ae69a4ee11788b4d6b2175511a98b2a9e8dcace6e";

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

try {
  if (process.env.VC_MICROFRONTENDS_CONFIG !== undefined || process.env.VC_MICROFRONTENDS_CONFIG_FILE_NAME !== undefined) {
    throw new Error("Only the checked-in root microfrontends.json may configure this FDLC deployment");
  }
  if (!existsSync(configPath)) {
    throw new Error("microfrontends.json must exist at the repository root");
  }

  const source = readFileSync(configPath, "utf8");
  const config = validateSchema(source);
  const digest = createHash("sha256").update(canonicalJson(config)).digest("hex");

  if (digest !== expectedDigest) {
    throw new Error("microfrontends.json does not match the approved FDLC routing contract");
  }

  console.log(`[microfrontends:check] valid root configuration ${digest}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[microfrontends:check] ${message}`);
  process.exitCode = 1;
}
