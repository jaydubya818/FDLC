import { maturityDimensions } from "../data/fdlc.ts";
import type { MaturityAnswers, MaturityResult } from "./maturity.ts";

export function serializeMaturityAnswers(answers: MaturityAnswers) {
  const params = new URLSearchParams();
  for (const dimension of maturityDimensions) {
    const score = answers[dimension.id];
    if (Number.isFinite(score)) params.set(dimension.id, String(score));
  }
  return params.toString();
}

export function parseMaturityAnswers(search: string): MaturityAnswers {
  const params = new URLSearchParams(search.replace(/^[?#]/, ""));
  const answers: MaturityAnswers = {};
  for (const dimension of maturityDimensions) {
    const raw = params.get(dimension.id);
    if (raw === null || !/^[0-5]$/.test(raw)) continue;
    const score = Number(raw);
    if (Number.isInteger(score) && score >= 0 && score <= 5) answers[dimension.id] = score;
  }
  return answers;
}

export function formatMaturityMarkdown(result: MaturityResult, nextActions: readonly string[]) {
  const gaps = result.gaps.slice(0, 3).map((gap) => `- ${gap}`).join("\n") || "- No scored gaps yet.";
  const actions = nextActions.map((action) => `- ${action}`).join("\n");
  return `# FDLC maturity assessment

Status: Educational diagnostic. Not certification.

## Level

L${result.score} — ${result.level.name}

${result.level.description}

## Top three gaps

${gaps}

## Recommended next actions

${actions}

> This result is an educational diagnostic, not FDLC certification or a production audit.
`;
}
