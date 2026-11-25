import { FactoryHandoffDiagram } from "../components/factory-handoff-diagram";
import type { Metadata } from "next";
import Link from "next/link";
import { FactoryBuilder } from "../components/factory-builder";
import { NextSteps } from "../components/next-steps";
import { SiteShell } from "../components/site-shell";
import { pageHandoffs } from "../../data/page-handoffs";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Define Your First Factory Line", "Turn one engineering outcome into a reviewable FDLC Factory Definition.", "/start");

export default function StartPage() {
  return <SiteShell><div className="page-wrap start-page">
    <header className="builder-intro">
      <div>
        <p className="section-label">Your path · step 3 of 4 · Define</p>
        <h1>Define your first factory line.</h1>
        <p className="builder-intro-lede">Write a Factory Definition for one engineering outcome. Decide what the factory may do, how to verify its work, and where a person must approve it.</p>
        <div className="hero-actions"><a className="button button-dark" href="#factory-builder">Start the builder</a><Link className="text-action" href="/in-5-minutes">See a completed example →</Link></div>
      </div>
      <aside aria-label="Before you begin">
        <h2>Before you begin</h2>
        <p>Bring one outcome and a way to tell whether the work succeeded.</p>
        <dl>
          <div><dt>Time</dt><dd>Five steps · about 10 minutes for a first draft</dd></div>
          <div><dt>Output</dt><dd>A reviewable definition you can download</dd></div>
          <div><dt>Privacy</dt><dd>Your draft stays in this browser tab</dd></div>
        </dl>
      </aside>
    </header>
    <FactoryBuilder />
    <FactoryHandoffDiagram builder />
    <NextSteps {...pageHandoffs.start} />
  </div></SiteShell>;
}
