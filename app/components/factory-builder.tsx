"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { factoryFormErrors, formatFactoryDefinitionMarkdown, generateFactoryDefinition, type FactoryForm } from "../../lib/factory-definition";

const workTypes = ["Dependency upgrade", "Vulnerability remediation", "Test repair", "API migration", "Feature implementation", "Documentation update"];
const authorityOptions = ["Read repositories", "Create branches", "Modify code", "Run tests", "Open pull requests", "Deploy software"];
const verificationOptions = ["Automated tests", "Compilation", "Type checking", "Linting", "Security scanning", "Policy checks", "Schema validation"];
const humanOptions = ["Approve the plan", "Review security boundaries", "Approve architecture changes", "Approve merge", "Approve production deployment"];

const canonicalValue: Record<string, string> = {
  "Read repositories": "Repository read",
  "Create branches": "Branch creation",
  "Modify code": "Code modification",
  "Run tests": "Test execution",
  "Open pull requests": "Pull request creation",
  "Deploy software": "Deployment",
  "Automated tests": "Tests",
  Compilation: "Compile",
  Linting: "Lint",
  "Approve the plan": "Plan approval",
  "Review security boundaries": "Security boundary",
  "Approve architecture changes": "Architecture change",
  "Approve merge": "Merge",
  "Approve production deployment": "Production deployment",
};

const initialForm: FactoryForm = { workType: "", outcome: "", criteria: "", authority: [], verification: [], humanControls: [] };

function toggle(values: string[], value: string) { return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]; }
function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

