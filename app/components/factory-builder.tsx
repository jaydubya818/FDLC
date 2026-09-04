"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { factoryFormErrors, generateFactoryDefinition, type FactoryForm } from "../../lib/factory-definition";

const workTypes = ["Dependency upgrade", "Vulnerability remediation", "Test repair", "API migration", "Feature implementation", "Documentation update"];
const authorityOptions = ["Repository read", "Branch creation", "Code modification", "Test execution", "Pull request creation", "Deployment"];
const verificationOptions = ["Tests", "Compile", "Type checking", "Lint", "Security scanning", "Policy checks", "Schema validation"];
const humanOptions = ["Plan approval", "Security boundary", "Architecture change", "Merge", "Production deployment"];

const initialForm: FactoryForm = { workType: "", outcome: "", criteria: "", authority: [], verification: [], humanControls: [] };

function toggle(values: string[], value: string) { return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]; }

export function FactoryBuilder() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FactoryForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const errors = useMemo(() => factoryFormErrors(form), [form]);
  const definition = submitted ? generateFactoryDefinition(form) : null;

  function restart() { setStep(0); setForm(initialForm); setSubmitted(false); }
  function setList(key: "authority" | "verification" | "humanControls", value: string) { setForm((current) => ({ ...current, [key]: toggle(current[key], value) })); }

  if (definition) return <section className="factory-result" aria-live="polite">
    <header><div><p className="section-label">Factory Definition / v{definition.version}</p><h2>{definition.intent.workType}</h2></div><button className="button button-light" onClick={restart} type="button">Start over</button></header>
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
    <nav className="factory-result-actions" aria-label="Continue from Factory Definition"><Link className="button button-dark" href="/mission-control#quickstart">Run Mission Control</Link><Link className="button button-light" href="/specification">Review the proposed Specification</Link></nav>
  </section>;

  const panels = [
    <div className="builder-question" key="outcome"><label htmlFor="work-type">What engineering outcome are you trying to produce?</label><p>Choose a bounded class, then state the concrete result.</p><select id="work-type" onChange={(event) => setForm((current) => ({ ...current, workType: event.target.value }))} value={form.workType}><option value="">Choose a work type</option>{workTypes.map((item) => <option key={item}>{item}</option>)}</select><label className="sub-label" htmlFor="outcome">Outcome</label><textarea id="outcome" onChange={(event) => setForm((current) => ({ ...current, outcome: event.target.value }))} placeholder="Upgrade the payments SDK across three services without changing public API behavior." rows={4} value={form.outcome} /></div>,
    <div className="builder-question" key="criteria"><label htmlFor="criteria">What proves the work succeeded?</label><p>Add one acceptance criterion per line. Prefer observable outcomes over implementation instructions.</p><textarea id="criteria" onChange={(event) => setForm((current) => ({ ...current, criteria: event.target.value }))} placeholder={"All existing contract tests pass\nNo deprecated SDK imports remain\nThe rollback path is documented"} rows={7} value={form.criteria} /></div>,
    <Checklist key="authority" legend="What authority does execution require?" options={authorityOptions} selected={form.authority} onToggle={(value) => setList("authority", value)} />,
    <Checklist key="verification" legend="What can be verified deterministically?" options={verificationOptions} selected={form.verification} onToggle={(value) => setList("verification", value)} />,
    <Checklist key="human" legend="Where is human judgment required?" options={humanOptions} selected={form.humanControls} onToggle={(value) => setList("humanControls", value)} />,
  ];

  const stepValid = [form.workType && form.outcome.trim().length >= 12, form.criteria.trim().length > 0, form.authority.length > 0, form.verification.length > 0, form.humanControls.length > 0][step];
  return <section className="factory-builder" id="factory-builder">
    <div className="builder-progress"><span>Step {step + 1} of 5</span><div aria-hidden="true"><i style={{ width: `${((step + 1) / 5) * 100}%` }} /></div></div>
    {panels[step]}
    <div className="builder-actions"><button className="button button-light" disabled={step === 0} onClick={() => setStep((value) => value - 1)} type="button">Previous</button>{step < 4 ? <button className="button button-dark" disabled={!stepValid} onClick={() => setStep((value) => value + 1)} type="button">Continue</button> : <button className="button button-dark" disabled={errors.length > 0} onClick={() => setSubmitted(true)} type="button">Generate Factory Definition</button>}</div>
  </section>;
}

function Checklist({ legend, options, selected, onToggle }: { legend: string; options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <fieldset className="builder-checklist"><legend>{legend}</legend><p>Select every boundary that applies.</p><div>{options.map((option) => <label className={selected.includes(option) ? "is-selected" : ""} key={option}><input checked={selected.includes(option)} onChange={() => onToggle(option)} type="checkbox" /><span aria-hidden="true">{selected.includes(option) ? "✓" : "+"}</span><strong>{option}</strong></label>)}</div></fieldset>;
}
