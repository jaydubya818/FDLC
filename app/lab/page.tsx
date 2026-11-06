/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the microfrontend boundary. */
import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "../components/copy-button";
import { NextSteps } from "../components/next-steps";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";
import "./tutorial.css";

export const metadata: Metadata = pageMetadata("Build and Run Your First FDLC Software Factory", "A practical, dependency-free Reference Lab: fix a failing API test, inspect real evidence, block unsafe work and qualify your next implementation.", "/lab");
const source = "/reference-factory/source/";
const commands = `cd fdlc-reference-lab-v1.1.0
node lab.mjs all
node lab.mjs failed
node lab.mjs recovery
node lab.mjs approval
node lab.mjs --report > qualification.json`;
const scenarios = [
  ["happy", "Verified API fix", "Real protected checks pass for GET /sum, invalid input and unknown paths. ALLOW means eligible for local review."],
  ["scope", "Out-of-scope edit", "The producer also writes .env. Observed files exceed the src/add.js grant, so the gate blocks."],
  ["self-verify", "Self-verification", "Producer and verifier have the same identity label; the gate blocks."],
  ["stale", "Stale evidence", "Code changes after verification. The candidate digest no longer matches."],
  ["missing", "Missing evidence", "No verifier ran. The gate refuses to infer success."],
  ["failed", "Failed API acceptance", "The scripted correction is wrong. AC-1 fails and progression stops."],
  ["recovery", "Correction and re-verification", "Keep the first failed Attempt and gate result, produce a new Candidate, then run the verifier again."],
  ["approval", "Human decision boundary", "Checks pass, but a production request remains WAIT. This Lab never publishes or releases."],
] as const;

