import { runMicrofrontendsMiddleware } from "@vercel/microfrontends/next/middleware";
import { NextResponse, type NextRequest } from "next/server.js";
import {
  GUIDE_HOST_FLAG,
  guideBridgeOrigin,
  isStandaloneGuideHost,
  standaloneGuideRedirect,
} from "./lib/guide-bridge.ts";

export async function proxy(request: NextRequest) {
  const guideOrigin = guideBridgeOrigin();
  const host = request.headers.get("host") ?? request.nextUrl.host;
  const guideHost = isStandaloneGuideHost(host, guideOrigin);
  // Only this bridge establishes standalone ownership of bare /architecture.
  // Normalize before SDK dispatch so saved Guide URLs survive an old-Guide rollback.
  if (
    guideHost &&
    ["/guide/architecture", "/guide/architecture/"].includes(request.nextUrl.pathname) &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    const target = new URL(request.url);
    target.pathname = "/architecture";
    const response = NextResponse.redirect(target, 307);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  const routed = await runMicrofrontendsMiddleware({
    request,
    flagValues: { [GUIDE_HOST_FLAG]: async () => guideHost },
  });
  if (routed) return routed;

  const destination = standaloneGuideRedirect(
    request.nextUrl.pathname,
    request.nextUrl.search,
    "GET",
    guideOrigin,
  );
  if (!destination || guideHost) return NextResponse.next();

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new NextResponse("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD", "Cache-Control": "private, no-store" },
    });
  }

  const response = NextResponse.redirect(destination, 307);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

// Guide's generated asset prefix is already routed directly by Vercel. Every
// other path (including old bare assets and unknown URLs) uses the host flag.
export const config = {
  matcher: [
    "/.well-known/vercel/microfrontends/client-config",
    "/((?!vc-ap-dd2962(?:/|$)).*)",
  ],
};
