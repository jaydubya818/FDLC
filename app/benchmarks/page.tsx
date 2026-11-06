import { factoryScorecard } from "../../data/software-factory-engineering";
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
    <section className="section-block" id="factory-performance-scorecard">
      <SectionHeader eyebrow="Factory Performance Scorecard" title="Eight categories. One declared measurement contract." description="A proposed scorecard, with no invented benchmark values. Freeze workload, Factory Version, risk, evaluator, baseline and observation window before comparing results." />
      <div className="engineering-grid">{factoryScorecard.map(([category, definition, interpretation], index) => <article key={category}><p className="section-label">{String(index + 1).padStart(2, "0")} / {category}</p><h3>{category}</h3><p>{definition}</p><p><strong>Denominator and missing data:</strong> {interpretation}</p></article>)}</div>
      <p>Choose a fixed intake window and a declared production follow-up period; publish both dates, sample sizes and observation coverage. Ratios with zero denominators are undefined. Report unknown and estimated data separately; do not turn missing observations into passes or zero cost.</p>
      <p>Fewer interventions can conceal longer investigations. Track minutes, context switches and perceived effort alongside counts. Faster output that causes incidents reduces value; excessive approvals can erase autonomy benefits. Report tradeoffs together, segmented by workload.</p>
      <a className="text-action" href={`${guideRoot}/02-design/08-economics-metrics-and-human-attention#factory-performance-scorecard`}>Use the Guide’s formulas and operating checklist →</a>
    </section>
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
    <section className="section-block" id="evaluation-boundaries">
      <SectionHeader eyebrow="Evaluation boundaries" title="Find the failed decision, then prove the outcome." description="Assess routing, planning, retrieval, tool arguments and effects, final claims, and production outcomes. A correct answer reached through an unauthorized action still fails." />
      <div className="do-dont-grid">
        <article><span>Retain the evidence</span><p>Record the expected behavior, observed decision, configuration, evaluator, failures, and full cost. Compare the same work cohort against a baseline; report uncertainty and coverage beside the score.</p></article>
        <article><span>Protect the evaluation</span><p>Review agent-generated tests. Keep repair cases separate from protected holdouts, freeze acceptance criteria, and bound repair loops. Twenty passing examples or a framework label cannot establish production readiness.</p></article>
      </div>
      <p><a href={`${guideRoot}/appendix/agentic-system-operating-checks#evaluate-decisions-and-outcomes-independently`}>Apply the Guide’s independent evaluation checks →</a></p>
    </section>
    <section className="reading-next"><p className="section-label">Start with your baseline</p><h2>Know what improves before automating it.</h2><div><Link href="/maturity">Assess maturity →</Link><Link href="/start">Define a factory line →</Link></div></section>
  </div></SiteShell>;
}
