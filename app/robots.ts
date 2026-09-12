import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Google-Extended", allow: "/", disallow: ["/corpus-preview/", "/corpus-artifacts/"] },
      { userAgent: "GPTBot", allow: "/", disallow: ["/corpus-preview/", "/corpus-artifacts/"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/corpus-preview/", "/corpus-artifacts/"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/corpus-preview/", "/corpus-artifacts/"] },
      { userAgent: "*", allow: "/", disallow: ["/corpus-preview/", "/corpus-artifacts/"] },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/guide/sitemap.xml`],
    host: siteUrl,
  };
}
