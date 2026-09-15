/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */
import { guideDiscovery, type GuideDiscoveryPage } from "../../data/guide-discovery";

export function GuideReading({ page }: { page: GuideDiscoveryPage }) {
  const links = guideDiscovery[page];
  return (
    <aside aria-label="Read in the Guide" className="guide-reading">
      <p className="section-label">Read in the Guide</p>
      <ul>
        {links.map(([label, href]) => <li key={href}><a href={href}>{label} →</a></li>)}
      </ul>
      <a className="guide-reading-search" href="/guide/search">Search the Guide →</a>
    </aside>
  );
}
