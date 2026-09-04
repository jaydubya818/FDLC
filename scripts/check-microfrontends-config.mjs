import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateSchema } from "@vercel/microfrontends/validation";

const configPath = resolve(process.cwd(), "microfrontends.json");
const expectedDigest = "e63f913563c1864feac38c7786e06d146892d34a4f0f74179999ff1d565e7e8b";

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
