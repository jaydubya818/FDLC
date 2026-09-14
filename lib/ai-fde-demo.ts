export const AI_FDE_PRODUCTION_DEMO = "https://ai-fde-agent.vercel.app";

function hostWithoutProtocol(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function syntheticDemoHref(
  vercelEnv = process.env.VERCEL_ENV,
  vercelHost = process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL,
): string {
  const host = hostWithoutProtocol(vercelHost);

  if (vercelEnv === "preview" && host?.startsWith("fdlc-git-")) {
    return `https://${host.replace(/^fdlc-git-/, "ai-fde-git-")}`;
  }

  return AI_FDE_PRODUCTION_DEMO;
}
