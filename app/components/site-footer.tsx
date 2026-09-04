import Link from "next/link";

const groups = [
  ["Learn", [["Framework", "/framework"], ["Architecture", "/architecture"], ["Guide", "/guide"], ["Manifesto", "/manifesto"]]],
  ["Build", [["FDLC in 5 Minutes", "/examples/dependency-modernization"], ["Mission Control", "/mission-control"], ["Specification", "/spec"], ["Start", "/start"], ["GitHub", "https://github.com/jaydubya818/MissionControl"]]],
  ["Adopt", [["Maturity", "/maturity"], ["Benchmarks", "/benchmarks"], ["Enterprise", "/enterprise"], ["Deploy", "/deploy"]]],
  ["Project", [["About", "/about"], ["Source audit", "https://github.com/jaydubya818/ai-software-factory-mastery"], ["Mission Control status", "https://github.com/jaydubya818/MissionControl/blob/main/docs/product/software-factory-capability-maturity.md"]]],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" href="/"><span aria-hidden="true" className="wordmark-mark">F</span><span>FDLC<span className="wordmark-dot">.ai</span></span></Link>
          <p>The operating model and technical foundation for trusted autonomous software delivery.</p>
        </div>
        {groups.map(([title, links]) => (
          <nav aria-label={`${title} links`} className="footer-group" key={title}>
            <strong>{title}</strong>
            {links.map(([label, href]) => <Link href={href} key={href}>{label}{href.startsWith("http") && <span aria-hidden="true"> ↗</span>}</Link>)}
          </nav>
        ))}
      </div>
      <div className="footer-base">
        <span>© 2026 FDLC.ai</span>
        <span>Factory Development Lifecycle</span>
        <span>Open framework · Working reference · Governed autonomy</span>
      </div>
    </footer>
  );
}
