"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const primary = [
  ["Framework", "/framework"],
  ["Architecture", "/architecture"],
  ["Guide", "/guide"],
  ["Mission Control", "/mission-control"],
  ["Maturity", "/maturity"],
] as const;

const secondary = [
  ["FDLC in 5 Minutes", "/in-5-minutes"],
  ["Manifesto", "/manifesto"],
  ["Specification", "/specification"],
  ["Benchmarks", "/benchmarks"],
  ["Start", "/start"],
  ["Enterprise", "/enterprise"],
  ["Deploy", "/deploy"],
  ["About", "/about"],
] as const;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const secondaryActive = secondary.some(([, href]) => isCurrent(pathname, href));
  const moreMenu = useRef<HTMLDetailsElement>(null);
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (moreMenu.current) moreMenu.current.open = false;
    if (mobileMenu.current) mobileMenu.current.open = false;
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="FDLC.ai home">
          <span aria-hidden="true" className="wordmark-mark">F</span>
          <span>FDLC<span className="wordmark-dot">.ai</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primary.map(([label, href]) => href.startsWith("/guide")
            ? <a aria-current={isCurrent(pathname, href) ? "page" : undefined} href={href} key={href}>{label}</a>
            : <Link aria-current={isCurrent(pathname, href) ? "page" : undefined} href={href} key={href}>{label}</Link>)}
          <details className={`more-menu${secondaryActive ? " is-active" : ""}`} ref={moreMenu}>
            <summary aria-current={secondaryActive ? "page" : undefined}>More <span aria-hidden="true">⌄</span></summary>
            <div>
              {secondary.map(([label, href]) => <Link aria-current={isCurrent(pathname, href) ? "page" : undefined} href={href} key={href}>{label}</Link>)}
            </div>
          </details>
        </nav>
        <a className="header-github" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">GitHub <span aria-hidden="true">↗</span></a>
        <details className="mobile-nav" ref={mobileMenu}>
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {primary.map(([label, href]) => href.startsWith("/guide")
              ? <a aria-current={isCurrent(pathname, href) ? "page" : undefined} href={href} key={href}>{label}</a>
              : <Link aria-current={isCurrent(pathname, href) ? "page" : undefined} href={href} key={href}>{label}</Link>)}
            <span>More</span>
            {secondary.map(([label, href]) => <Link aria-current={isCurrent(pathname, href) ? "page" : undefined} href={href} key={href}>{label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
