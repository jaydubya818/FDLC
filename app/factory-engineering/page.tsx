/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes require document navigation. */
import type { Metadata } from "next";
import Link from "next/link";
import { dependencyModernizationExample } from "../../data/dependency-modernization-example";
import {
  factoryEngineeringDebate, factoryEngineeringPageSources, factoryStackLayers, factoryTaxonomyTerms,
  measureImproveTools, mergeRiskCriteria, publicNumbersNotes, rolloutTactics, verificationPractice,
  type PracticeSource,
} from "../../data/factory-engineering";
import { pageMetadata } from "../../lib/metadata";
import { PageContentsNav, type PageContentsItem } from "../components/page-contents-nav";
import { SiteShell } from "../components/site-shell";
import styles from "./practice.module.css";

export const metadata: Metadata = pageMetadata(
  "Factory Engineering in Practice",
  "A practical guide to defining a software factory, verifying a change, measuring outcomes and rolling out one workflow at a time.",
  "/factory-engineering",
);

const contents = [
  { href: "#two-jobs", label: "Responsibilities" },
  { href: "#factory-stack", label: "The factory stack" },
  { href: "#verification", label: "Verification and release" },
  { href: "#measure-improve", label: "Measurement" },
  { href: "#rollout", label: "Rollout" },
  { href: "#taxonomy", label: "Glossary and perspectives" },
  { href: "#sources", label: "Source material" },
] as const satisfies readonly PageContentsItem[];

function SourceLinks({ sources }: { sources: readonly PracticeSource[] }) {
  return <ul className={styles.sources} aria-label="Sources">
    {sources.map(({ label, url }) => <li key={url}><a href={url}>{label}</a></li>)}
  </ul>;
}

