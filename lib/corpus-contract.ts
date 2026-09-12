import GithubSlugger from "github-slugger";

export const CORPUS_PREVIEW_PREFIX = "/corpus-preview";
export const CORPUS_RAW_PREFIX = "/corpus-artifacts";

export const existingSiteRoutes = new Set([
  "/",
  "/about",
  "/architecture",
  "/benchmarks",
  "/deploy",
  "/enterprise",
  "/examples/dependency-modernization",
  "/framework",
  "/guide",
  "/in-5-minutes",
  "/manifesto",
  "/maturity",
  "/mission-control",
  "/spec",
  "/specification",
  "/start",
]);

export const guideOwnedPrefixes = ["/guide/", "/search", "/glossary"] as const;

export type CorpusHeading = {
  depth: number;
  id: string;
  text: string;
};

export type CorpusLinkKind = "corpus" | "fragment" | "site" | "guide" | "external" | "raw" | "missing" | "unsafe";

export type CorpusLink = {
  href: string;
  kind: CorpusLinkKind;
  resolvedHref?: string;
};

const explicitHeadingPattern = /\s*\{#([A-Za-z][A-Za-z0-9_-]*)\}\s*$/;

export function normalizeRoute(input: string): string {
  const value = input.trim();
  if (!value.startsWith("/")) throw new Error(`Route must start with /: ${input}`);
  if (value.includes("?") || value.includes("#")) throw new Error(`Route cannot include query or fragment: ${input}`);
  const normalized = value.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
  if (normalized.split("/").some((segment) => segment === "." || segment === "..")) throw new Error(`Route cannot traverse directories: ${input}`);
  return normalized;
}

export function toPreviewHref(route: string, fragment = ""): string {
  const normalized = normalizeRoute(route);
  return `${CORPUS_PREVIEW_PREFIX}${normalized === "/" ? "" : normalized}${fragment}`;
}

export function headingTextAndExplicitId(value: string): { explicitId?: string; text: string } {
  const match = value.match(explicitHeadingPattern);
  if (!match) return { text: value.trim() };
  return { explicitId: match[1], text: value.replace(explicitHeadingPattern, "").trim() };
}

export function createHeadingIdFactory() {
  const slugger = new GithubSlugger();
  const explicitIds = new Set<string>();
  return (value: string): { duplicateExplicitId: boolean; id: string; text: string } => {
    const { explicitId, text } = headingTextAndExplicitId(value);
    if (!explicitId) return { duplicateExplicitId: false, id: slugger.slug(text), text };
    const duplicateExplicitId = explicitIds.has(explicitId);
    explicitIds.add(explicitId);
    return { duplicateExplicitId, id: explicitId, text };
  };
}

export function splitHref(href: string): { fragment: string; pathname: string; query: string } {
  const hashIndex = href.indexOf("#");
  const fragment = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutFragment = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutFragment.indexOf("?");
  return {
    fragment,
    pathname: queryIndex >= 0 ? withoutFragment.slice(0, queryIndex) : withoutFragment,
    query: queryIndex >= 0 ? withoutFragment.slice(queryIndex) : "",
  };
}

export function isUnsafeHref(href: string): boolean {
  const compact = [...href.trim()].filter((character) => character.charCodeAt(0) > 32).join("").toLowerCase();
  return compact.startsWith("javascript:") || compact.startsWith("vbscript:") || compact.startsWith("data:");
}

export function rewriteCorpusHref(href: string, corpusRoutes: ReadonlySet<string>): string {
  if (!href || href.startsWith("#") || isUnsafeHref(href)) return href;
  const { fragment, pathname, query } = splitHref(href);
  if (!pathname.startsWith("/")) return href;
  let decoded = pathname;
  try { decoded = decodeURIComponent(pathname); } catch { return href; }
  const normalized = normalizeRoute(decoded);
  return corpusRoutes.has(normalized) ? `${toPreviewHref(normalized)}${query}${fragment}` : href;
}

export function isGuideOwnedRoute(route: string): boolean {
  return route === "/guide" || guideOwnedPrefixes.some((prefix) => route === prefix || route.startsWith(prefix));
}

export function isExistingSiteRoute(route: string): boolean {
  return existingSiteRoutes.has(route);
}
