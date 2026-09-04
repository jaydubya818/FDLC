import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  variant?: "default" | "compact";
  meta?: readonly (readonly [string, string])[];
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, status, variant = "default", meta, children }: PageHeroProps) {
  return (
    <header className={`page-hero${variant === "compact" ? " is-compact" : ""}`}>
      <div className="page-hero-heading">
        <p className="section-label">{eyebrow}{status && <span className="status-pill">{status}</span>}</p>
        <h1>{title}</h1>
      </div>
      <div className="page-hero-aside">
        <p>{description}</p>
        {meta && <dl className="page-hero-meta">{meta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
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
