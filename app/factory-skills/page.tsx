/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the microfrontend boundary. */
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";
import download from "../../public/downloads/factory-starter.json";
import skills from "../../factory-starter/skills.lock.json";

export const metadata: Metadata = pageMetadata("Factory Skills Starter Kit", "Try a bounded bug-fix workflow using Skillz, an isolated branch, and failing-before/passing-after test evidence.", "/factory-skills");
const setup = `git clone https://github.com/jaydubya818/skillz.git skillz
git -C skillz checkout --detach ${skills.commit}
node factory-starter/demo.mjs ./skillz`;
const outcomes = ["Understand the affected code", "Define the fix and its scope", "Reproduce the bug, then fix it", "Run the same checks against the fix", "Review the changes and evidence"];

export default function FactorySkillsPage() {
  return <SiteShell><div className="page-wrap starter-page">
    <PageHero eyebrow="Factory skills / v0.1" status="Local pilot" variant="compact" title="Your first factory starts with one fix." description="Turn the Guide into practice. Use your Skillz skills and an existing Codex session to take a small bug from a failing test to a reviewable fix." meta={[["Runtime", "Node.js + Git"], ["Execution", "Local"], ["Merge", "Human decision"]]}>
      <div className="hero-actions"><a className="button button-dark" href={download.href} download>Download starter kit ↓</a><a className="text-action" href="#try-it">Try the example →</a></div>
    </PageHero>
    <section className="starter-outcome" aria-label="The result">
      <div><span className="section-label">The result</span><h2>A fix you can inspect.</h2><p>An isolated branch, the failure before the fix, the passing checks afterward, and a handoff for human review.</p></div>
      <ol><li><span>01</span>Failing regression</li><li><span>02</span>Passing candidate</li><li><span>03</span>Reviewable evidence</li></ol>
    </section>
    <section className="section-block" id="try-it">
      <SectionHeader eyebrow="Start here" title="Run the example first." description="You need Node.js 22.13 or newer, Git, and macOS or Linux. Extract the ZIP, then run these commands from the folder containing factory-starter. Use a new skillz folder." />
      <div className="starter-setup"><pre aria-label="Example setup commands"><code>{setup}</code></pre><div><h3>What should happen?</h3><p>The example counts only two batches for five items at capacity two. The regression expects three. The script records the mismatch, applies the known fix, and runs the checks again.</p><p><strong>Look for “status”: “verified”.</strong> The output includes the evidence directory.</p><p>This is a scripted demonstration. It does not claim an agent solved a new task.</p></div></div>
    </section>
    <section className="section-block">
      <SectionHeader eyebrow="Your skills, one workflow" title="Five phases. One source of truth." description="The kit references a pinned version of your Skillz repository. Its generated instructions guide your Codex session through the relevant skills, with the original supporting files and attribution intact." />
      <ol className="starter-skills">{skills.phases.map((item, index) => <li key={item.skill}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.phase}</h3><p>{outcomes[index]}</p><a href={`https://github.com/jaydubya818/skillz/blob/${skills.commit}/skills/${item.skill}/SKILL.md`}>{item.skill} ↗</a></div></li>)}</ol>
    </section>
    <section className="section-block" id="your-repository">
      <SectionHeader eyebrow="Next: your repository" title="Give Codex a bounded task." description="Start with a small, trusted, dependency-free Node repository. The README includes the task format and complete commands." />
      <ol className="starter-steps"><li><h3>Define the contract</h3><p>Name the bug, expected assertion mismatch, implementation files that may change, and existing tests. Keep the task JSON outside the repository.</p></li><li><h3>Begin the run</h3><p>The runner creates a worktree and branch, then checks the baseline. It writes a PROMPT.md with the selected skills and workflow commands.</p></li><li><h3>Open the worktree in Codex</h3><p>Ask your session to follow PROMPT.md. It writes the regression before the fix and keeps the same test for verification.</p></li><li><h3>Review the handoff</h3><p>Inspect the patch and logs. Check for stale evidence before committing. Your normal PR checks, merge approval, and release process still apply.</p></li></ol>
    </section>
    <section className="starter-limits" aria-labelledby="starter-limits-title"><h2 id="starter-limits-title">Know what the pilot checks.</h2><p>The runner checks changed files, workflow order, test results, and later changes to the recorded candidate. It stops on missing or failing checks, rewritten regression tests, timeouts, and exhausted retry budgets.</p><p>It is not a security sandbox or independent verifier. Use your harness permissions and trusted repositories. Logs stay local and may contain private data. A passing run does not approve a merge or establish production readiness.</p><p>Version 0.1 supports Node’s built-in test runner on macOS and Linux. Other languages, automatic PR creation, and Mission Control admission are future work.</p></section>
    <section className="reading-next"><p className="section-label">Keep going</p><h2>Understand the method behind the workflow.</h2><div><a href="/guide">Read the Guide →</a><Link href="/start">Define your factory line →</Link><a href="https://github.com/jaydubya818/skillz">Explore Skillz →</a></div></section>
    <p className="starter-download-note">Download v{download.version} · {Math.ceil(download.bytes / 1024)} KB · SHA-256 <code>{download.sha256}</code></p>
  </div></SiteShell>;
}
