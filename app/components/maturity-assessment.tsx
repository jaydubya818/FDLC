"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { maturityDimensions } from "../../data/fdlc";
import { assessmentIsComplete, scoreMaturity, type MaturityAnswers } from "../../lib/maturity";

export function MaturityAssessment() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<MaturityAnswers>({});
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const dimension = maturityDimensions[index];

  useEffect(() => {
    if (showResult) resultRef.current?.focus();
  }, [showResult]);

  function choose(score: number) {
    setAnswers((current) => ({ ...current, [dimension.id]: score }));
  }

  function reset() {
    setStarted(false); setIndex(0); setAnswers({}); setShowResult(false);
  }

  function moveToDimension(next: number) {
    setIndex(next);
    requestAnimationFrame(() => panelRef.current?.focus());
  }

  if (!started) return <section className="assessment-start"><div><p className="section-label">Public self-assessment</p><h2>Eleven dimensions. About five minutes.</h2><p>Answer based on what your organization can demonstrate today—not what is planned. Results stay in this browser session and are not uploaded.</p></div><button className="button button-dark" onClick={() => setStarted(true)} type="button">Start assessment</button></section>;

  if (showResult) {
    const result = scoreMaturity(answers);
    const primaryNext: readonly [string, string] = result.score <= 1
      ? ["Define one bounded factory line", "/start"]
      : result.score === 2
        ? ["Inspect the required architecture", "/architecture"]
        : result.score === 3
          ? ["See the operating model in Mission Control", "/mission-control"]
          : result.score === 4
            ? ["Establish outcome measures", "/benchmarks"]
            : ["Review continuous improvement practices", "/guide/improve"];
    const primaryAction = primaryNext[1].startsWith("/guide")
      ? <a className="button button-light" href={primaryNext[1]}>{primaryNext[0]}</a>
      : <Link className="button button-light" href={primaryNext[1]}>{primaryNext[0]}</Link>;
    return <section aria-labelledby="maturity-result-title" className="assessment-result" ref={resultRef} tabIndex={-1}><div className="result-level"><span>Current maturity</span><strong>Level {result.score}</strong><h2 id="maturity-result-title">{result.level.name}</h2><p>{result.level.description}</p></div><div className="result-detail"><article><span>What this means</span><p>Your current operating model is {result.level.operatingModel.toLowerCase()}. The score reflects what your answers show today, not planned capability.</p></article><article><span>Strongest dimensions</span><p>{result.strengths.length ? result.strengths.join(" · ") : "No dimension is consistently verified yet."}</p></article><article><span>Priority gaps</span><p>{result.gaps.join(" · ")}</p></article><article className="result-next"><span>Recommended next action</span><p>{result.level.nextMove}</p></article><nav className="maturity-result-actions" aria-label="Next steps from this maturity result">{primaryAction}<a href="/guide">Use the Guide</a><Link href="/deploy">Explore FDE</Link></nav><button className="button button-light" onClick={reset} type="button">Retake assessment</button></div></section>;
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
