"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ResponsiveDetailsProps = {
  children: ReactNode;
  className: string;
  collapseAt?: "mobile" | "tablet";
  id?: string;
};

export function ResponsiveDetails({ children, className, collapseAt = "mobile", id }: ResponsiveDetailsProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const media = window.matchMedia(collapseAt === "tablet" ? "(max-width: 1023px)" : "(max-width: 820px)");
    const sync = () => {
      if (!detailsRef.current) return;
      detailsRef.current.open = !media.matches;
      detailsRef.current.classList.add("is-ready");
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [collapseAt]);

  return <details className={`${className} responsive-disclosure${collapseAt === "tablet" ? " collapse-tablet" : ""}`} id={id} open ref={detailsRef}>{children}</details>;
}
