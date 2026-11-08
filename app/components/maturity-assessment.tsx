"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { defaultMaturityHandoffs, maturityGapLinks } from "../../data/maturity-actions";
import { maturityDimensions } from "../../data/fdlc";
import { ArtifactExport } from "./artifact-export";
import { assessmentIsComplete, scoreMaturity, type MaturityAnswers } from "../../lib/maturity";
import { formatMaturityMarkdown, parseMaturityAnswers, serializeMaturityAnswers } from "../../lib/maturity-share";

function primaryNextForScore(score: number): readonly [string, string] {
  if (score <= 1) return ["Define one bounded factory line", "/start"];
  if (score === 2) return ["Inspect the required architecture", "/architecture"];
  if (score === 3) return ["Qualify one factory line in the Reference Lab", "/lab"];
  if (score === 4) return ["Establish outcome measures", "/benchmarks"];
  return ["Review continuous improvement practices", "/guide/06-improve/40-governed-learning"];
}

export function MaturityAssessment() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<MaturityAnswers>({});
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const dimension = maturityDimensions[index];

  useEffect(() => {
    const initial = parseMaturityAnswers(window.location.hash || window.location.search);
    if (!assessmentIsComplete(initial)) return;
    /* eslint-disable react-hooks/set-state-in-effect -- restore shared URL results after mount */
    setAnswers(initial);
    setStarted(true);
    setShowResult(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!assessmentIsComplete(answers)) return;
    const next = `${window.location.pathname}#${serializeMaturityAnswers(answers)}`;
    window.history.replaceState(window.history.state, "", next);
  }, [answers]);

  useEffect(() => {
    if (showResult) resultRef.current?.focus();
  }, [showResult]);

  function choose(score: number) {
    setAnswers((current) => ({ ...current, [dimension.id]: score }));
  }

  function reset() {
    setStarted(false);
    setIndex(0);
    setAnswers({});
    setShowResult(false);
    window.history.replaceState(window.history.state, "", window.location.pathname);
  }

  function moveToDimension(next: number) {
    setIndex(next);
    requestAnimationFrame(() => panelRef.current?.focus());
  }

  if (!started) return <section className="assessment-start"><div><p className="section-label">Public self-assessment</p><h2>Eleven dimensions. About five minutes.</h2><p>Answer based on what your organization can demonstrate today—not what is planned. Results stay in this browser session unless you share the URL. They are not uploaded.</p></div><button className="button button-dark" onClick={() => setStarted(true)} type="button">Start assessment</button></section>;

  if (showResult) {
    const result = scoreMaturity(answers);
    const primaryNext = primaryNextForScore(result.score);
    const gapActions = result.gaps.flatMap((gap) => {
      const dimensionId = maturityDimensions.find((item) => item.name === gap)?.id;
      return dimensionId ? maturityGapLinks[dimensionId] ?? [] : [];
    });
    const markdown = formatMaturityMarkdown(result, [primaryNext[0], ...result.gaps.slice(0, 3).map((gap) => `Close the ${gap} gap`)]);
    const artifacts = [{ id: "markdown", label: "Markdown", filename: `fdlc-maturity-l${result.score}.md`, mime: "text/markdown", text: markdown }];
    const actions = defaultMaturityHandoffs.some(([label]) => label === primaryNext[0])
      ? defaultMaturityHandoffs
      : [primaryNext, ...defaultMaturityHandoffs] as const;
    return <section aria-labelledby="maturity-result-title" className="assessment-result" ref={resultRef} tabIndex={-1}>
      <div className="result-level"><span>Current maturity</span><strong>Level {result.score}</strong><h2 id="maturity-result-title">{result.level.name}</h2><p>{result.level.description}</p><p className="maturity-disclaimer" role="note"><strong>Not certification.</strong> This is an educational diagnostic of what your answers show today.</p></div>
      <div className="result-detail">
        <article><span>What this means</span><p>Your current operating model is {result.level.operatingModel.toLowerCase()}. The score reflects what your answers show today, not planned capability.</p></article>
        <article><span>Strongest dimensions</span><p>{result.strengths.length ? result.strengths.join(" · ") : "No dimension is consistently verified yet."}</p></article>
        <article><span>Priority gaps</span><p>{result.gaps.join(" · ")}</p></article>
        <article className="result-next"><span>Recommended next action</span><p>{result.level.nextMove}</p></article>
        <article className="maturity-gap-links"><span>Close specific gaps</span><ul>{gapActions.slice(0, 6).map(([label, href]) => <li key={`${label}-${href}`}>{href.startsWith("/guide") ? <a href={href}>{label}</a> : <Link href={href}>{label}</Link>}</li>)}</ul></article>
        <nav className="maturity-result-actions" aria-label="Next steps from this maturity result">{actions.map(([label, href], index) => {
          const className = index === 0 ? "button button-light" : undefined;
          return href.startsWith("/guide") ? <a className={className} href={href} key={href}>{label}</a> : <Link className={className} href={href} key={href}>{label}</Link>;
        })}</nav>
        <ArtifactExport artifacts={artifacts} copyLabel="Copy Markdown" downloadLabel="Download Markdown" />
        <button className="button button-light" onClick={reset} type="button">Retake assessment</button>
      </div>
    </section>;
  }

  const selected = answers[dimension.id];
  const canFinish = assessmentIsComplete(answers);
  return <section aria-label={`Maturity assessment, dimension ${index + 1} of ${maturityDimensions.length}`} className="assessment-panel" ref={panelRef} tabIndex={-1}>
    <div className="assessment-progress"><span>Dimension {index + 1} of {maturityDimensions.length}</span><div aria-hidden="true"><i style={{ width: `${((index + 1) / maturityDimensions.length) * 100}%` }} /></div><strong>{dimension.name}</strong></div>
    <fieldset><legend>{dimension.question}</legend><div className="assessment-options">{dimension.options.map((option) => <label className={selected === option.score ? "is-selected" : ""} key={option.score}><input checked={selected === option.score} name={dimension.id} onChange={() => choose(option.score)} type="radio" value={option.score} /><span>L{option.score}</span><strong>{option.label}</strong></label>)}</div></fieldset>
    <p className={`assessment-validation${Number.isFinite(selected) ? " is-valid" : ""}`} aria-live="polite">{Number.isFinite(selected) ? "Response recorded. You can continue." : "Choose the statement that best describes what you can demonstrate today."}</p>
    <div className="assessment-actions"><button className="button button-light" disabled={index === 0} onClick={() => moveToDimension(index - 1)} type="button">Previous</button>{index < maturityDimensions.length - 1 ? <button className="button button-dark" disabled={!Number.isFinite(selected)} onClick={() => moveToDimension(index + 1)} type="button">Next dimension</button> : <button className="button button-dark" disabled={!canFinish} onClick={() => setShowResult(true)} type="button">View result</button>}</div>
  </section>;
}
