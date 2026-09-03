import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Enterprise", "Preview the future enterprise governance and control layer for AI software factories.", "/enterprise");

const capabilityGroups = [
  ["Identity + authority", ["Organizational tenancy", "SSO and SCIM", "RBAC and service identities", "Enterprise delegation"]],
  ["Policy + evidence", ["Central policy", "Audit and evidence retention", "Evaluations and analytics", "Approval controls"]],
  ["Execution + operations", ["Execution fleets", "Sandbox management", "Secrets brokering", "Enterprise connectors"]],
  ["Deployment + reliability", ["Deployment options", "Reliability controls", "Operational support", "Governed upgrades"]],
] as const;

export default function EnterprisePage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="FDLC Enterprise / 08" status="Design partner" title="Enterprise governance and control for AI software factories." description="FDLC Enterprise is the future commercial layer for organizations that need shared identity, policy, evidence, execution, and reliability across many factory lines. It is not generally available today." />
    <section className="enterprise-boundary"><strong>Open foundation</strong><p>The Framework, Guide, Manifesto, Specification direction, and Mission Control Community remain the adoption and authority layer.</p><strong>Future commercial layer</strong><p>Organizational capabilities that are expensive to operate reliably at enterprise scale.</p></section>
    <section className="section-block"><SectionHeader eyebrow="Planned capabilities" title="A control plane for the organization—not another agent catalog." /><div className="enterprise-grid">{capabilityGroups.map(([title, items], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")} / Planned</span><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>
    <section className="restrained-cta"><div><p className="section-label">Design partner program</p><h2>Prove the governance problem before scaling the product.</h2></div><div><p>The right first engagement is one bounded factory line with real acceptance criteria, evidence, and measurable human effort—not a platform-wide rollout.</p><Link className="button button-light" href="/deploy">Explore FDLC Deploy</Link></div></section>
  </div></SiteShell>;
}
