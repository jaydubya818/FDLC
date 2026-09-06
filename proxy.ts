import { NextResponse, type NextRequest } from "next/server.js";

const legacyGuideHostname = "ai-software-factory-mastery.vercel.app";
const canonicalOrigin = "https://www.fdlc.ai";
const legacyGuideRedirects = new Map([
  ["/", "/guide"],
  ["/architecture", "/guide/architecture"],
]);

function normalizedHostname(host: string) {
  return host.trim().toLowerCase().replace(/:\d+$/, "");
}

function normalizedPathname(pathname: string) {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function legacyGuideRedirectsEnabled() {
  return process.env.GUIDE_LEGACY_REDIRECTS_ENABLED === "true";
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? request.nextUrl.host;
  const destination = legacyGuideRedirects.get(normalizedPathname(request.nextUrl.pathname));

  if (
    !legacyGuideRedirectsEnabled() ||
    normalizedHostname(host) !== legacyGuideHostname ||
    !destination ||
    (request.method !== "GET" && request.method !== "HEAD")
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(destination, canonicalOrigin), 308);
}

export const config = {
  matcher: ["/", "/architecture"],
};
