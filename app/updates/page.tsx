import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { factoryUpdates, factoryUpdatesReviewed } from "../../data/factory-updates";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Factory Updates", "What is changing in AI software factories, from first-party sources, and why it matters for governed delivery.", "/updates");

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function formatDate(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00Z`));
}

export default function UpdatesPage() {
  const sources = new Set(factoryUpdates.map((update) => update.source.split(" ")[0])).size;
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="Factory Updates" variant="compact" title="What changed in the factory, and why it matters." description="Agents, harnesses, sandboxes, and controls change every week. This feed tracks the notable shifts in AI software factories, each linked to its first-party source and tied to the FDLC stage or capability it affects, so you can judge what it means for governed delivery." meta={[["Entries", String(factoryUpdates.length).padStart(2, "0")], ["Publishers", String(sources).padStart(2, "0")], ["Last reviewed", formatDate(factoryUpdatesReviewed)]]}>
      <div className="hero-actions"><a className="button button-dark" href="#latest">Read the latest</a><Link className="text-action" href="/framework">See the FDLC stages →</Link></div>
    </PageHero>
    <section className="section-block" id="latest">
      <SectionHeader eyebrow="Latest" title="Newest first, sourced." description="Summaries describe what each source says. The FDLC reading is ours. Follow the link before you rely on a detail." />
      <ol className="updates-feed">
        {factoryUpdates.map((update) => <li key={update.id} id={update.id}>
          <article>
            <header>
              <time dateTime={update.date}>{formatDate(update.date)}</time>
              <span>{update.source}</span>
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
