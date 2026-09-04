"use client";

import { useEffect, useState } from "react";

export type PageContentsItem = { label: string; href: `#${string}` };

type PageContentsNavProps = {
  items: readonly PageContentsItem[];
  title?: string;
  mobileTitle?: string;
  variant?: "floating" | "rail";
};

export function PageContentsNav({ items, title = "On this page", mobileTitle = "On this page", variant = "floating" }: PageContentsNavProps) {
  const [activeHref, setActiveHref] = useState(items[0]?.href);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    const updateActiveSection = () => {
      const readingLine = window.innerHeight * 0.26;
      let activeSection = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) activeSection = section;
        else break;
      }
      if (activeSection) setActiveHref(`#${activeSection.id}` as `#${string}`);
    };

    let animationFrame = 0;
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    const observer = new IntersectionObserver(scheduleUpdate, { rootMargin: "-18% 0px -68% 0px", threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    const syncHash = () => {
      if (items.some((item) => item.href === window.location.hash)) setActiveHref(window.location.hash as `#${string}`);
    };
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    syncHash();
    updateActiveSection();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, [items]);

  const activeIndex = Math.max(0, items.findIndex((item) => item.href === activeHref));
  const progress = items.length ? ((activeIndex + 1) / items.length) * 100 : 0;
  const position = `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
  const links = (context: string) => items.map((item) => <a aria-current={activeHref === item.href ? "location" : undefined} href={item.href} key={`${context}-${item.href}`} onClick={(event) => {
    setActiveHref(item.href);
    event.currentTarget.closest("details")?.removeAttribute("open");
  }}>{item.label}</a>);
  const status = <div className="page-contents-status" aria-hidden="true"><span>{position}</span><i><b style={{ width: `${progress}%` }} /></i></div>;

  return (
    <aside className={`page-contents${variant === "rail" ? " is-rail" : ""}`} aria-label={title}>
      <nav aria-label={title} className="page-contents-desktop">
        <span>{title}</span>{status}
        <div>{links("desktop")}</div>
      </nav>
      <details className="page-contents-floating">
        <summary>Contents <span aria-hidden="true">{position} ↑</span></summary>
        <nav aria-label={title}>{links("floating")}</nav>
      </details>
      <details className="page-contents-mobile">
        <summary>{mobileTitle} <span aria-hidden="true">{position} · Sections ↓</span></summary>
        {status}<nav aria-label={title}>{links("mobile")}</nav>
      </details>
    </aside>
  );
}
