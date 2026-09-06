import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { metrics } from "../../data/fdlc";
import { guideRoot } from "../../data/guide";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Benchmarks", "How FDLC measures AI software factory effectiveness through verified outcomes.", "/benchmarks");

export default function BenchmarksPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="FDLC Benchmarks / 07" status="Proposed" variant="compact" title="Measure the outcome, not the activity." description="FDLC Benchmarks will compare factory effectiveness through verified delivery, quality, cost, human effort, recovery, and risk. No public benchmark results are claimed today." meta={[["Unit of value", "Verified outcome"], ["Metrics", String(metrics.length).padStart(2, "0")], ["Public results", "None yet"]]}>
      <div className="hero-actions"><a className="button button-dark" href="#measurement-contract">Review the measurement contract</a><Link className="text-action" href="/maturity">Assess your current system →</Link></div>
    </PageHero>
    <section className="benchmark-thesis"><span>Success metric</span><h2>Verified outcome</h2><p>Tokens, prompts, lines of code, and concurrent agents can explain operating cost. They do not prove value.</p></section>
    <section className="section-block" id="measurement-contract"><SectionHeader eyebrow="Measurement contract" title="Twelve metrics worth earning." description="A useful benchmark publishes the work type, acceptance contract, risk, environment, evaluator, and uncertainty beside every result." /><div className="metric-grid is-full">{metrics.map(([name, description], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{description}</p></article>)}</div></section>
    <section className="do-dont-grid"><article><span>Measure</span><ul><li>Accepted outcomes by work type</li><li>Evidence coverage and first-pass quality</li><li>Human attention and recovery</li><li>Complete attributable cost</li><li>Failure, rollback, and escaped defects</li></ul></article><article><span>Do not confuse with value</span><ul><li>Generated tokens</li><li>Lines of code</li><li>Prompt volume</li><li>Agent count</li><li>Demo throughput without accepted outcomes</li></ul></article></section>
    <section className="section-block" id="comparable-results">
      <SectionHeader eyebrow="Comparable results" title="Publish the denominator and the missing evidence." description="A green service, a completed Attempt, a verified artifact, and an accepted outcome answer different questions. Report each separately." />
      <div className="metric-grid is-full">
        <article><span>01</span><h3>Declare the cohort</h3><p>Freeze the work type, risk, repository, Factory Version, evaluator, baseline, and observation window. Count failed work and retries in spend. Verification and acceptance use separate denominators.</p></article>
        <article><span>02</span><h3>Show cost coverage</h3><p>Label model, tools, retrieval, compute, storage, verification, and human effort as ACTUAL, ESTIMATED, or UNKNOWN. Missing cost is not zero; no successful outcomes means the ratio is undefined.</p></article>
        <article><span>03</span><h3>Keep guardrails visible</h3><p>Compare quality, recovery, cost, latency, and human intervention together. Trace the critical path and downstream operations per admitted Mission. A failed authority or security gate cannot be averaged away.</p></article>
      </div>
      <p><a href={`${guideRoot}/02-design/09-tokenomics-and-factory-economics`}>Read the Guide’s economics contract →</a></p>
      <p><a href={`${guideRoot}/04-prove/29-evaluation-engineering`}>Evaluate the execution path and the outcome →</a></p>
    </section>
    <section className="reading-next"><p className="section-label">Start with your baseline</p><h2>Know what improves before automating it.</h2><div><Link href="/maturity">Assess maturity →</Link><Link href="/start">Define a factory line →</Link></div></section>
  </div></SiteShell>;
}
