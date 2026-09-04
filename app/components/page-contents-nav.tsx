"use client";

import { useEffect, useState } from "react";

export type PageContentsItem = { label: string; href: `#${string}` };

export function PageContentsNav({ items, title = "On this page" }: { items: readonly PageContentsItem[]; title?: string }) {
  const [activeHref, setActiveHref] = useState(items[0]?.href);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
      if (visible[0]) setActiveHref(`#${visible[0].target.id}` as `#${string}`);
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, 1] });

    sections.forEach((section) => observer.observe(section));
    const syncHash = () => {
      if (items.some((item) => item.href === window.location.hash)) setActiveHref(window.location.hash as `#${string}`);
    };
    window.addEventListener("hashchange", syncHash);
    syncHash();

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, [items]);

  const links = items.map((item) => <a aria-current={activeHref === item.href ? "location" : undefined} href={item.href} key={item.href} onClick={() => setActiveHref(item.href)}>{item.label}</a>);

  return (
    <aside className="page-contents" aria-label={title}>
      <nav aria-label={title} className="page-contents-desktop">
        <span>{title}</span>
        <div>{links}</div>
      </nav>
      <details className="page-contents-floating">
        <summary>Contents <span aria-hidden="true">↑</span></summary>
        <nav aria-label={title}>{links}</nav>
      </details>
      <details className="page-contents-mobile">
        <summary>On this page <span aria-hidden="true">Sections ↓</span></summary>
        <nav aria-label={title}>{links}</nav>
      </details>
    </aside>
  );
}
