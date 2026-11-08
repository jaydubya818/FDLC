import Link from "next/link";
import { lifecycleViews } from "../../data/governing-lifecycle";

/** Explains how every FDLC view relates to the canonical nine-stage governing lifecycle. */
export function LifecycleViews() {
  return (
    <section className="lifecycle-views" aria-labelledby="lifecycle-views-title">
      <h3 id="lifecycle-views-title">How the views relate</h3>
      <ol>
        {lifecycleViews.map((view, index) => (
          <li key={view.name} className={index === 0 ? "is-canonical" : undefined}>
            <div><strong>{view.name}</strong><span>{view.count}{index === 0 ? " · canonical" : ""}</span></div>
            <p><em>{view.question}</em> {view.relation}</p>
            {view.href.startsWith("/guide") ? <a aria-label={`Open ${view.name}`} href={view.href}>Open →</a> : <Link aria-label={`Open ${view.name}`} href={view.href}>Open →</Link>}
          </li>
        ))}
      </ol>
    </section>
  );
}
