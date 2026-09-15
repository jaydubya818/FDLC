"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ResponsiveDetailsProps = {
  children: ReactNode;
  className: string;
  collapseAt?: "mobile" | "tablet";
  id?: string;
  defaultCollapsed?: boolean;
};

export function ResponsiveDetails({ children, className, collapseAt = "mobile", id, defaultCollapsed = false }: ResponsiveDetailsProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const media = window.matchMedia(collapseAt === "tablet" ? "(max-width: 1023px)" : "(max-width: 820px)");
    const sync = () => {
      if (!detailsRef.current) return;
      detailsRef.current.open = (Boolean(id) && window.location.hash === `#${id}`) || (!defaultCollapsed && !media.matches);
      detailsRef.current.classList.add("is-ready");
    };

    sync();
    media.addEventListener("change", sync);
    const revealHashTarget = () => {
      if (id && window.location.hash === `#${id}` && detailsRef.current) detailsRef.current.open = true;
    };
    window.addEventListener("hashchange", revealHashTarget);
    return () => { media.removeEventListener("change", sync); window.removeEventListener("hashchange", revealHashTarget); };
  }, [collapseAt, defaultCollapsed, id]);

  return <details className={`${className} responsive-disclosure${collapseAt === "tablet" ? " collapse-tablet" : ""}${defaultCollapsed ? " starts-collapsed" : ""}`} id={id} open={!defaultCollapsed} ref={detailsRef}>{children}</details>;
}
