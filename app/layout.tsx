import type { Metadata } from "next";
import { siteUrl } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FDLC.ai — Factory Development Lifecycle",
    template: "%s · FDLC.ai",
  },
  description:
    "The open framework for designing, governing, verifying, operating, and continuously improving AI software factories.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  keywords: ["Factory Development Lifecycle", "FDLC", "AI software factory", "AI software factory governance", "agent verification", "software factory control plane"],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "FDLC.ai", url: siteUrl, description: "The open framework for designing, governing, verifying, operating, and continuously improving AI software factories." }) }} />
      </body>
    </html>
  );
}
