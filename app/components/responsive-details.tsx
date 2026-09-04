"use client";

import { useEffect, useState, type ReactNode } from "react";

type ResponsiveDetailsProps = {
  children: ReactNode;
  className: string;
  id?: string;
};

export function ResponsiveDetails({ children, className, id }: ResponsiveDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 820px)");
    const sync = () => {
      setIsOpen(!media.matches);
      setIsReady(true);
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return <details className={`${className} responsive-disclosure${isReady ? " is-ready" : ""}`} id={id} open={isOpen} onToggle={(event) => {
    if (!isReady) return;
    if (event.currentTarget.open !== isOpen) setIsOpen(event.currentTarget.open);
  }}>{children}</details>;
}
