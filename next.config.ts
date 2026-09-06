import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import type { NextConfig } from "next";
import { guideBridgeOrigin } from "./lib/guide-bridge.ts";

// Invalid qualification inputs must fail the build, not change live routing.
guideBridgeOrigin();

const nextConfig: NextConfig = {};

export default withMicrofrontends(nextConfig);
