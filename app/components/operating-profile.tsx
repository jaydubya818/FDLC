"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the microfrontend boundary. */

import { useState } from "react";
import { ArtifactExport } from "./artifact-export";
import { generateOperatingProfile, initialOperatingProfile, operatingProfileErrors, type OperatingProfileForm } from "../../lib/factory-operating-profile";
import "./operating-profile.css";

export function OperatingProfile() {
  const [form, setForm] = useState<OperatingProfileForm>(initialOperatingProfile);
  const [showResult, setShowResult] = useState(false);
  const errors = operatingProfileErrors(form);
  const profile = showResult && errors.length === 0 ? generateOperatingProfile(form) : null;

  function update<K extends keyof OperatingProfileForm>(key: K, value: OperatingProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setShowResult(false);
  }

  return <section className="operating-profile" id="operating-profile" aria-labelledby="operating-profile-title">
    <header><p className="section-label">Optional companion / recurring work</p><h2 id="operating-profile-title">Plan how the factory will operate.</h2><p>A Factory Definition describes the work and its boundaries. Add an operating profile to name the owner, intake, shared limits and review target. This separate design draft leaves the canonical v0.2 definition unchanged.</p></header>
    <details>
      <summary>Draft an operating profile</summary>
      <p className="operating-profile-note">The numbers below are editable teaching defaults. Exporting this profile creates a planning artifact; it does not schedule a job, run an agent or authorize a deployment. Profile inputs stay in this page until you copy or download them.</p>
      <form onSubmit={(event) => { event.preventDefault(); setShowResult(true); }}>
        <div className="operating-profile-grid">
          <label htmlFor="profile-definition">Factory Definition reference<input id="profile-definition" value={form.definitionRef} onChange={(event) => update("definitionRef", event.target.value)} placeholder="api-repair / revision 1" required /></label>
          <label htmlFor="profile-owner">Accountable operator or team<input id="profile-owner" value={form.owner} onChange={(event) => update("owner", event.target.value)} placeholder="API quality team" required /></label>
          <label htmlFor="profile-trigger">Intake trigger<select id="profile-trigger" value={form.trigger} onChange={(event) => update("trigger", event.target.value as OperatingProfileForm["trigger"])}><option value="event">Event</option><option value="schedule">Schedule</option><option value="manual">Manual intake</option></select></label>
          <label htmlFor="profile-source">Eligible intake source and scope<input id="profile-source" value={form.intakeSource} onChange={(event) => update("intakeSource", event.target.value)} placeholder="Failed API checks in the approved repository" required /></label>
          {form.trigger === "schedule" && <>
            <label htmlFor="profile-schedule">Schedule intent<input id="profile-schedule" value={form.schedule} onChange={(event) => update("schedule", event.target.value)} required /><small>Describe the cadence. Your runtime must validate its scheduler syntax.</small></label>
            <label htmlFor="profile-timezone">IANA time zone<input id="profile-timezone" value={form.timezone} onChange={(event) => update("timezone", event.target.value)} placeholder="America/Chicago" required /></label>
          </>}
        </div>
        <fieldset><legend>Limits shared by the WorkOrder and its delegated work</legend><p>Count failed attempts, verification and reconciliation. A subagent consumes the parent budget.</p>
          <div className="operating-profile-grid operating-profile-bounds">
            <label htmlFor="profile-attempts">Maximum attempts<input id="profile-attempts" type="number" min="1" step="1" value={form.maxAttempts} onChange={(event) => update("maxAttempts", event.target.value)} required /></label>
            <label htmlFor="profile-minutes">Active elapsed minutes<input id="profile-minutes" type="number" min="0" step="any" value={form.maxElapsedMinutes} onChange={(event) => update("maxElapsedMinutes", event.target.value)} required /><small>Shared wall clock for active work; human review wait is measured separately.</small></label>
            <label htmlFor="profile-spend">Spend limit (USD)<input id="profile-spend" type="number" min="0" step="any" value={form.maxCostUsd} onChange={(event) => update("maxCostUsd", event.target.value)} required /></label>
            <label htmlFor="profile-concurrent">Concurrent attempts<input id="profile-concurrent" type="number" min="1" step="1" value={form.maxConcurrentAttempts} onChange={(event) => update("maxConcurrentAttempts", event.target.value)} required /><small>Only independent Tasks with disjoint write and effect targets may overlap.</small></label>
          </div>
        </fieldset>
        <label className="operating-profile-review" htmlFor="profile-review">Review target (hours)<input id="profile-review" type="number" min="0" step="any" value={form.reviewWithinHours} onChange={(event) => update("reviewWithinHours", event.target.value)} required /><small>When review is overdue, the factory holds at the decision boundary.</small></label>
        <div className="operating-profile-contract"><h3>Included operating rules</h3><ul><li>Duplicate intake keeps the same WorkOrder; repeated attempts keep the same effect identity.</li><li>Unknown effects wait for reconciliation. New candidates require fresh verification and decisions.</li><li>Exhausted budgets stop new work. Cancellation reaches delegated attempts.</li><li>Record the full workload cohort, human attention and observed outcomes.</li></ul></div>
        <div className="builder-validation" aria-live="polite">{errors.length > 0 ? <><strong>Complete the profile</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></> : <strong>Ready to export a design draft.</strong>}</div>
        <button className="button button-dark" type="submit" disabled={errors.length > 0}>Generate operating profile</button>
      </form>
      {profile && <div className="operating-profile-result"><p role="status">Your operating profile draft is ready. Review and implement these rules in your chosen runtime before qualification.</p><ArtifactExport artifacts={[{ id: "operating-json", label: "Operating profile JSON", filename: "factory-operating-profile-draft.json", mime: "application/json", text: `${JSON.stringify(profile, null, 2)}\n` }]} copyLabel="Copy operating profile" downloadLabel="Download operating profile" /></div>}
    </details>
    <p className="operating-profile-links"><a href="/lab#operate-a-small-factory">Exercise the operating boundary locally →</a><a href="/guide/appendix/engineering-experience#operate-a-small-factory">Read the operating playbook →</a></p>
  </section>;
}
