"use client";

import Link from "next/link";
/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the independently deployed MFE boundary. */
import { SiteShell } from "./components/site-shell";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <SiteShell><section className="not-found"><p className="section-label">Unable to load this page</p><h1>Let’s try that again.</h1><p>The page could not finish loading. Try again, or continue from the FDLC home page.</p><div className="hero-actions"><button type="button" className="button button-dark" onClick={reset}>Try again</button><Link className="button button-light" href="/">FDLC home</Link><a className="text-action" href="/guide/search">Search the Guide →</a></div></section></SiteShell>;
}
