"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { canonicalRoutes } from "../../lib/global-navigation";

const destinations = [...canonicalRoutes, ["Search the Guide", "/guide/search"]] as const;

export function SiteCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return destinations.filter(([label, href]) => !needle || label.toLowerCase().includes(needle) || href.includes(needle));
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  return (
    <div className="site-command-palette">
      <button aria-expanded={open} aria-haspopup="dialog" aria-label="Search FDLC pages" className="header-search" onClick={() => { setQuery(""); setActiveIndex(0); setOpen(true); }} type="button">
        ⌘K
      </button>
      {open ? (
        <div className="site-command-overlay">
          <button aria-label="Close search" className="site-command-backdrop" onClick={close} type="button" />
          <div aria-modal="true" className="site-command-dialog" role="dialog" aria-labelledby="site-command-title">
            <h2 id="site-command-title">Search FDLC</h2>
            <input
              aria-label="Search FDLC pages"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  close();
                } else if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((index) => Math.min(index + 1, Math.max(matches.length - 1, 0)));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((index) => Math.max(index - 1, 0));
                } else if (event.key === "Enter" && matches[activeIndex]) {
                  event.preventDefault();
                  window.location.assign(matches[activeIndex][1]);
                }
              }}
              placeholder="Framework, Maturity, Guide…"
              ref={input}
              type="search"
              value={query}
            />
            {matches.length ? (
              <ul>
                {matches.map(([label, href], index) => (
                  <li key={href}>
                    {href.startsWith("/guide")
                      ? <a className={index === activeIndex ? "is-active" : undefined} href={href} onClick={close}>{label}</a>
                      : <Link className={index === activeIndex ? "is-active" : undefined} href={href} onClick={close}>{label}</Link>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="site-command-empty">No FDLC page matches. <a href="/guide/search">Search the Guide →</a></p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
