import type { Metadata } from "next";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} · FDLC.ai`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: "FDLC.ai", title: fullTitle, description, images: [{ url: "/og.png", width: 1731, height: 909, alt: "FDLC.ai — Build the factory that builds your software." }] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: ["/og.png"] },
  };
}

