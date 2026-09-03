import { maturityDimensions, maturityLevels } from "../data/fdlc.ts";

export type MaturityAnswers = Record<string, number>;

export type MaturityResult = {
  score: number;
  level: (typeof maturityLevels)[number];
  strengths: string[];
  gaps: string[];
  answered: number;
};

export function scoreMaturity(answers: MaturityAnswers): MaturityResult {
  const scored = maturityDimensions
    .filter((dimension) => Number.isFinite(answers[dimension.id]))
    .map((dimension) => ({ name: dimension.name, score: Math.max(0, Math.min(5, answers[dimension.id])) }));

  const average = scored.length ? scored.reduce((total, item) => total + item.score, 0) / scored.length : 0;
  const score = Math.floor(average);
  const level = maturityLevels.find((item) => item.level === score) ?? maturityLevels[0];
  const sorted = [...scored].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

  return {
    score,
    level,
    strengths: sorted.filter((item) => item.score >= 4).sort((a, b) => b.score - a.score).slice(0, 3).map((item) => item.name),
    gaps: sorted.slice(0, 3).map((item) => item.name),
    answered: scored.length,
  };
}

export function assessmentIsComplete(answers: MaturityAnswers) {
  return maturityDimensions.every((dimension) => Number.isFinite(answers[dimension.id]));
}
