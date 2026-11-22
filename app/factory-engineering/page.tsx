/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the microfrontend boundary. */
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { twoJobsFraming } from "../../data/homepage";
import {
  factoryEngineeringDebate,
  factoryEngineeringPageSources,
  factoryStackLayers,
  factoryTaxonomyTerms,
  measureImproveTools,
  mergeRiskCriteria,
  publicNumbersNotes,
  rolloutTactics,
  verificationPractice,
} from "../../data/factory-engineering";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Factory Engineering in Practice",
  "Factory engineering: the discipline of building, measuring, and improving the system of agents, tools, people, and controls that produces software. The FDLC view.",
  "/factory-engineering",
);

export default function FactoryEngineeringPage() {
  return (
    <SiteShell>
      <div className="page-wrap factory-engineering-page">
        <PageHero
          eyebrow="Factory Engineering / Practice"
          variant="compact"
          title="Factory engineering, in practice."
          description="Factory engineering is the discipline of building, measuring, and improving the system of agents, tools, people, and controls that produces software. FDLC is the lifecycle that governs it."
          meta={[
            ["Stack layers", "07"],
            ["Measure tools", "05"],
            ["Merge-risk criteria", "05"],
          ]}
        >
          <div className="hero-actions">
            <a className="button button-dark" href="#two-jobs">The two-jobs framing</a>
            <Link className="text-action" href="/benchmarks">Measurement contract →</Link>
          </div>
        </PageHero>

        {/* Section 1: Two jobs */}
        <section className="section-block" id="two-jobs">
          <SectionHeader
            eyebrow="01 / The two-jobs framing"
            title={twoJobsFraming.headline}
            description={twoJobsFraming.discipline}
          />
          <div className="two-jobs-grid">
            <article>
              <h3>{twoJobsFraming.productEngineering.name}</h3>
              <p>{twoJobsFraming.productEngineering.definition}</p>
            </article>
            <article>
              <h3>{twoJobsFraming.factoryEngineering.name}</h3>
              <p>{twoJobsFraming.factoryEngineering.definition} <strong>{twoJobsFraming.fdlcPosition}</strong></p>
            </article>
          </div>
          <p className="governance-callout">{twoJobsFraming.governanceNote}</p>
          <p className="attribution-line">
            {twoJobsFraming.attribution.text}{" "}
            {twoJobsFraming.attribution.sources.map((s, i) => (
              <span key={s.url}>{i > 0 && " · "}<a href={s.url} rel="noreferrer" target="_blank">{s.label} ↗</a></span>
            ))}
          </p>
        </section>

        {/* Section 2: Factory stack */}
        <section className="section-block" id="factory-stack">
          <SectionHeader
            eyebrow="02 / The factory stack"
            title="A practical map of the factory stack."
            description="This seven-part map adapts Warp's stack to FDLC stages and capabilities. Use the parts your delivery contract requires; FDLC does not prescribe one vendor or a fixed number of runtime layers."
          />
          <ol className="factory-stack-list">
            {factoryStackLayers.map((layer) => (
              <li key={layer.number}>
                <article>
                  <header>
                    <span>{layer.number}</span>
                    <h3>{layer.name}</h3>
                  </header>
                  <p>{layer.description}</p>
                  <p className="fdlc-mapping"><strong>FDLC mapping:</strong> {layer.fdlcMapping}</p>
                  <p className="engineering-source-note"><strong>Source:</strong> {layer.sourceNote}</p>
                </article>
              </li>
            ))}
          </ol>
        </section>

        {/* Section 3: Measure and improve */}
        <section className="section-block" id="measure-improve">
          <SectionHeader
            eyebrow="03 / Measure and improve"
            title="Five tools for the outer loop."
            description="Factory engineers should be learning scorers, self-improvement loops, replay benchmarks, model routing, and A/B tests the way earlier engineers learned linters, profilers, and debuggers."
          />
          <ol className="measure-improve-list">
            {measureImproveTools.map((tool) => (
              <li key={tool.number}>
                <article>
                  <header><span>{tool.number}</span><h3>{tool.name}</h3></header>
                  <p>{tool.description}</p>
                  <p className="fdlc-guardrail"><strong>FDLC guardrail:</strong> {tool.fdlcGuardrail}</p>
                  <p className="engineering-source-note"><strong>Source:</strong> {tool.sourceNote}</p>
                </article>
              </li>
            ))}
          </ol>
          <p>For the full measurement contract, including the twelve FDLC benchmark metrics and the factory performance scorecard, see <Link href="/benchmarks">FDLC Benchmarks →</Link></p>
        </section>

        {/* Section 4: Verification and merge risk */}
        <section className="section-block" id="verification">
          <SectionHeader
            eyebrow="04 / Verification and merge risk"
            title={verificationPractice.headline}
            description={verificationPractice.coreNote}
          />

          <h3>Evidence artifacts</h3>
          <p>{verificationPractice.evidenceArtifacts.description}</p>
          <p className="fdlc-mapping"><strong>FDLC:</strong> {verificationPractice.evidenceArtifacts.fdlcNote}</p>
          <p className="engineering-source-note"><strong>Sources:</strong> {verificationPractice.evidenceArtifacts.source}</p>

          <h3>Review-agent loop</h3>
          <p>{verificationPractice.reviewAgentLoop.description}</p>
          <p className="fdlc-mapping"><strong>FDLC:</strong> {verificationPractice.reviewAgentLoop.fdlcNote}</p>
          <p className="governance-callout"><strong>Contested practice:</strong> {verificationPractice.reviewAgentLoop.contestedPractice}</p>
          <p className="engineering-source-note"><strong>Sources:</strong> {verificationPractice.reviewAgentLoop.source}</p>

          <h3>Merge-risk rubric</h3>
          <p>Use merge-risk scoring to set review depth and route to code owners—not to replace approval. Each criterion maps to an FDLC stage.</p>
          <ol className="merge-risk-list">
            {mergeRiskCriteria.map((criterion) => (
              <li key={criterion.number}>
                <article>
                  <header><span>{criterion.number}</span><h3>{criterion.name}</h3></header>
                  <p>{criterion.description}</p>
                  <p className="fdlc-mapping"><strong>FDLC:</strong> {criterion.fdlcMapping}</p>
                </article>
              </li>
            ))}
          </ol>
          <p className="engineering-source-note">Merge-risk skill source: Ben Holmes (Oct 20 and Nov 6, 2026): <a href="https://x.com/BHolmesDev/status/2118807366250721741" rel="noreferrer" target="_blank">https://x.com/BHolmesDev/status/2118807366250721741 ↗</a></p>
        </section>

        {/* Section 5: Rollout and adoption */}
        <section className="section-block" id="rollout">
          <SectionHeader
            eyebrow="05 / Rollout and adoption"
            title="Start with chores, not the backlog."
            description="Factory adoption is a culture shift as much as a technical one. These tactics are drawn from Warp's public writing on what works and what causes teams to stall."
          />
          <ol className="rollout-list">
            {rolloutTactics.map((tactic) => (
              <li key={tactic.number}>
                <article>
                  <header><span>{tactic.number}</span><h3>{tactic.name}</h3></header>
                  <p>{tactic.description}</p>
                  {tactic.sourceNote && <p className="engineering-source-note"><strong>Source:</strong> {tactic.sourceNote}</p>}
                </article>
              </li>
            ))}
          </ol>
          <p>For the full enterprise adoption model including readiness phases, see the Guide: <a href="/guide/05-operate/38-enterprise-adoption-and-the-infrastructure-landscape" rel="noreferrer">Chapter 38, Enterprise Adoption and the Infrastructure Landscape →</a></p>
        </section>

        {/* Section 6: Taxonomy */}
        <section className="section-block" id="taxonomy">
          <SectionHeader
            eyebrow="06 / Taxonomy"
            title="From coding agent to software factory."
            description="The ladder from individual coding agent to production software factory, plus terms that have entered 2026 practice. Attributed to their sources."
          />
          <dl className="taxonomy-list">
            {factoryTaxonomyTerms.map((term) => (
              <div key={term.term} className="taxonomy-item">
                <dt>{term.term}</dt>
                <dd>{term.definition}</dd>
                {term.sourceNote && <dd className="engineering-source-note"><strong>Source:</strong> {term.sourceNote}</dd>}
              </div>
            ))}
          </dl>
        </section>

        {/* Section 7: Reading public numbers */}
        <section className="section-block reading-numbers-box" id="public-numbers">
          <SectionHeader
            eyebrow="07 / Reading public factory numbers"
            title={publicNumbersNotes.headline}
            description={publicNumbersNotes.instruction}
          />
          {publicNumbersNotes.cases.map((c) => (
            <div key={c.company} className="public-number-case">
              <h3>{c.company}</h3>
              <ul>{c.figures.map((f) => <li key={f}>{f}</li>)}</ul>
              <p><strong>Lesson:</strong> {c.lesson}</p>
              <p className="engineering-source-note"><strong>Sources:</strong> {c.source}</p>
            </div>
          ))}
          <p className="fdlc-principle">{publicNumbersNotes.fdlcPrinciple}</p>
        </section>

        {/* Debate / balance */}
        <section className="section-block" id="debate">
          <SectionHeader
            eyebrow="Perspective"
            title={factoryEngineeringDebate.headline}
          />
          <p>{factoryEngineeringDebate.counterpoint}</p>
          <p>{factoryEngineeringDebate.support}</p>
          <p className="governance-callout"><strong>FDLC position:</strong> {factoryEngineeringDebate.fdlcPosition}</p>
        </section>

        {/* Sources */}
        <section className="section-block" id="sources">
          <SectionHeader eyebrow="Sources" title="Read the sources and compare their assumptions." description="Vendor figures remain attributed claims. Check the workload, observation window, attribution rules, and missing evidence before applying a result to your own factory." />
          <ul className="sources-list">
            {factoryEngineeringPageSources.map((s) => (
              <li key={s.url}><a href={s.url} rel="noreferrer" target="_blank">{s.label} ↗</a></li>
            ))}
          </ul>
        </section>

        <section className="reading-next">
          <p className="section-label">Go deeper</p>
          <h2>See the measurement contract, then assess your factory.</h2>
          <div>
            <Link href="/benchmarks">FDLC Benchmarks →</Link>
            <Link href="/maturity">Maturity assessment →</Link>
            <Link href="/about#engineering-discipline">Software Factory Engineering ownership →</Link>
            <a href="/guide/05-operate/38-enterprise-adoption-and-the-infrastructure-landscape">Guide ch. 38: Enterprise Adoption →</a>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
