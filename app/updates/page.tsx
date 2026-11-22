import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { factoryUpdates, factoryUpdatesReviewed } from "../../data/factory-updates";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Factory Updates", "Sourced developments, practical resources, and operator perspectives on AI software factories and governed delivery.", "/updates");

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function formatDate(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00Z`));
}

export default function UpdatesPage() {
  const sources = new Set(factoryUpdates.map((update) => update.source)).size;
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="Factory Updates" variant="compact" title="What changed in the factory, and why it matters." description="Notable developments, practical resources, and operator perspectives on AI software factories. Each entry names its source and connects it to the FDLC stage or capability it affects. Read the evidence, compare approaches, and judge what should change in your own delivery loop." meta={[["Entries", String(factoryUpdates.length).padStart(2, "0")], ["Publishers", String(sources).padStart(2, "0")], ["Last reviewed", formatDate(factoryUpdatesReviewed)]]}>
      <div className="hero-actions"><a className="button button-dark" href="#latest">Read the latest</a><Link className="text-action" href="/framework">See the FDLC stages →</Link></div>
    </PageHero>
    <section className="section-block" id="latest">
      <SectionHeader eyebrow="Latest" title="Newest first, sourced." description="Dates are source publication dates unless labeled Reviewed. Resources and perspectives are labeled; vendor results remain attributed claims. Summaries describe the source. The FDLC reading is ours." />
      <ol className="updates-feed">
        {factoryUpdates.map((update) => <li key={update.id} id={update.id}>
          <article>
            <header>
              <time dateTime={update.date}>{update.dateBasis === "reviewed" ? "Reviewed " : ""}{formatDate(update.date)}</time>
              <span>{update.source}</span>
              {update.kind ? <span>{update.kind}</span> : null}
              <span className="updates-touch">{update.touches}</span>
            </header>
            <h3><a href={update.url} rel="noreferrer" target="_blank">{update.title} <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a></h3>
            <p>{update.summary}</p>
            <p className="updates-why"><strong>Why it matters</strong> {update.whyItMatters}</p>
            <ul aria-label="Tags">{update.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </article>
        </li>)}
      </ol>
    </section>
    <section className="reading-next"><p className="section-label">Put it in context</p><h2>Tools will keep changing. The governed contract around them is the durable part.</h2><div><Link href="/framework">Read the framework →</Link><Link href="/maturity">Assess your maturity →</Link><Link href="/benchmarks">Measure verified outcomes →</Link></div></section>
  </div></SiteShell>;
}
