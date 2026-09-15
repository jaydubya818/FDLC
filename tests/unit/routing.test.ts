import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { validateRouting } from "@vercel/microfrontends/next/testing";
import { validateSchema } from "@vercel/microfrontends/validation";
import { NextRequest } from "next/server.js";
import { config as proxyConfig, proxy } from "../../proxy.ts";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".generated.ts") ? [path] : [];
  });
}

test("publishes one apex origin and delegates Guide discovery", () => {
  const siteSource = readFileSync("lib/site.ts", "utf8");
  const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
  const robotsSource = readFileSync("app/robots.ts", "utf8");
  assert.match(siteSource, /https:\/\/fdlc\.ai/);
  assert.doesNotMatch(siteSource, /https:\/\/www\.fdlc\.ai/);
  assert.match(sitemapSource, /"\/specification"/);
  assert.doesNotMatch(sitemapSource, /"\/guide(?:\/|"|`)/);
  assert.doesNotMatch(sitemapSource, /"\/spec"/);
  assert.match(robotsSource, /`\$\{siteUrl\}\/sitemap\.xml`/);
  assert.match(robotsSource, /`\$\{siteUrl\}\/guide\/sitemap\.xml`/);
});

test("keeps Guide links same-origin and forces navigation across the app boundary", () => {
  const sources = [...sourceFiles("app"), ...sourceFiles("data")];
  for (const path of sources) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /ai-software-factory-mastery\.vercel\.app/, path);
    assert.doesNotMatch(source, /<Link\b[^>]*\bhref=(?:"\/guide|\{[^}]*guide)/i, path);
  }
});

test("pins the Microfrontends runtime dependency", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(packageJson.dependencies["@vercel/microfrontends"], "2.4.0");
});

test("declares the default app, package names, and production development fallbacks", () => {
  const source = readFileSync("microfrontends.json", "utf8");
  const microfrontends = validateSchema(source);

  assert.deepEqual(Object.keys(microfrontends.applications), [
    "fdlc",
    "ai-software-factory-mastery",
  ]);
  assert.deepEqual(microfrontends.applications.fdlc, {
    packageName: "fdlc-site",
    development: { fallback: "https://fdlc.ai" },
  });
  const guideApplication = microfrontends.applications["ai-software-factory-mastery"];
  assert.equal(
    guideApplication.packageName,
    "ai-software-factory-mastery-site",
  );
  assert.deepEqual(
    guideApplication.development,
    { fallback: "https://ai-software-factory-mastery.vercel.app" },
  );
  assert.ok("routing" in guideApplication);
  assert.deepEqual(
    guideApplication.routing,
    [
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
  );
});

test("routes the shared-domain contract to the intended Vercel projects", () => {
  assert.doesNotThrow(() =>
    validateRouting("./microfrontends.json", {
      fdlc: [
        "/",
        "/framework",
        "/architecture",
        "/specification",
        "/mission-control",
        "/not-a-published-route",
      ],
      "ai-software-factory-mastery": [
        "/guide",
        "/guide/search",
        "/guide/01-understand/01-why-software-engineering-is-changing",
        "/guide/search-index.json",
        "/docs/guide",
        "/docs/appendix/glossary",
        "/visuals",
        "/topics",
        "/coverage",
        "/search",
        "/glossary",
        "/atlas",
      ],
    }),
  );
});

test("keeps the AI-FDE handoff and independent child behind one narrow proxy prefix", () => {
  const deployPage = readFileSync("app/deploy/page.tsx", "utf8");
  const childConfig = readFileSync("products/ai-fde/apps/web/next.config.ts", "utf8");
  const productContract = readFileSync("products/ai-fde/apps/web/lib/product.ts", "utf8");
  const childPackage = JSON.parse(readFileSync("products/ai-fde/apps/web/package.json", "utf8"));
  const childVercel = JSON.parse(readFileSync("products/ai-fde/apps/web/vercel.json", "utf8"));
  const rootVercel = JSON.parse(readFileSync("vercel.json", "utf8"));

  assert.match(deployPage, /href="\/deploy\/app"/);
  assert.doesNotMatch(deployPage, /ai-fde-agent\.vercel\.app/);
  assert.match(childConfig, /const appBasePath = "\/deploy\/app"/);
  assert.match(childConfig, /basePath: appBasePath/);
  assert.doesNotMatch(childConfig, /withMicrofrontends/);
  assert.equal(childPackage.dependencies["@vercel/microfrontends"], undefined);
  assert.equal(childPackage.scripts.build, "next build --webpack");
  assert.match(productContract, /export const APP_BASE_PATH = "\/deploy\/app"/);
  assert.match(childVercel.buildCommand, /NEXT_PUBLIC_AI_FDE_HOSTED_DEMO=true/);
  assert.match(childVercel.buildCommand, /NEXT_PUBLIC_AI_FDE_API_URL=https:\/\/api\.ai-fde\.invalid\/api/);
  assert.equal(childVercel.git.deploymentEnabled.main, false);
  assert.deepEqual(rootVercel.rewrites, [
    {
      source: "/deploy/app",
      destination: "https://ai-hu09aqvzj-jaydubya818.vercel.app/deploy/app",
    },
    {
      source: "/deploy/app/:path*",
      destination: "https://ai-hu09aqvzj-jaydubya818.vercel.app/deploy/app/:path*",
    },
  ]);
  assert.equal(rootVercel.git.deploymentEnabled.main, false);
});

test("limits the retired Guide-host guard to its two colliding routes", () => {
  assert.deepEqual(proxyConfig.matcher, ["/", "/architecture"]);
});

function withLegacyGuideRedirects(
  value: string | undefined,
  callback: () => void,
) {
  const previousValue = process.env.GUIDE_LEGACY_REDIRECTS_ENABLED;

  if (value === undefined) {
    delete process.env.GUIDE_LEGACY_REDIRECTS_ENABLED;
  } else {
    process.env.GUIDE_LEGACY_REDIRECTS_ENABLED = value;
  }

  try {
    callback();
  } finally {
    if (previousValue === undefined) {
      delete process.env.GUIDE_LEGACY_REDIRECTS_ENABLED;
    } else {
      process.env.GUIDE_LEGACY_REDIRECTS_ENABLED = previousValue;
    }
  }
}

function assertPassesThrough(request: NextRequest) {
  const response = proxy(request);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(response.headers.has("location"), false);
}

test("keeps retired Guide-host redirects disabled by default", () => {
  withLegacyGuideRedirects(undefined, () => {
    assertPassesThrough(
      new NextRequest("https://ai-software-factory-mastery.vercel.app/"),
    );
  });
});

test("enables retired Guide-host redirects only for the exact true value", () => {
  for (const value of ["", "1", "TRUE", " true ", "false"]) {
    withLegacyGuideRedirects(value, () => {
      assertPassesThrough(
        new NextRequest("https://ai-software-factory-mastery.vercel.app/"),
      );
    });
  }

  withLegacyGuideRedirects("true", () => {
    const response = proxy(
      new NextRequest("https://ai-software-factory-mastery.vercel.app/"),
    );
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), "https://fdlc.ai/guide");
  });
});

test("redirects allowlisted legacy Guide-host requests without forwarding queries when enabled", () => {
  withLegacyGuideRedirects("true", () => {
    for (const [method, pathname, destination] of [
      ["GET", "/", "https://fdlc.ai/guide"],
      ["HEAD", "/architecture/", "https://fdlc.ai/guide/architecture"],
    ]) {
      const request = new NextRequest(
        `https://preview.invalid${pathname}?token=private&token=again`,
        {
          method,
          headers: { host: "AI-SOFTWARE-FACTORY-MASTERY.VERCEL.APP:443" },
        },
      );
      const response = proxy(request);

      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), destination);
    }
  });
});

test("does not redirect other hosts, paths, or unsafe methods when enabled", () => {
  const requests = [
    new NextRequest("https://fdlc.ai/"),
    new NextRequest("https://ai-software-factory-mastery.vercel.app/framework"),
    new NextRequest("https://ai-software-factory-mastery.vercel.app/", {
      method: "POST",
    }),
  ];

  withLegacyGuideRedirects("true", () => {
    for (const request of requests) {
      assertPassesThrough(request);
    }
  });
});