export default function FactoryEngineeringPage() {
  return <SiteShell>
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <Link className={styles.back} href="/framework">← FDLC framework</Link>
          <h1>Factory engineering</h1>
          <p>Design how a software change moves from a request to a release. Specify what a worker may change, what a verifier must prove, and who can approve the result.</p>
          <a className={styles.start} href="#factory-stack">Explore the factory stack <span aria-hidden="true">↓</span></a>
        </div>
        <figure className={styles.workOrder}>
          <figcaption><span>Worked example</span><code>checkout-api</code></figcaption>
          <p className={styles.specimenTitle}>Acme Payments SDK upgrade</p>
          <div className={styles.versionPath}>
            <div><small>Current version</small><strong>v3</strong></div>
            <span className={styles.versionArrow} aria-hidden="true"></span>
            <div><small>Candidate version</small><strong>v4</strong></div>
          </div>
          <dl className={styles.contract}>
            <div><dt>Keep stable</dt><dd>Public API and permissions</dd></div>
            <div><dt>Verify with</dt><dd>Contract and integration tests</dd></div>
          </dl>
          <Link className={styles.exampleLink} href="/in-5-minutes">Follow this change through FDLC <span aria-hidden="true">→</span></Link>
        </figure>
      </div>
    </header>

    <div className={`longform-layout ${styles.layout}`}>
      <PageContentsNav variant="rail" title="In this guide" mobileTitle="Jump to a section" items={contents} />
      <div className={styles.article}>
        <section id="two-jobs" className={styles.section}>
          <h2>Who owns what?</h2>
          <dl className={styles.roles}>
            <div><dt>Product engineering</dt><dd>Owns the behavior customers depend on. For the SDK upgrade, that means checkout must accept the same requests and return the same responses.</dd></div>
            <div><dt>Factory engineering</dt><dd>Owns the system that delivers the change. That includes the worker’s permissions, the compatibility checks and the handoff to the release owner.</dd></div>
          </dl>
        </section>

        <section id="factory-stack" className={styles.section}>
          <h2>The factory stack</h2>
          <p className={styles.intro}>Use these seven questions to review a workflow. A team can handle several responsibilities in the same tool.</p>
          <div className={styles.stack}>
            {factoryStackLayers.map((layer) => <details key={layer.name} className={styles.layer}>
              <summary><strong>{layer.name}</strong><span>{layer.question}</span><i className={styles.toggle} aria-hidden="true" /></summary>
              <div className={styles.detailBody}>
                <p>{layer.description}</p><p>{layer.fdlcMapping}</p><SourceLinks sources={layer.sources} />
              </div>
            </details>)}
          </div>
        </section>

        <section id="verification" className={styles.section}>
          <h2>{verificationPractice.headline}</h2>
          <p className={styles.intro}>{verificationPractice.coreNote}</p>
          <div className={styles.evidence}>
            <h3>What the SDK upgrade must prove</h3>
            <ul>{dependencyModernizationExample.acceptanceCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
          </div>
          <details className={styles.disclosure}>
            <summary>Review evidence and release authority<i className={styles.toggle} aria-hidden="true" /></summary>
            <div className={styles.detailBody}>
              <h3>Evidence to attach</h3><p>{verificationPractice.evidenceArtifacts.description} {verificationPractice.evidenceArtifacts.fdlcNote}</p>
              <SourceLinks sources={verificationPractice.evidenceArtifacts.sources} />
              <h3>Agent review and human approval</h3><p>{verificationPractice.reviewAgentLoop.description} {verificationPractice.reviewAgentLoop.fdlcNote}</p>
              <SourceLinks sources={verificationPractice.reviewAgentLoop.sources} />
            </div>
          </details>
          <details className={styles.disclosure}>
            <summary>Five questions for assessing merge risk<i className={styles.toggle} aria-hidden="true" /></summary>
            <div className={styles.detailBody}><dl className={styles.referenceList}>{mergeRiskCriteria.map((criterion) => <div key={criterion.name}>
              <dt>{criterion.name}</dt><dd>{criterion.description}</dd><dd>{criterion.fdlcMapping}</dd>
            </div>)}</dl><SourceLinks sources={[{ label: "Ben Holmes on assessing merge risk", url: "https://x.com/BHolmesDev/status/2118807366250721741" }]} /></div>
          </details>
        </section>

        <section id="measure-improve" className={styles.section}>
          <h2>Measure the outcome</h2>
          <p className={styles.intro}>For dependency upgrades, record which requests were eligible and which candidates met the acceptance criteria. Include failed attempts when adding up cost.</p>
          <figure className={styles.metric}>
            <figcaption>{dependencyModernizationExample.primaryMetric.name}</figcaption>
            <p>{dependencyModernizationExample.primaryMetric.formula}</p>
            <Link href="/benchmarks">See the measurement contract <span aria-hidden="true">→</span></Link>
          </figure>
          <h3 className={styles.subhead}>Choose a measurement method</h3>
          {measureImproveTools.map((tool) => <details key={tool.name} className={styles.layer}>
            <summary><strong>{tool.name}</strong><span>{tool.question}</span><i className={styles.toggle} aria-hidden="true" /></summary>
            <div className={styles.detailBody}><p>{tool.description}</p><p>{tool.fdlcGuardrail}</p><SourceLinks sources={tool.sources} /></div>
          </details>)}
          <details id="public-numbers" className={styles.disclosure}>
            <summary>How to read public figures from Uber and Warp<i className={styles.toggle} aria-hidden="true" /></summary>
            <div className={styles.detailBody}>
              <p>Compare the task mix, observation window and denominator before drawing a conclusion from a vendor’s figures.</p>
              {publicNumbersNotes.cases.map((example) => <div key={example.company}>
                <h3>{example.company}</h3><ul>{example.figures.map((figure) => <li key={figure}>{figure}</li>)}</ul>
                <p>{example.lesson}</p><SourceLinks sources={example.sources} />
              </div>)}
            </div>
          </details>
        </section>

        <section id="rollout" className={styles.section}>
          <h2>Roll out one workflow</h2>
          <p className={styles.intro}>Choose work the team already understands. Give someone the authority to stop the run and decide what evidence would justify expanding its scope.</p>
          <ol className={styles.phases}>{rolloutTactics.filter((tactic) => tactic.phase).map((tactic) => <li key={tactic.name}>
            <span>{tactic.phase}</span><div><h3>{tactic.name}</h3><p>{tactic.description}</p></div>
          </li>)}</ol>
          <details className={styles.disclosure}>
            <summary>Team adoption checklist<i className={styles.toggle} aria-hidden="true" /></summary>
            <div className={styles.detailBody}><dl className={styles.referenceList}>{rolloutTactics.filter((tactic) => !tactic.phase).map((tactic) => <div key={tactic.name}>
              <dt>{tactic.name}</dt><dd>{tactic.description}</dd>
            </div>)}</dl>
            </div>
          </details>
          <a className={styles.readMore} href="/guide/05-operate/38-enterprise-adoption-and-the-infrastructure-landscape">Read the enterprise adoption chapter <span aria-hidden="true">→</span></a>
        </section>

        <section id="taxonomy" className={styles.section}>
          <h2>Glossary and perspectives</h2>
          <details className={styles.disclosure}>
            <summary>Factory engineering terms<i className={styles.toggle} aria-hidden="true" /></summary>
            <div className={styles.detailBody}><dl className={styles.referenceList}>{factoryTaxonomyTerms.map((term) => <div key={term.term}>
              <dt>{term.term}</dt><dd>{term.definition}</dd>
            </div>)}</dl></div>
          </details>
          <details id="debate" className={styles.disclosure}>
            <summary>What practitioners mean by “software factory”<i className={styles.toggle} aria-hidden="true" /></summary>
            <div className={styles.detailBody}>
              <p>{factoryEngineeringDebate.counterpoint}</p><SourceLinks sources={[factoryEngineeringDebate.counterpointSource]} />
              <p>{factoryEngineeringDebate.support}</p><SourceLinks sources={[factoryEngineeringDebate.supportSource]} />
              <p>{factoryEngineeringDebate.fdlcPosition}</p>
            </div>
          </details>
        </section>

        <section id="sources" className={styles.section}>
          <h2>Source material</h2>
          <p className={styles.intro}>The engineering accounts below describe particular teams and tools. Use their examples to test a choice in your own workflow.</p>
          <details className={styles.disclosure}>
            <summary>Articles, talks and research<i className={styles.toggle} aria-hidden="true" /></summary>
            <div className={styles.detailBody}><SourceLinks sources={factoryEngineeringPageSources} /></div>
          </details>
          <div className={styles.next}>
            <Link href="/maturity">Assess your factory <span aria-hidden="true">→</span></Link>
            <Link href="/about#engineering-discipline">FDLC ownership and scope <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>
    </div>
  </SiteShell>;
}
