import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, description, status, children }: { eyebrow: string; title: string; description: string; status?: string; children?: ReactNode }) {
  return (
    <header className="page-hero">
      <div>
        <p className="section-label">{eyebrow}{status && <span className="status-pill">{status}</span>}</p>
        <h1>{title}</h1>
      </div>
      <div className="page-hero-aside">
        <p>{description}</p>
        {children}
      </div>
    </header>
  );
}

export function SectionHeader({ eyebrow, title, description, id }: { eyebrow: string; title: string; description?: string; id?: string }) {
  return (
    <header className="section-header">
      <div><p className="section-label">{eyebrow}</p><h2 id={id}>{title}</h2></div>
      {description && <p>{description}</p>}
    </header>
  );
}

