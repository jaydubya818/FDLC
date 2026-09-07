import Link from "next/link";
import Image from "next/image";

import { footerGroups } from "../../lib/global-navigation";

export function SiteFooter() {
  return (
    <footer className="global-footer">
      <div className="global-footer-inner">
        <div className="global-footer-brand">
          <Link className="global-logo" href="/" aria-label="FDLC.ai home">
            <Image className="brand-logo" src="/fdlc-logo-transparent.png" alt="FDLC.ai — Factory Development Lifecycle" width={2007} height={784} />
          </Link>
          <p>The operating model and technical foundation for trusted autonomous software delivery.</p>
        </div>
        {footerGroups.map(([title, links]) => (
          <nav aria-label={`${title} links`} className="global-footer-group" key={title}>
            <strong>{title}</strong>
            {links.map(([label, href]) => href.startsWith("/guide")
              ? <a href={href} key={href}>{label}</a>
              : <Link href={href} key={href}>{label}{href.startsWith("http") && <span aria-hidden="true"> ↗</span>}</Link>)}
          </nav>
        ))}
      </div>
      <div className="global-footer-base">
        <span>© 2026 FDLC.ai</span>
        <span>Factory Development Lifecycle</span>
        <span>Open framework · Working reference · Governed autonomy</span>
      </div>
    </footer>
  );
}
