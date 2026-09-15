import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/fdlc-shell/site-header";

import { PRODUCT } from "@/lib/product";

import "./globals.css";
import "@/components/fdlc-shell/design-system.css";

export const metadata: Metadata = {
  title: `${PRODUCT.shortName} · FDLC`,
  description: PRODUCT.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        <div className="ai-fde-product-context">
          <a href="/deploy">AI-FDE</a>
          <span aria-hidden="true"> / </span>
          <a href="/deploy/app">Factory Definition Workspace</a>
        </div>
        {children}
      </body>
    </html>
  );
}