export function FactoryBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FactoryForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const resultRef = useRef<HTMLElement>(null);
  const stepRef = useRef<HTMLElement>(null);
  const errors = useMemo(() => factoryFormErrors(form), [form]);
  const definition = submitted ? generateFactoryDefinition(form) : null;
  const markdown = definition ? formatFactoryDefinitionMarkdown(definition) : "";

  useEffect(() => {
    if (submitted) resultRef.current?.focus();
  }, [submitted]);

  function restart() { setStep(0); setForm(initialForm); setSubmitted(false); setCopyStatus("idle"); }
  function setList(key: "authority" | "verification" | "humanControls", label: string) {
    const value = canonicalValue[label] ?? label;
    setForm((current) => ({ ...current, [key]: toggle(current[key], value) }));
  }
  function moveToStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => stepRef.current?.focus());
  }
  async function copyDefinition() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
      requestAnimationFrame(() => document.querySelector<HTMLTextAreaElement>("#factory-definition-markdown")?.focus());
    }
  }
  function downloadDefinition() {
    const blobUrl = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${slugify(definition?.intent.workType ?? "factory")}-factory-definition.md`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
  }

  if (definition) return <section className="factory-result" aria-labelledby="factory-result-title" ref={resultRef} tabIndex={-1}>
    <header><div><p className="section-label">Factory Definition / v{definition.version}</p><h2 id="factory-result-title">{definition.intent.workType}</h2></div><button className="button button-light" onClick={restart} type="button">Start over</button></header>
    <p className="factory-result-success" role="status">Your conceptual Factory Definition is ready. Copy or download it to keep the result.</p>
    <div className="factory-result-grid">
      <article className="factory-goal"><span>Intent</span><p>{definition.intent.outcome}</p></article>
      <article><span>Acceptance criteria</span><ul>{definition.acceptanceCriteria.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Plan boundaries</span><ul>{definition.planBoundaries.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Candidate Work Orders</span><ol>{definition.candidateWorkOrders.map((item) => <li key={item.name}><strong>{item.name}</strong><small>{item.outcome}</small></li>)}</ol></article>
      <article><span>Required capabilities</span><ul>{definition.requiredCapabilities.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Delegated authority</span><ul>{definition.authority.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Verification contract</span><ul>{definition.verificationContract.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Human controls</span><ul>{definition.humanControls.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Outcome metrics</span><ul>{definition.outcomeMetrics.map((item) => <li key={item}>{item}</li>)}</ul></article>
    </div>
    <aside className="callout"><strong>Conceptual output</strong><p>This teaches the FDLC mental model. It is not an executable Mission Control manifest or a formal FDLC Specification document.</p></aside>
    <div className="factory-export-actions" aria-label="Keep this Factory Definition">
      <button className="button button-dark" onClick={copyDefinition} type="button">Copy Factory Definition</button>
      <button className="button button-light" onClick={downloadDefinition} type="button">Download Factory Definition</button>
      <span aria-live="polite">{copyStatus === "copied" ? "Copied to your clipboard." : copyStatus === "error" ? "Clipboard access was unavailable. The reusable Markdown below is selected for you." : ""}</span>
    </div>
    <details className="factory-markdown"><summary>View reusable Markdown</summary><textarea aria-label="Factory Definition Markdown" id="factory-definition-markdown" readOnly rows={18} value={markdown} /></details>
    <nav className="factory-result-actions" aria-label="Continue from Factory Definition"><Link className="button button-dark" href="/mission-control#quickstart">Run Mission Control</Link><Link className="button button-light" href="/in-5-minutes">View the dependency example</Link><Link className="text-action" href="/spec">Review the proposed Specification →</Link></nav>
  </section>;

  const panels = [
    <div className="builder-question" key="outcome"><label htmlFor="work-type">What engineering outcome are you trying to produce?</label><p>Choose a bounded class, then state the concrete result.</p><select id="work-type" onChange={(event) => setForm((current) => ({ ...current, workType: event.target.value }))} value={form.workType}><option value="">Choose a work type</option>{workTypes.map((item) => <option key={item}>{item}</option>)}</select><label className="sub-label" htmlFor="outcome">Describe the outcome</label><textarea id="outcome" onChange={(event) => setForm((current) => ({ ...current, outcome: event.target.value }))} placeholder="Upgrade the payments SDK across three services without changing public API behavior." rows={4} value={form.outcome} /></div>,
    <div className="builder-question" key="criteria"><label htmlFor="criteria">What proves the work succeeded?</label><p>Add one acceptance criterion per line. Prefer observable outcomes over implementation instructions.</p><textarea id="criteria" onChange={(event) => setForm((current) => ({ ...current, criteria: event.target.value }))} placeholder={"All existing contract tests pass\nNo deprecated SDK imports remain\nThe rollback path is documented"} rows={7} value={form.criteria} /></div>,
    <Checklist key="authority" legend="What may the factory do?" options={authorityOptions} selected={form.authority} onToggle={(value) => setList("authority", value)} />,
    <Checklist key="verification" legend="Which checks can prove the result?" options={verificationOptions} selected={form.verification} onToggle={(value) => setList("verification", value)} />,
    <Checklist key="human" legend="Which decisions still require a person?" options={humanOptions} selected={form.humanControls} onToggle={(value) => setList("humanControls", value)} />,
  ];

  const stepErrors = [
    errors.filter((error) => error.includes("work type") || error.includes("engineering outcome")),
    errors.filter((error) => error.includes("acceptance")),
    errors.filter((error) => error.includes("authority")),
    errors.filter((error) => error.includes("verification")),
    errors.filter((error) => error.includes("human")),
  ][step];
  const stepValid = stepErrors.length === 0;
  return <section aria-label={`Factory Definition builder, step ${step + 1} of 5`} className="factory-builder" id="factory-builder" ref={stepRef} tabIndex={-1}>
    <div className="builder-progress"><span>Step {step + 1} of 5</span><div aria-hidden="true"><i style={{ width: `${((step + 1) / 5) * 100}%` }} /></div></div>
    {panels[step]}
    <div className={`builder-validation${stepValid ? " is-valid" : ""}`} aria-live="polite"><strong>{stepValid ? "Ready to continue" : "Required before continuing"}</strong>{stepErrors.length > 0 && <ul>{stepErrors.map((error) => <li key={error}>{error}</li>)}</ul>}</div>
    <div className="builder-actions"><button className="button button-light" disabled={step === 0} onClick={() => moveToStep(step - 1)} type="button">Previous</button>{step < 4 ? <button className="button button-dark" disabled={!stepValid} onClick={() => moveToStep(step + 1)} type="button">Continue</button> : <button className="button button-dark" disabled={!stepValid} onClick={() => setSubmitted(true)} type="button">Generate Factory Definition</button>}</div>
  </section>;
}

function Checklist({ legend, options, selected, onToggle }: { legend: string; options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <fieldset className="builder-checklist"><legend>{legend}</legend><p>Select every boundary that applies. FDLC records these as explicit authority, verification, or human-control constraints.</p><div>{options.map((option) => { const value = canonicalValue[option] ?? option; return <label className={selected.includes(value) ? "is-selected" : ""} key={option}><input checked={selected.includes(value)} onChange={() => onToggle(option)} type="checkbox" /><span aria-hidden="true">{selected.includes(value) ? "✓" : "+"}</span><strong>{option}</strong></label>; })}</div></fieldset>;
}
