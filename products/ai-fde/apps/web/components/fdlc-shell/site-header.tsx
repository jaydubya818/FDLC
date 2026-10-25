"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEventHandler, type ReactNode } from "react";

import { primary, guide, aiFde, aiFdeHome, afterGuide, secondary, type NavLink } from "./global-navigation";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function focusAt(container: HTMLElement | null, index: number) {
  const links = Array.from(container?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
  links.at((index + links.length) % links.length)?.focus();
}

function onMenuKeyDown(event: globalThis.KeyboardEvent, container: HTMLElement | null, close: () => void, returnFocus: () => void) {
  if (event.defaultPrevented) return;
  if (!container?.contains(document.activeElement)) return;
  const nestedDropdown = document.activeElement?.closest(".nav-dropdown.is-open");
  if (nestedDropdown && !nestedDropdown.contains(container)) return;
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

function NavDropdown({ active, id, label, links, href, onNavigate }: { active: boolean; id: string; label: string; links: readonly NavLink[]; href?: string; onNavigate?: () => void }) {
  const pathname = "/deploy/app" + (usePathname() ?? "");
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
    <div className={`nav-dropdown${href ? " nav-dropdown-linked" : ""}${active ? " is-active" : ""}${open ? " is-open" : ""}`} ref={root} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      {href && <GlobalLink current={pathname === href} href={href} onClick={onNavigate}>{label}</GlobalLink>}
      <button aria-label={href ? `${label} navigation` : undefined} aria-controls={id} aria-expanded={open} onClick={() => setOpen((value) => !value)} onKeyDown={handleTriggerKeyDown} ref={trigger} type="button">
        {!href && label} <span aria-hidden="true">⌄</span>
      </button>
      <div className="nav-dropdown-panel" hidden={!open} id={id} ref={panel}>
        {links.map(([itemLabel, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href} onClick={() => { setOpen(false); onNavigate?.(); }}>{itemLabel}</GlobalLink>)}
      </div>
    </div>
  );
}

function GlobalLink({ children, current, href, onClick }: { children: ReactNode; current: boolean; href: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return href.startsWith("/guide") || isCurrent(href, "/deploy/app")
    ? <a aria-current={current ? "page" : undefined} href={href} onClick={onClick}>{children}</a>
    : <a aria-current={current ? "page" : undefined} href={href} onClick={onClick}>{children}</a>;
}

export function SiteHeader() {
  const pathname = "/deploy/app" + (usePathname() ?? "");
  const guideActive = isCurrent(pathname, "/guide");
  // Inside AI-FDE its menu is promoted to the top level, so More omits the duplicate.
  const inAiFde = isCurrent(pathname, aiFdeHome);
  const more = inAiFde ? secondary.filter(([, href]) => href !== aiFdeHome) : secondary;
  const secondaryActive = more.some(([, href]) => isCurrent(pathname, href));
  const [mobileOpen, setMobileOpen] = useState(false);
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
        <a className="global-logo" href="/" aria-label="FDLC.ai home">
          <Image className="brand-logo" src="/deploy/app/fdlc-logo-transparent.png" alt="FDLC.ai — Factory Development Lifecycle" width={2007} height={784} sizes="220px" priority />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primary.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href}>{label}</GlobalLink>)}
          <NavDropdown active={guideActive} id="guide-navigation" label="Guide" href="/guide" links={guide} />
          {inAiFde && <NavDropdown active id="ai-fde-navigation" label="AI-FDE" href={aiFdeHome} links={aiFde} />}
          {afterGuide.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href}>{label}</GlobalLink>)}
          <NavDropdown active={secondaryActive} id="more-navigation" label="More" links={more} />
        </nav>
        <div className="header-utilities">
          <a className="header-github" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">GitHub <span aria-hidden="true">↗</span></a>
        </div>
        <div className={`global-mobile${mobileOpen ? " is-open" : ""}`} ref={mobileRoot} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMobileOpen(false); }}>
          <button aria-controls="mobile-navigation" aria-expanded={mobileOpen} aria-label="Open navigation" onClick={() => setMobileOpen((value) => !value)} onKeyDown={(event) => { if (event.key === "Escape") setMobileOpen(false); }} type="button" ref={mobileTrigger}>Menu</button>
          <nav aria-label="Mobile navigation" hidden={!mobileOpen} id="mobile-navigation">
            {primary.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</GlobalLink>)}
            <NavDropdown active={guideActive} id="mobile-guide-navigation" label="Guide" href="/guide" links={guide} onNavigate={() => setMobileOpen(false)} />
            <a className="mobile-guide-search" href="/guide/search" onClick={() => setMobileOpen(false)}>Search the Guide</a>
            {inAiFde && <NavDropdown active id="mobile-ai-fde-navigation" label="AI-FDE" href={aiFdeHome} links={aiFde} onNavigate={() => setMobileOpen(false)} />}
            {afterGuide.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</GlobalLink>)}
            <span>More</span>
            {more.map(([label, href]) => <GlobalLink current={isCurrent(pathname, href)} href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</GlobalLink>)}
          </nav>
        </div>
      </div>
    </header>
  );
}
