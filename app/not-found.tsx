import Link from "next/link";
/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the independently deployed MFE boundary. */
import { SiteShell } from "./components/site-shell";

export default function NotFound() {
  return <SiteShell><section className="not-found"><p className="section-label">404 / Page not found</p><h1>That page isn’t here.</h1><p>The address may have changed. Start with the framework, browse the guide, or search for the topic you need.</p><div className="hero-actions"><Link className="button button-dark" href="/">FDLC home</Link><Link className="button button-light" href="/framework">Explore the Framework</Link><a className="button button-light" href="/guide">Browse the Guide</a><a className="text-action" href="/guide/search">Search the Guide →</a></div></section></SiteShell>;
}