export default function LabPage() {
  return <SiteShell><div className="page-wrap engineering-tutorial">
    <PageHero eyebrow="Hands-on / Existing Reference Lab" variant="compact" status="Executable example" title="Build and run your first FDLC software factory." description="Fix a failing API test, inspect the contract and evidence, then replace the scripted producer with your own stack. Mission Control is an optional second learning path." meta={[["Prerequisites", "Node 22.13+"], ["Guide time", "30–60 minutes, estimated"], ["Dependencies", "None for this Lab"]]} />
    <nav className="tutorial-nav" aria-label="Tutorial sections"><a href="#reference">Run the Lab</a><a href="#own-stack">Use your own stack</a><a href="#qualification">Qualification</a><a href="#mission-control-path">Mission Control path</a><a href="#improve">Improve</a></nav>
    <aside className="builder-orientation"><strong>Same contracts. Your implementation.</strong><p>The producer is a known scripted stand-in. API tests, candidate hashing and policy checks execute locally. Separate functions and role labels illustrate independent verification; they do not provide security isolation. Run trusted code only. No model, account, credentials, external service or live agent is needed for this Lab.</p><p><Link href="/simulator">Experience the same boundaries in your browser →</Link> · <a href="/guide/appendix/engineering-experience">Open the complete tutorial and engineering playbook →</a></p></aside>
    <section className="tutorial-section" id="reference"><SectionHeader eyebrow="First 10 minutes / Reference implementation" title="Run the existing Lab, then inspect its records." description="Download and extract the standalone Lab into a new folder. It includes the code, contracts, protected tests and README. No repository access, account or npm install is needed." />
      <p><a className="button button-dark" href="/downloads/fdlc-reference-lab-v1.1.0.zip" download>Download the Reference Lab ZIP</a> · <a href="/reference-factory/source/manifest.json">Inspect files and SHA-256 manifest</a></p>
      <div className="quickstart-code">
        <div className="quickstart-code-toolbar"><a href={`${source}lab.mjs.txt`}>Read the executable source ↗</a><CopyButton label="Copy Lab commands" text={commands} /></div>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The horizontal command scroller must be keyboard reachable. */}
        <pre role="region" aria-label="Reference Lab commands" tabIndex={0}><code>{commands}</code></pre>
      </div>
      <p>All eight cases should print <code>(ok)</code>. A deliberately blocked scenario exits successfully when the gate denies it for the expected reason. Inspect <code>qualification.json</code>: <code>suite.matched</code> should be 8, <code>suite.mismatched</code> 0, and <code>productionQualified</code> false.</p>
      <ol className="tutorial-checkpoints"><li><strong>Define</strong><p>Read <a href={`${source}factory-definition.json.txt`}>factory-definition.json</a> and <a href={`${source}work-order.json.txt`}>work-order.json</a>. Find scope, protected acceptance criteria, Tasks, correction limit and retained human authority.</p></li><li><strong>Run + inspect</strong><p>Read <a href={`${source}lab.mjs.txt`}>runAgent, runVerifier, gate and runScenario</a>. Follow the Attempt, exact Candidate digest, verifier output and decision in the JSON report.</p></li><li><strong>Break + recover</strong><p>Run the failed and recovery cases. Compare the first failed Candidate and its evidence with the corrected Candidate. A new result preserves the earlier record.</p></li></ol>
      <div className="tutorial-scenarios">{scenarios.map(([id, title, body]) => <article key={id}><code>node lab.mjs {id}</code><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>
    <section className="tutorial-section" id="own-stack"><SectionHeader eyebrow="Next 20–35 minutes / Path B" title="Build with your preferred technology stack." description="Keep the contract and verifier fixed while changing how a producer creates the Candidate. You do not need Mission Control, the Starter Kit or a particular provider." />
      <ol className="tutorial-checkpoints"><li><strong>Freeze the outcome</strong><p>Keep AC-1/2/3 and the acceptance tests outside producer write scope. Export a <Link href="/start">Factory Definition</Link> and record workload, owner, file scope, budgets, verifier and authority boundary.</p></li><li><strong>Replace one seam</strong><p>Adapt <code>runAgent(dir)</code> to return an attributable identity and changed-file list after your chosen agent, harness or deterministic tool creates the patch. Preserve <code>runVerifier(dir)</code> and <code>gate(...)</code>. For a first exercise, manually apply the known correction in an isolated copy; then integrate your own executor separately.</p></li><li><strong>Protect the boundary</strong><p>A real implementation must put protected tests, verifier identity, policy and release credentials beyond producer control. A temporary folder and different strings do not enforce that boundary. Add isolation, timeouts and immutable evidence suitable for your workload.</p></li><li><strong>Prove the substitution</strong><p>Re-run the API and policy cases, including self-verification, stale evidence, protected-test changes and recovery. Keep the same acceptance criteria. Treat every changed harness/model/runtime tuple as unqualified until its evidence supports the intended operating domain.</p></li></ol>
      <p><Link href="/factory-skills">Optional Factory Skills Starter Kit</Link> supplies a more opinionated local Codex pilot with pinned skills. Its selected-test evidence is not independent certification. No compatibility with other harnesses or model providers is claimed.</p>
    </section>
    <section className="tutorial-section" id="qualification"><SectionHeader eyebrow="Final 10–15 minutes / Evidence" title="A passing exercise has a narrow meaning." description="Generate a fresh report for your exact local environment. The report records what ran, what failed, which Candidate was tested and what remains unqualified." />
      <div className="tutorial-contract-grid"><article><h3>Measured by the Lab</h3><ul><li>Protected API checks and baseline behavior</li><li>Observed file scope and exact candidate SHA-256</li><li>Missing, stale and self-signed evidence denial</li><li>Failed record retained through correction</li><li>Human-required action safely waiting</li></ul></article><article><h3>Still requires qualification</h3><ul><li>Independent security principals and execution isolation</li><li>Your exact model, harness, tools and runtime</li><li>Context sufficiency on representative workloads</li><li>Production reliability, latency and full costs</li><li>Operational owners, rollback and evidence retention</li></ul></article></div>
      <p><code>qualification.json</code> is an illustrative local evidence report, not a canonical Qualification Record or production certification. Inspect Factory Version, composition digest, environment, scenarios, acceptance criteria, policy/recovery results, limitations and evidence output. Production-qualified operating domain remains <strong>none</strong>.</p>
      <p>Contract and negative-control checks from the extracted Lab: <code>node --test contract.test.mjs</code>. Read the <a href={`${source}contract.test.mjs.txt`}>executable negative controls</a> and <a href="/guide/appendix/engineering-experience#portable-contracts">canonical schema coverage map</a>.</p>
    </section>
    <section className="tutorial-section" id="mission-control-path"><SectionHeader eyebrow="Path A / Optional open-source control plane" title="Explore Mission Control with its own prerequisites." description="Use the documented deterministic demo to inspect a Mission, approved Plan, WorkOrders, Tasks, Factory configuration, Attempts, evidence and human decisions. It requires a Convex development deployment; this account-free Lab does not." />
      <p><Link className="text-action" href="/mission-control#quickstart">Open the source-checked Mission Control setup →</Link> · <a href="/guide/appendix/engineering-experience#path-a-experience-mission-control">Follow the guided inspection and qualification commands →</a></p><p>Mission Control&apos;s capability ledger distinguishes implemented, experimental and proposed behavior. Its demo fixture is not proof of live autonomous production. No Mission Control services are installed or activated by this tutorial.</p>
    </section>
    <section className="tutorial-section" id="improve"><SectionHeader eyebrow="Close the loop" title="Improve the factory, then qualify a new Version." description="Use the failed API case to identify a missing verification or context condition. Propose the smallest change, preserve the old evidence, add a negative control, compare the same workload and seek the authorized promotion decision." /><p>Changing the producer, verifier, policy or context is a versioned factory change. A passing local fixture does not activate it in production. Read <a href="/guide/06-improve/40-governed-learning">governed learning</a> and the <a href="/guide/appendix/engineering-experience#engineering-playbook">six-phase engineering playbook</a> for acceptance criteria, deliverables and common failures.</p></section>
    <NextSteps eyebrow="Next" title="Choose one bounded workload." links={[["/start", "Define your factory"], ["/simulator", "Inspect the browser demonstration"], ["/guide/appendix/engineering-experience", "Use the engineering playbook"]]} />
  </div></SiteShell>;
}
