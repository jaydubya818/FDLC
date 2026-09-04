import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateSchema } from "@vercel/microfrontends/validation";

const configPath = resolve(process.cwd(), "microfrontends.json");

const expectedConfig = {
  $schema: "https://openapi.vercel.sh/microfrontends.json",
  version: "1",
  applications: {
    fdlc: {
      packageName: "fdlc-site",
      development: {
        fallback: "https://www.fdlc.ai",
      },
    },
    "ai-software-factory-mastery": {
      packageName: "ai-software-factory-mastery-site",
      development: {
        fallback: "https://ai-software-factory-mastery.vercel.app",
      },
      routing: [
        {
          group: "guide",
          paths: ["/guide", "/guide/:path*"],
        },
        {
          group: "guide-legacy",
          paths: [
            "/docs/:path*",
            "/visuals",
            "/topics",
            "/coverage",
            "/search",
            "/glossary",
            "/atlas",
          ],
        },
      ],
    },
  },
};

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

  if (canonicalJson(config) !== canonicalJson(expectedConfig)) {
    throw new Error("microfrontends.json does not match the approved FDLC routing contract");
  }

  const digest = createHash("sha256").update(canonicalJson(config)).digest("hex");
  console.log(`[microfrontends:check] valid root configuration ${digest}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[microfrontends:check] ${message}`);
  process.exitCode = 1;
}
