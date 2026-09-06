/** Transitional host isolation; the final MFE release removes this adapter. */
export const STANDALONE_GUIDE_ORIGIN = "https://ai-software-factory-mastery.vercel.app";
export const GUIDE_HOST_FLAG = "guide-standalone-host";

type BridgeEnvironment = Record<string, string | undefined>;

const localGuideHosts = new Set(["localhost", "127.0.0.1", "guide.localhost"]);
const previewGuideHost = /^ai-software-factory-mastery-[a-z0-9]+(?:-[a-z0-9]+)*-jaydubya818\.vercel\.app$/;

/**
 * Production has one fixed destination. A deployment-scoped Preview input can
 * select only this Guide project's team-qualified Vercel hostname; explicit
 * local qualification can select only the listed loopback hostnames.
 */
export function guideBridgeOrigin(environment: BridgeEnvironment = process.env) {
  const override = environment.FDLC_BRIDGE_GUIDE_ORIGIN;
  const local = environment.FDLC_BRIDGE_LOCAL;
  if (local !== undefined && local !== "1") {
    throw new Error("[Guide bridge] FDLC_BRIDGE_LOCAL must be exactly 1 when set.");
  }
  if (local && (environment.VERCEL === "1" || environment.VERCEL_ENV !== undefined || environment.VERCEL_TARGET_ENV !== undefined)) {
    throw new Error("[Guide bridge] Local qualification cannot run on Vercel.");
  }
  if (override === undefined) return STANDALONE_GUIDE_ORIGIN;
  if (environment.VERCEL_ENV === "production" || environment.VERCEL_TARGET_ENV === "production") {
    throw new Error("[Guide bridge] Production must not override the canonical Guide origin.");
  }

  let origin: URL;
  try {
    origin = new URL(override);
  } catch {
    throw new Error("[Guide bridge] Qualification requires an absolute Guide origin.");
  }
  if (origin.origin !== override || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) {
    throw new Error("[Guide bridge] Qualification origin must be exact and contain no credentials, path, query or fragment.");
  }
  if (override === STANDALONE_GUIDE_ORIGIN) return override;
  if (local === "1" && origin.protocol === "http:" && localGuideHosts.has(origin.hostname) && origin.port) {
    return override;
  }
  if (
    environment.VERCEL === "1" &&
    environment.VERCEL_ENV === "preview" &&
    origin.protocol === "https:" &&
    !origin.port &&
    previewGuideHost.test(origin.hostname)
  ) {
    return override;
  }
  throw new Error("[Guide bridge] Qualification origin is not an approved local or Preview Guide origin.");
}

/** Read Host itself; never derive route ownership from forwarded headers. */
export function isStandaloneGuideHost(host: string | null, guideOrigin: string) {
  if (!host || host !== host.trim() || /[\s/\\?#@]/u.test(host)) return false;
  return [STANDALONE_GUIDE_ORIGIN, guideOrigin].some((origin) => {
    const expected = new URL(origin);
    try {
      const actual = new URL(`${expected.protocol}//${host}`);
      return actual.origin === expected.origin;
    } catch {
      return false;
    }
  });
}

export const guideSummaryDestinations: Readonly<Record<string, string>> = {
  understand: "/docs/01-understand/01-why-software-engineering-is-changing",
  design: "/docs/02-design/04-the-human-agent-operating-model",
  build: "/docs/03-build/11-the-agent-factory",
  prove: "/docs/04-prove/27-quality-and-evidence-architecture",
  operate: "/docs/05-operate/34-the-factory-as-a-platform",
  improve: "/docs/06-improve/39-production-feedback-review-and-the-agentic-merge-queue",
};

const guidePageAliases: Readonly<Record<string, string>> = {
  "/guide": "/guide",
  "/guide/search": "/search",
  "/guide/architecture": "/architecture",
  "/guide/atlas": "/visuals",
  "/guide/topics": "/topics",
  "/guide/coverage": "/coverage",
  "/guide/glossary": "/glossary",
  "/atlas": "/visuals",
};

const legacyGuidePages = new Set([
  "/visuals", "/topics", "/coverage", "/search", "/glossary",
]);

/** Only navigation is redirected; cross-origin queries retain search q only. */
export function standaloneGuideRedirect(
  pathname: string,
  search: string,
  method: string,
  guideOrigin: string,
) {
  if (method !== "GET" && method !== "HEAD") return null;
  if (!pathname.startsWith("/") || pathname.startsWith("//") || pathname.includes("\\")) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (
    /%(?:2f|5c)/i.test(pathname) ||
    [...decoded].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) ||
    decoded.split("/").some((segment) => segment === "." || segment === "..")
  ) return null;
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const summary = /^\/guide\/([^/]+)$/.exec(path)?.[1];
  const summaryDestination = summary && Object.hasOwn(guideSummaryDestinations, summary)
    ? guideSummaryDestinations[summary] : undefined;
  let destination = summaryDestination;
  if (!destination && Object.hasOwn(guidePageAliases, path)) destination = guidePageAliases[path];
  if (!destination && path.startsWith("/guide/")) {
    // Page aliases exist in both Guide generations. Asset paths do not share
    // that contract: retain their requested namespace, never invent an alias.
    const assetPath = /\.[^/]+$/.test(path) ||
      path.startsWith("/guide/infographics/") || path.startsWith("/guide/_next/");
    destination = assetPath ? path : `/docs/${path.slice("/guide/".length)}`;
  }
  if (!destination && (
    path === "/docs" || path.startsWith("/docs/") ||
    legacyGuidePages.has(path)
  )) destination = path;
  if (!destination) return null;

  const target = new URL(destination, guideOrigin);
  if (path === "/search" || path === "/guide/search") {
    for (const query of new URLSearchParams(search).getAll("q")) target.searchParams.append("q", query);
  }
  return target.toString();
}
