import Link from "next/link";
import Image from "next/image";

const groups = [
  ["Learn", [["Framework", "/framework"], ["Architecture", "/architecture"], ["Guide", "/guide"], ["Manifesto", "/manifesto"]]],
  ["Build", [["FDLC in 5 Minutes", "/in-5-minutes"], ["Mission Control", "/mission-control"], ["Specification", "/spec"], ["Start", "/start"], ["GitHub", "https://github.com/jaydubya818/MissionControl"]]],
  ["Adopt", [["Maturity", "/maturity"], ["Benchmarks", "/benchmarks"], ["Enterprise", "/enterprise"], ["FDE", "/deploy"]]],
  ["Project", [["About", "/about"], ["Source audit", "https://github.com/jaydubya818/ai-software-factory-mastery"], ["Mission Control status", "https://github.com/jaydubya818/MissionControl/blob/main/docs/product/software-factory-capability-maturity.md"]]],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" href="/" aria-label="FDLC.ai home">
            <Image className="brand-logo" src="/fdlc-logo-updated.png" alt="FDLC.ai — Factory Development Lifecycle" width={2007} height={784} />
          </Link>
          <p>The operating model and technical foundation for trusted autonomous software delivery.</p>
        </div>
        {groups.map(([title, links]) => (
          <nav aria-label={`${title} links`} className="footer-group" key={title}>
            <strong>{title}</strong>
            {links.map(([label, href]) => href.startsWith("/guide")
              ? <a href={href} key={href}>{label}</a>
              : <Link href={href} key={href}>{label}{href.startsWith("http") && <span aria-hidden="true"> ↗</span>}</Link>)}
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
