/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the microfrontend boundary. */
import Link from "next/link";
import { CopyButton } from "./copy-button";
import { SectionHeader } from "./page-hero";

const demoCommands = `node operations.mjs demo ./small-factory-demo
node operations.mjs status ./small-factory-demo
node --test operations.test.mjs`;

const intakeCommands = `node operations.mjs init ./my-small-factory
node operations.mjs enqueue ./my-small-factory api-check-001
node operations.mjs enqueue ./my-small-factory api-check-001
node operations.mjs work ./my-small-factory
node operations.mjs status ./my-small-factory`;

const reviewCases = [
  ["Verified candidate", "Inspect the exact candidate, evidence and requested action. Decide within your existing authority."],
  ["Failed verification", "Preserve the failed Attempt. Correct only within the remaining shared budget, then verify again."],
  ["Unknown effect", "Reconcile the stable effect identity with its receipt before deciding whether another attempt is safe."],
  ["Stale evidence", "Verify the current candidate. An earlier decision cannot transfer to changed content."],
  ["Budget exhausted", "Stop new work. Record the cause and request a bounded owner decision."],
  ["No eligible work", "Remain idle. A trigger is a reason to inspect intake, not a reason to invent work."],
] as const;

export function SmallFactoryTutorial() {
  return <section className="tutorial-section" id="operate-a-small-factory">
    <SectionHeader eyebrow="Next exercise / recurring operation" title="Operate a small factory with a human near the loop." description="Start with one repeatable outcome. Let bounded work reach a reviewable result, then spend your attention on evidence, exceptions and decisions." />
    <div className="tutorial-operating-intro"><div><h3>One useful starting point</h3><p>Repair a reproducible API failure in an approved file. The scripted producer prepares a candidate, the protected checks verify it, and the operator reviews the exact result. Repeated event delivery must not create repeated work.</p></div><div><h3>What changes when you step away?</h3><p>Work and evidence must survive a process restart. Budgets must still apply. An unavailable reviewer leaves work waiting at its decision boundary. Closing a browser is not the test of those properties.</p></div></div>

    <ol className="tutorial-checkpoints">
      <li><strong>Initialize from a template</strong><p>Extract this Lab into a new folder. A reusable template supplies starting capabilities; it has no authority over your repository until you define and authorize its scope.</p></li>
      <li><strong>Configure and specialize one workload</strong><p>Choose the <Link href="/start">test-repair or documentation-drift starting point</Link>. Name the outcome, protected checks, file scope, owner and review boundary. Add a separate <Link href="/start#operating-profile">operating profile</Link> for intake and shared limits.</p></li>
      <li><strong>Qualify the exact composition</strong><p>Pin the Definition revision, implementation, harness, model, tools and runtime in a Factory Version. Run positive and negative cases for that version. This local exercise qualifies only the properties its report actually measures.</p></li>
      <li><strong>Authorize operation and observe results</strong><p>A deployment decision names the version, environment and allowed actions. Operating approval and permission to release each candidate remain explicit. Feedback proposes a new version, which repeats qualification before promotion.</p></li>
    </ol>

    <p>Before connecting a backlog, follow the <Link href="/factory-engineering#intake-to-review">intake-to-review practice flow</Link>: admit eligible work, resolve product choices, bind evidence to a candidate, and correlate later alerts with the work that produced it.</p>

    <h3>Run the persisted operating exercise</h3>
    <p>From the extracted Lab directory, use a new directory name for each demo. The companion uses the same protected API checks as the original Lab, adds saved WorkOrder records and local effect receipts, and exercises recovery through separate processes.</p>
    <div className="quickstart-code"><div className="quickstart-code-toolbar"><a href="/reference-factory/source/operations.mjs.txt">Read the operating companion ↗</a><CopyButton label="Copy operating exercise" text={demoCommands} /></div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The command scroller must be keyboard reachable. */}
      <pre role="region" aria-label="Small factory operating exercise" tabIndex={0}><code>{demoCommands}</code></pre>
    </div>
    <p>The demo and tests cover duplicate intake, restart, an effect written before its acknowledgment, exact review binding, bounded correction and stopping. Inspect the report and retained records. These are trusted local filesystem exercises with a scripted producer. They do not run a scheduler or live agent, isolate security principals, or publish a release.</p>

    <details className="tutorial-operating-details"><summary>Walk through intake and review yourself</summary>
      <p>Each command starts a new process. Run this sequence from the extracted Lab directory. The second delivery of <code>api-check-001</code> resolves to the same WorkOrder.</p>
      <div className="quickstart-code"><div className="quickstart-code-toolbar"><span>Manual operating walkthrough</span><CopyButton label="Copy intake walkthrough" text={intakeCommands} /></div>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The command scroller must be keyboard reachable. */}
        <pre role="region" aria-label="Persistent intake commands" tabIndex={0}><code>{intakeCommands}</code></pre>
      </div>
      <p>Inspect <code>status</code>, then use the <code>review</code> command documented in the <a href="/reference-factory/source/README.md.txt">Lab README</a> with the printed WorkOrder ID, candidate SHA-256 and verifier-output SHA-256. Acceptance is local to this exercise. It grants no merge, deployment or publishing authority.</p>
      <p>The exercise fixes a parent budget of two work units across the operating directory, with at most two Attempts per WorkOrder. A new scripted Attempt consumes a unit; reconciliation and resuming the same Attempt do not create another allowance. This makes exhaustion visible without pretending to measure dollars or live-model usage.</p>
    </details>

    <h3>Make the morning review a decision queue</h3>
    <p>Present the result, evidence, remaining budget and requested decision before the conversation transcript. Keep the detailed tool receipts available for inspection. A readable summary helps triage; the underlying evidence still determines what may happen next.</p>
    <div className="tutorial-review-cases">{reviewCases.map(([title, body]) => <article key={title}><h4>{title}</h4><p>{body}</p></article>)}</div>
    <div className="tutorial-reference-links"><Link href="/simulator#morning-review">Practice all six decisions in the morning review →</Link><a href="/guide/appendix/engineering-experience#tiny-software-factories-crosswalk">Map Tiny Software Factories concepts to FDLC →</a></div>

    <h3>Measure the work and the attention it needs</h3>
    <p>Declare a workload cohort and observation window before comparing versions. Retain failed, cancelled and pending WorkOrders in the report. Count verified results, accepted results and observed effects separately.</p>
    <dl className="tutorial-measurements"><div><dt>Cost per verified outcome</dt><dd>Total cohort cost, including failed attempts, delegated work, verification, infrastructure and human review, divided by verified outcomes in that cohort. If none are verified, report the cost and zero outcomes without dividing.</dd></div><div><dt>Human attention</dt><dd>Review minutes, interventions per WorkOrder, time waiting for a decision and recovery time. More tool calls or less visible chat are not evidence of less human work.</dd></div><div><dt>Quality after acceptance</dt><dd>Observed success, escaped defects, reopen rate and rollback rate over a declared window. Record pending observation rather than assuming an accepted candidate achieved the intended outcome.</dd></div></dl>
    <p>Read the <a href="/guide/appendix/engineering-experience#operate-a-small-factory">operating playbook</a> for durable scheduling, context management, authorized tool access, subagent budgets and changes to a running factory.</p>
  </section>;
}
