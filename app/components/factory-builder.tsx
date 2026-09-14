"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { factoryDefinitionBridge, factoryDefinitionNextSteps } from "../../data/maturity-actions";
import { ArtifactExport } from "./artifact-export";
import { factoryFormErrors, formatFactoryDefinitionJson, formatFactoryDefinitionMarkdown, formatFactoryDefinitionYaml, generateFactoryDefinition, type FactoryForm } from "../../lib/factory-definition";

const workTypes = ["Dependency upgrade", "Vulnerability remediation", "Test repair", "API migration", "Feature implementation", "Documentation update"];
const authorityOptions = ["Read repositories", "Create branches", "Modify code", "Run tests", "Open pull requests", "Deploy software"];
const verificationOptions = ["Automated tests", "Compilation", "Type checking", "Linting", "Security scanning", "Policy checks", "Schema validation"];
const humanOptions = ["Approve the plan", "Review security boundaries", "Approve architecture changes", "Approve merge", "Approve production deployment"];
const draftKey = "fdlc.factory-definition.draft.v1";

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

type DraftState = { step: number; form: FactoryForm; submitted: boolean };

function toggle(values: string[], value: string) { return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]; }
function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

function readDraft(): DraftState | null {
  try {
    const raw = sessionStorage.getItem(draftKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftState;
    if (!parsed.form || typeof parsed.step !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function FactoryBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FactoryForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const stepRef = useRef<HTMLElement>(null);
  const errors = useMemo(() => factoryFormErrors(form), [form]);
  const definition = submitted ? generateFactoryDefinition(form) : null;
  const slug = slugify(definition?.intent.workType ?? "factory");
  const artifacts = definition ? [
    { id: "markdown", label: "Markdown", filename: `${slug}-factory-definition.md`, mime: "text/markdown", text: formatFactoryDefinitionMarkdown(definition) },
    { id: "json", label: "JSON", filename: `${slug}-factory-definition.json`, mime: "application/json", text: formatFactoryDefinitionJson(definition) },
    { id: "yaml", label: "YAML", filename: `${slug}-factory-definition.yaml`, mime: "text/yaml", text: formatFactoryDefinitionYaml(definition) },
  ] : [];

  useEffect(() => {
    const draft = readDraft();
    /* eslint-disable react-hooks/set-state-in-effect -- restore sessionStorage draft after mount */
    if (draft) {
      setStep(Math.max(0, Math.min(4, draft.step)));
      setForm({ ...initialForm, ...draft.form });
      setSubmitted(Boolean(draft.submitted));
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(draftKey, JSON.stringify({ step, form, submitted } satisfies DraftState));
  }, [form, hydrated, step, submitted]);

  useEffect(() => {
    if (submitted) resultRef.current?.focus();
  }, [submitted]);

  function restart() {
    setStep(0);
    setForm(initialForm);
    setSubmitted(false);
    sessionStorage.removeItem(draftKey);
  }
  function setList(key: "authority" | "verification" | "humanControls", label: string) {
    const value = canonicalValue[label] ?? label;
    setForm((current) => ({ ...current, [key]: toggle(current[key], value) }));
  }
  function moveToStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => stepRef.current?.focus());
  }

  if (definition) {
    return <section className="factory-result" aria-labelledby="factory-result-title" ref={resultRef} tabIndex={-1}>
      <header><div><p className="section-label">Factory Definition / v{definition.version}</p><h2 id="factory-result-title">{definition.intent.workType}</h2></div><button className="button button-light" onClick={restart} type="button">Start over</button></header>
      <p className="factory-result-success" role="status">Your conceptual Factory Definition is ready. Copy or download Markdown, JSON, or YAML to keep the result.</p>
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
      <aside className="callout"><strong>Conceptual output</strong><p>This teaches the FDLC mental model. It is not an executable Mission Control manifest or a formal FDLC Specification document. {factoryDefinitionBridge.definition} {factoryDefinitionBridge.version} {factoryDefinitionBridge.boundary}</p></aside>
      <ArtifactExport artifacts={artifacts} copyLabel="Copy Factory Definition" downloadLabel="Download Factory Definition" />
      <nav className="factory-result-actions" aria-label="Continue from Factory Definition">
        {factoryDefinitionNextSteps.map(([href, label]) => href.startsWith("/guide")
          ? <a className="button button-light" href={href} key={href}>{label}</a>
          : <Link className="button button-light" href={href} key={href}>{label}</Link>)}
      </nav>
    </section>;
  }

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
