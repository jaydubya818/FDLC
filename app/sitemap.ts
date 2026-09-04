import type { MetadataRoute } from "next";
import { guideParts } from "../data/guide";
import { siteUrl } from "../lib/site";

const routes = ["", "/framework", "/architecture", "/examples/dependency-modernization", "/manifesto", "/guide", "/mission-control", "/spec", "/maturity", "/benchmarks", "/enterprise", "/deploy", "/start", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...guideParts.map((part) => `/guide/${part.id}`)].map((route) => ({ url: `${siteUrl}${route}`, lastModified: new Date("2026-09-03"), changeFrequency: route.startsWith("/guide") ? "monthly" : "weekly", priority: route === "" ? 1 : route === "/framework" ? .9 : .7 }));
}
