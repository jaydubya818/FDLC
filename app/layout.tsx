import type { Metadata } from "next";
import { siteUrl } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Factory Development Lifecycle (FDLC) — Trusted Autonomous Software Delivery",
    template: "%s · FDLC.ai",
  },
  description:
    "The Factory Development Lifecycle is the open operating model, engineering discipline, and reference architecture for designing, governing, and operating AI software factories.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  keywords: ["Factory Development Lifecycle", "FDLC", "AI software factory", "trusted autonomous software delivery", "AI software factory governance", "agent verification", "software factory control plane"],
  authors: [{ name: "FDLC.ai" }],
  creator: "FDLC.ai",
  publisher: "FDLC.ai",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Factory Development Lifecycle", alternateName: "FDLC.ai", url: siteUrl, description: "The open operating model, engineering discipline, and reference architecture for designing, governing, and operating AI software factories." }) }} />
      </body>
    </html>
  );
}
