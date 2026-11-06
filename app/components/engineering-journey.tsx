import Link from "next/link";
const journey = [
  ["Learn", "Understand the architecture", "Framework, Guide and Factory Explorer", "/framework#explorer", "Explore the framework"],
  ["Design", "Define the contract", "Factory Definition, outcome, scope and decision rights", "/start", "Open the existing builder"],
  ["Build", "Use your preferred stack", "Executable Reference Lab and optional Starter Kit", "/lab#own-stack", "Build your first factory"],
  ["Run", "Experience a bounded workflow", "WorkOrders, Tasks, Attempts and controlled failure", "/simulator", "Experience a factory"],
  ["Verify", "Inspect evidence and authority", "Exact Candidate, independent checks and qualification", "/lab#qualification", "Inspect qualification"],
  ["Improve", "Qualify the next Version", "Observed failure → proposal → evaluation → decision", "/guide/appendix/engineering-experience#improve", "Follow governed improvement"],
] as const;
export function EngineeringJourney() {
  return <section className="content-section engineering-journey" id="engineering-journey" aria-labelledby="engineering-journey-title"><p className="section-label">The engineering experience</p><h2 id="engineering-journey-title">Learn → Design → Build → Run → Verify → Improve</h2><p>FDLC defines the engineering discipline, not the technology stack. This learning path connects existing tools and Guide chapters; it does not replace the governing lifecycle or enterprise delivery flow.</p><ol>{journey.map(([name, title, output, href, action], index) => <li key={name}><span>{String(index + 1).padStart(2, "0")} / {name}</span><h3>{title}</h3><p>{output}</p>{href.startsWith("/guide") ? <a className="text-action" href={href}>{action} →</a> : <Link className="text-action" href={href}>{action} →</Link>}</li>)}</ol><p className="engineering-independence">Choose your own agents, harnesses, models, tools, orchestration and infrastructure. <Link href="/mission-control">Mission Control</Link> is an optional open-source reference implementation of selected control-plane concepts. Compatibility requires demonstrated contracts and qualification.</p></section>;
}
