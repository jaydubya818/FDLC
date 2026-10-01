import type { Metadata } from "next";
import Link from "next/link";
import { NextSteps } from "../components/next-steps";
import { PageHero } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Reference Factory Lab", "Run a tiny, real software factory locally and watch its gate block bad work.", "/lab");

const scenarios: [string, string, string][] = [
  ["happy", "Happy path", "Agent fixes the function, a different identity verifies it, the gate allows."],
  ["scope", "Out-of-scope edit", "Agent also writes .env. Authority limits block the release."],
  ["self-verify", "Self-verification", "Agent signs its own evidence. Independence is required, so it blocks."],
  ["stale", "Stale evidence", "Code changes after verification. The evidence no longer matches, so it blocks."],
  ["missing", "Missing evidence", "No verifier ran. No evidence, no release."],
];

export default function LabPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="Hands-on / Lab" variant="compact" status="Runnable" title="Run a factory, not a diagram." description="A zero-dependency Node script that implements the artifact chain end to end. The agent is a scripted stand-in; the gate, scope check and independent verifier are real code you can read in one sitting." meta={[["Requires", "Node 20+"], ["Dependencies", "None"], ["Runtime", "Under 1s"]]} />
    <aside className="builder-orientation"><strong>Run it</strong><pre><code>git clone https://github.com/jaydubya818/FDLC{"\n"}cd FDLC/reference-factory{"\n"}node lab.mjs          # all five scenarios{"\n"}node lab.mjs stale    # one scenario</code></pre><span>Read lab.mjs first: gate() is the whole idea</span></aside>
    <div className="lab-body">
    <ol className="lab-steps">
      {scenarios.map(([id, title, body]) => <li key={id}><h3>{title}</h3><p>{body}</p><code>node lab.mjs {id}</code></li>)}
    </ol>
    <p className="lab-expect">Every scenario prints what it expects and whether the gate agreed. Exit code 0 means all five matched.</p>
    <p>Want to see the same chain without running code? Try the <Link href="/simulator">runtime simulator</Link>.</p>
    </div>
    <NextSteps eyebrow="Next" title="Make it yours." links={[["/start", "Define your own factory"], ["/simulator", "Open the simulator"], ["/mission-control", "See the production control plane"]]} />
  </div></SiteShell>;
}
