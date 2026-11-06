/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the microfrontend boundary. */
import type { Metadata } from "next";
import "./starter.css";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";
import download from "../../public/downloads/factory-starter.json";
import skills from "../../factory-starter/skills.lock.json";

export const metadata: Metadata = pageMetadata("Factory Skills", "Download the complete Skillz collection for Codex, Claude Code, and Cursor, or try the optional Factory Skills Starter Kit.", "/factory-skills");
const source = skills.repository.replace(/\.git$/, "");
const fullDownload = `${source}/archive/${skills.commit}.zip`;
const install = `cd skillz-${skills.commit}
python3 scripts/install_skills.py --codex --dry-run
python3 scripts/install_skills.py --codex`;
const setup = `git clone https://github.com/jaydubya818/skillz.git skillz
git -C skillz checkout --detach ${skills.commit}
node factory-starter/demo.mjs ./skillz`;
const outcomes = ["Understand the affected code", "Define the fix and its scope", "Reproduce the bug, then fix it", "Run the same checks against the fix", "Review the changes and evidence"];

export default function FactorySkillsPage() {
  return <SiteShell><div className="page-wrap starter-page">
    <PageHero eyebrow="Factory skills / Skillz" variant="compact" title="Factory skills for your coding agent." description="Download the complete collection for planning, implementation, testing, review, and governed delivery. Use the skills with Codex, Claude Code, Cursor, or another Agent Skills runtime." meta={[["Collection", "109 skills"], ["Format", "Agent Skills"], ["Installer", "Python 3.10+"]]}>
      <div className="hero-actions"><a className="button button-dark" href={fullDownload}>Download Factory Skills ↓</a><a className="button button-light" href={download.href} download>Download starter kit ↓</a><a className="text-action" href="#install-skills">Install the skills →</a></div>
    </PageHero>
    <section className="section-block" id="install-skills">
      <SectionHeader eyebrow="The complete collection" title="Install the skills in your coding agent." description="The ZIP includes all 109 skills, supporting references, companion agents, plugin manifests, and license notices. It downloads directly from the Skillz repository on GitHub." />
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable commands need keyboard access on narrow screens. */}
      <div className="starter-setup"><div><p>Extract the ZIP, then open a terminal in the folder containing the extracted directory. You need Python 3.10 or newer.</p><pre tabIndex={0} aria-label="Factory Skills installation commands"><code>{install}</code></pre></div><div><h3>Choose your coding agent.</h3><p>These commands install for Codex. For Claude Code, use <code>--claude</code> instead of <code>--codex</code> in both commands. For Cursor, use <code>--cursor</code>. Use <code>--all</code> to install for all three.</p><p>Run the dry run first to preview the destination. The installer stops if it finds a different skill with the same name; the README explains replacement with backups and project-specific installs.</p><a className="text-action" href={`${source}/blob/${skills.commit}/README.md#choose-an-installation`}>Read the installation options →</a><p>Source revision <a href={`${source}/tree/${skills.commit}`}><code>{skills.commit.slice(0, 7)}</code></a> · <a href={`${source}/blob/${skills.commit}/LICENSES.md`}>Licensing and attribution</a></p></div></div>
    </section>
    <section className="starter-outcome" aria-label="Optional starter kit">
      <div><span className="section-label">Optional starter kit / v{download.version}</span><h2>A guided first run.</h2><p>Try a local bug-fix pilot with an isolated branch, the failure before the fix, passing checks afterward, and a handoff for human review.</p><a className="text-action" href="#try-it">Run the example →</a></div>
      <ol><li><span>01</span>Failing regression</li><li><span>02</span>Passing candidate</li><li><span>03</span>Reviewable evidence</li></ol>
    </section>
    <section className="section-block" id="try-it">
      <SectionHeader eyebrow="Start here" title="Run the example first." description="You need Node.js 22.13 or newer, Git, and macOS or Linux. Extract the ZIP, then run these commands from the folder containing factory-starter. Use a new skillz folder." />
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable commands need keyboard access on narrow screens. */}
      <div className="starter-setup"><pre tabIndex={0} aria-label="Example setup commands"><code>{setup}</code></pre><div><h3>What should happen?</h3><p>The example counts only two batches for five items at capacity two. The regression expects three. The script records the mismatch, applies the known fix, and runs the checks again.</p><p><strong>Look for “status”: “verified”.</strong> The output includes the evidence directory.</p><p>This is a scripted demonstration. It does not claim an agent solved a new task.</p></div></div>
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
    <p className="starter-download-note">Starter kit v{download.version} · {Math.ceil(download.bytes / 1024)} KB · SHA-256 <code>{download.sha256}</code></p>
  </div></SiteShell>;
}
