import Link from "next/link";

const primary = [
  ["Framework", "/framework"],
  ["Architecture", "/architecture"],
  ["Guide", "/guide"],
  ["Mission Control", "/mission-control"],
  ["Maturity", "/maturity"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="FDLC.ai home">
          <span aria-hidden="true" className="wordmark-mark">F</span>
          <span>FDLC<span className="wordmark-dot">.ai</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          <details className="more-menu">
            <summary>More <span aria-hidden="true">⌄</span></summary>
            <div>
              <Link href="/in-5-minutes">FDLC in 5 Minutes</Link>
              <Link href="/manifesto">Manifesto</Link>
              <Link href="/spec">Specification</Link>
              <Link href="/benchmarks">Benchmarks</Link>
              <Link href="/start">Start</Link>
              <Link href="/enterprise">Enterprise</Link>
              <Link href="/deploy">Deploy</Link>
              <Link href="/about">About</Link>
            </div>
          </details>
        </nav>
        <a className="header-github" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">GitHub <span aria-hidden="true">↗</span></a>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <Link href="/in-5-minutes">FDLC in 5 Minutes</Link>
            <Link href="/manifesto">Manifesto</Link>
            <Link href="/spec">Specification</Link>
            <Link href="/benchmarks">Benchmarks</Link>
            <Link href="/start">Start</Link>
            <Link href="/enterprise">Enterprise</Link>
            <Link href="/deploy">Deploy</Link>
            <Link href="/about">About</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
