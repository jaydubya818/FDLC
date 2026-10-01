import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site";

const routes = ["", "/framework", "/architecture", "/in-5-minutes", "/manifesto", "/mission-control", "/specification", "/maturity", "/benchmarks", "/enterprise", "/deploy", "/start", "/lab", "/simulator", "/about"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `${siteUrl}${route}`, lastModified: new Date("2026-09-04"), changeFrequency: "weekly", priority: route === "" ? 1 : route === "/framework" ? .9 : .7 }));
}
