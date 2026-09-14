import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { AI_FDE_PRODUCTION_DEMO, syntheticDemoHref } from "../../lib/ai-fde-demo.ts";

test("keeps the production demo host outside Vercel Preview", () => {
  assert.equal(syntheticDemoHref(undefined, undefined), AI_FDE_PRODUCTION_DEMO);
  assert.equal(syntheticDemoHref("production", "fdlc.ai"), AI_FDE_PRODUCTION_DEMO);
  assert.equal(syntheticDemoHref("development"), AI_FDE_PRODUCTION_DEMO);
  assert.equal(
    syntheticDemoHref("preview", "fdlc-abc123-jaydubya818.vercel.app"),
    AI_FDE_PRODUCTION_DEMO,
  );
});

test("points FDLC Preview at the matching AI-FDE Preview, not the retired Guide host", () => {
  assert.equal(
    syntheticDemoHref(
      "preview",
      "fdlc-git-cursor-fdlc-ux-journey-4fe2-jaydubya818.vercel.app",
    ),
    "https://ai-fde-git-cursor-fdlc-ux-journey-4fe2-jaydubya818.vercel.app",
  );
  assert.equal(
    syntheticDemoHref(
      "preview",
      "https://fdlc-git-cursor-fdlc-ux-journey-4fe2-jaydubya818.vercel.app/",
    ),
    "https://ai-fde-git-cursor-fdlc-ux-journey-4fe2-jaydubya818.vercel.app",
  );
  assert.doesNotMatch(
    syntheticDemoHref(
      "preview",
      "fdlc-git-cursor-fdlc-ux-journey-4fe2-jaydubya818.vercel.app",
    ),
    /ai-software-factory-mastery/,
  );
});

test("AI-FDE product page launches the demo through the Preview-aware helper", () => {
  const source = readFileSync("app/deploy/page.tsx", "utf8");
  assert.match(source, /syntheticDemoHref\(\)/);
  assert.doesNotMatch(source, /href=["']https:\/\/ai-fde-agent\.vercel\.app["']/);
});
