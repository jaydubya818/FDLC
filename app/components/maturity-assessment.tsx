"use client";

import { useState } from "react";
import { maturityDimensions } from "../../data/fdlc";
import { assessmentIsComplete, scoreMaturity, type MaturityAnswers } from "../../lib/maturity";

export function MaturityAssessment() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<MaturityAnswers>({});
  const [showResult, setShowResult] = useState(false);
  const dimension = maturityDimensions[index];

  function choose(score: number) {
    setAnswers((current) => ({ ...current, [dimension.id]: score }));
  }

  function reset() {
    setStarted(false); setIndex(0); setAnswers({}); setShowResult(false);
  }

  if (!started) return <section className="assessment-start"><div><p className="section-label">Public self-assessment</p><h2>Eleven dimensions. About five minutes.</h2><p>Answer based on what your organization can demonstrate today—not what is planned. Results stay in this browser session and are not uploaded.</p></div><button className="button button-dark" onClick={() => setStarted(true)} type="button">Start assessment</button></section>;

  if (showResult) {
    const result = scoreMaturity(answers);
    return <section className="assessment-result" aria-live="polite"><div className="result-level"><span>Current maturity</span><strong>Level {result.score}</strong><h2>{result.level.name}</h2><p>{result.level.description}</p></div><div className="result-detail"><article><span>Operating model</span><p>{result.level.operatingModel}</p></article><article><span>Strongest dimensions</span><p>{result.strengths.length ? result.strengths.join(" · ") : "No dimension is consistently verified yet."}</p></article><article><span>Priority gaps</span><p>{result.gaps.join(" · ")}</p></article><article className="result-next"><span>Recommended next action</span><p>{result.level.nextMove}</p></article><button className="button button-light" onClick={reset} type="button">Retake assessment</button></div></section>;
  }

  const selected = answers[dimension.id];
  const canFinish = assessmentIsComplete(answers);
  return <section className="assessment-panel">
    <div className="assessment-progress"><span>Dimension {index + 1} of {maturityDimensions.length}</span><div aria-hidden="true"><i style={{ width: `${((index + 1) / maturityDimensions.length) * 100}%` }} /></div><strong>{dimension.name}</strong></div>
    <fieldset><legend>{dimension.question}</legend><div className="assessment-options">{dimension.options.map((option) => <label className={selected === option.score ? "is-selected" : ""} key={option.score}><input checked={selected === option.score} name={dimension.id} onChange={() => choose(option.score)} type="radio" value={option.score} /><span>L{option.score}</span><strong>{option.label}</strong></label>)}</div></fieldset>
    <div className="assessment-actions"><button className="button button-light" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} type="button">Previous</button>{index < maturityDimensions.length - 1 ? <button className="button button-dark" disabled={!Number.isFinite(selected)} onClick={() => setIndex((value) => value + 1)} type="button">Next dimension</button> : <button className="button button-dark" disabled={!canFinish} onClick={() => setShowResult(true)} type="button">View result</button>}</div>
  </section>;
}

