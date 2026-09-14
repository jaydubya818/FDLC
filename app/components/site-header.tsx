"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEventHandler, type ReactNode } from "react";

import { primary, guide, afterGuide, secondary, type NavLink } from "../../lib/global-navigation";
import { SiteCommandPalette } from "./site-command-palette";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function focusAt(container: HTMLElement | null, index: number) {
  const links = Array.from(container?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
  links.at((index + links.length) % links.length)?.focus();
}

function onMenuKeyDown(event: globalThis.KeyboardEvent, container: HTMLElement | null, close: () => void, returnFocus: () => void) {
  if (!container?.contains(document.activeElement)) return;
  const links = Array.from(container.querySelectorAll<HTMLAnchorElement>("a[href]"));
  const index = links.indexOf(document.activeElement as HTMLAnchorElement);
  if (event.key === "Escape") {
    event.preventDefault();
    close();
    returnFocus();
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = index < 0 ? (step > 0 ? 0 : links.length - 1) : (index + step + links.length) % links.length;
    links[next]?.focus();
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    links.at(event.key === "Home" ? 0 : -1)?.focus();

  }
}

function NavDropdown({ active, id, label, links }: { active: boolean; id: string; label: string; links: readonly NavLink[] }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const navigate = (event: globalThis.KeyboardEvent) => onMenuKeyDown(event, panel.current, () => setOpen(false), () => trigger.current?.focus());
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", navigate);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", navigate);
    };
  }, [open]);

  function openAndFocus(index: number) {
    setOpen(true);
    requestAnimationFrame(() => focusAt(panel.current, index));
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAndFocus(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocus(-1);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div className={`nav-dropdown${active ? " is-active" : ""}${open ? " is-open" : ""}`} ref={root} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button aria-controls={id} aria-expanded={open} onClick={() => setOpen((value) => !value)} onKeyDown={handleTriggerKeyDown} ref={trigger} type="button">
        {label} <span aria-hidden="true">⌄</span>
      </button>
      <div className="nav-dropdown-panel" hidden={!open} id={id} ref={panel}>
        {links.map(([itemLabel, href]) => <Link aria-current={isCurrent(pathname, href) ? "page" : undefined} href={href} key={href} onClick={() => setOpen(false)}>{itemLabel}</Link>)}
      </div>
    </div>
  );
}

function GlobalLink({ children, current, href, onClick }: { children: ReactNode; current: boolean; href: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return <Link aria-current={current ? "page" : undefined} href={href} onClick={onClick}>{children}</Link>;
}

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const guideActive = isCurrent(pathname, "/guide");
  const secondaryActive = secondary.some(([, href]) => isCurrent(pathname, href));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(guideActive);
  const mobileRoot = useRef<HTMLDivElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!mobileRoot.current?.contains(event.target as Node)) setMobileOpen(false);
    };
    const navigate = (event: globalThis.KeyboardEvent) => onMenuKeyDown(event, mobileRoot.current?.querySelector("nav") ?? null, () => setMobileOpen(false), () => mobileTrigger.current?.focus());
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", navigate);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", navigate);
    };
  }, [mobileOpen]);

  return (
    <header className="global-header">
      <div className="global-header-inner">
        <Link className="global-logo" href="/" aria-label="FDLC.ai home">
          <Image className="brand-logo" src="/fdlc-logo-transparent.png" alt="FDLC.ai — Factory Development Lifecycle" width={2007} height={784} sizes="220px" priority />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primary.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href}>{label}</GlobalLink>)}
          <NavDropdown active={guideActive} id="guide-navigation" label="Guide" links={guide} />
          {afterGuide.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href}>{label}</GlobalLink>)}
          <NavDropdown active={secondaryActive} id="more-navigation" label="More" links={secondary} />
        </nav>
        <div className="header-utilities">
          <SiteCommandPalette />
          <a className="header-github" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">GitHub <span aria-hidden="true">↗</span></a>
        </div>
        <div className={`global-mobile${mobileOpen ? " is-open" : ""}`} ref={mobileRoot} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMobileOpen(false); }}>
          <button aria-controls="mobile-navigation" aria-expanded={mobileOpen} aria-label="Open navigation" onClick={() => setMobileOpen((value) => !value)} onKeyDown={(event) => { if (event.key === "Escape") setMobileOpen(false); }} type="button" ref={mobileTrigger}>Menu</button>
          <nav aria-label="Mobile navigation" hidden={!mobileOpen} id="mobile-navigation">
            {primary.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</GlobalLink>)}
            <button aria-controls="mobile-guide-navigation" aria-expanded={mobileGuideOpen} className={guideActive ? "is-active" : ""} onClick={() => setMobileGuideOpen((value) => !value)} type="button">Guide <span aria-hidden="true">⌄</span></button>
            <div className="mobile-guide-links" hidden={!mobileGuideOpen} id="mobile-guide-navigation">
              {guide.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</GlobalLink>)}
            </div>
            <a className="mobile-guide-search" href="/guide/search" onClick={() => setMobileOpen(false)}>Search the Guide</a>
            {afterGuide.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</GlobalLink>)}
            <span>More</span>
            {secondary.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</GlobalLink>)}
          </nav>
        </div>
      </div>
    </header>
  );
}
