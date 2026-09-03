import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></>;
}

