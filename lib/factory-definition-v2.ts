import { parse, stringify } from "yaml";
import { generateFactoryDefinition, splitLines, type FactoryDefinition, type FactoryForm } from "./factory-definition.ts";

/**
 * Factory Definition v0.2 (draft).
 *
 * v0.1 is a teaching artifact: lists of strings. v0.2 makes every element
 * addressable and checkable: criteria have IDs and verifiers, work orders have
 * path scope and dependencies, authority has limits, and verification names an
 * independent check. It is still conceptual: not an executable Mission Control
 * manifest. Mission Control can import it as an unapproved draft.
 */
export const FACTORY_DEFINITION_V2_SCHEMA_URL = "https://fdlc.ai/schemas/factory-definition-0.2.json";

export type FactoryDefinitionV2 = {
  $schema: string;
  version: "0.2-draft";
  intent: { outcome: string; workType: string };
  acceptanceCriteria: Array<{ id: string; text: string; verifier: string }>;
  planBoundaries: string[];
  workOrders: Array<{ id: string; name: string; outcome: string; scope: string[]; authority: string[]; verifier: string; dependsOn: string[] }>;
  authority: Array<{ capability: string; limit: string }>;
  verification: Array<{ check: string; command: string; independent: boolean }>;
  humanControls: Array<{ decision: string; when: string }>;
  budgets: { maxAttemptsPerWorkOrder: number; stopOnAmbiguity: boolean };
  knownFailureModes: string[];
  outcomeMetrics: string[];
  provenance: { generatedBy: string; conceptual: boolean };
};

const scopeByWorkType: Record<string, string[]> = {
  "Dependency upgrade": ["package.json", "package-lock.json", "src/**"],
  "Vulnerability remediation": ["src/**", "package.json", "package-lock.json"],
  "Test repair": ["tests/**", "test/**"],
  "API migration": ["src/**"],
  "Feature implementation": ["src/**", "tests/**"],
  "Documentation update": ["docs/**", "README.md"],
};

const failureModesByWorkType: Record<string, string[]> = {
  "Dependency upgrade": ["Transitive dependency breaks a consumer outside the named repositories", "Lockfile changes without a matching code change", "Tests pass because the old version is still resolved"],
  "Vulnerability remediation": ["Fix suppresses the scanner finding without removing the exposure", "Patch widens behavior beyond the affected scope", "Evidence bound to an earlier commit than the final candidate"],
  "Test repair": ["Test is weakened or deleted instead of repaired", "Flaky failure masked by retries", "Fix passes only in the producer's environment"],
  "API migration": ["Call sites migrated by pattern miss dynamic usage", "Public behavior changes without a contract test", "Deprecated import remains in generated code"],
  "Feature implementation": ["Scope grows beyond the approved plan", "Acceptance criteria verified by the same agent that wrote the code", "Feature flag left on in production by default"],
  "Documentation update": ["Examples updated but not executed", "Links valid but pointing at the wrong source of truth", "Documentation drifts again with no owner"],
};

const limitByAuthority: Record<string, string> = {
  "Repository read": "Named repositories only",
  "Branch creation": "Branches under a factory-owned prefix only",
  "Code modification": "Paths inside the WorkOrder scope only",
  "Test execution": "Sandboxed run with no production credentials",
  "Pull request creation": "Draft pull requests; no auto-merge",
  Deployment: "Staging only unless a person approves production",
};

const commandByCheck: Record<string, string> = {
  Tests: "npm test",
  Compile: "npm run build",
  "Type checking": "tsc --noEmit",
  Lint: "npm run lint",
  "Security scanning": "npm audit --audit-level=high",
  "Policy checks": "<organization policy check>",
  "Schema validation": "<organization schema validator>",
};

const whenByControl: Record<string, string> = {
  "Plan approval": "Before any WorkOrder is released",
  "Security boundary": "When a change touches authentication, secrets, or network policy",
  "Architecture change": "When public interfaces or the dependency graph change",
  Merge: "After independent evidence is current for the exact candidate",
  "Production deployment": "Every release, without exception",
};

export function upgradeFactoryDefinition(definition: FactoryDefinition): FactoryDefinitionV2 {
  const verification = definition.verificationContract.map((check) => ({ check, command: commandByCheck[check] ?? "<define a deterministic command>", independent: true }));
  const defaultVerifier = verification[0]?.check ?? "Human evidence review";
  const scope = scopeByWorkType[definition.intent.workType] ?? ["src/**"];
  const canModify = definition.authority.includes("Code modification");
  return {
    $schema: FACTORY_DEFINITION_V2_SCHEMA_URL,
    version: "0.2-draft",
    intent: { ...definition.intent },
    acceptanceCriteria: definition.acceptanceCriteria.map((text, index) => ({ id: `AC-${index + 1}`, text, verifier: defaultVerifier })),
    planBoundaries: [...definition.planBoundaries],
    workOrders: definition.candidateWorkOrders.map((item, index, all) => {
      const last = index === all.length - 1;
      return {
        id: `WO-${index + 1}`,
        name: item.name,
        outcome: item.outcome,
        scope: last ? [] : scope,
        authority: last ? definition.authority.filter((value) => value === "Repository read" || value === "Test execution") : definition.authority.filter((value) => canModify || value !== "Code modification"),
        verifier: defaultVerifier,
        dependsOn: index === 0 ? [] : [`WO-${index}`],
      };
    }),
    authority: definition.authority.map((capability) => ({ capability, limit: limitByAuthority[capability] ?? "Define an explicit limit" })),
    verification,
    humanControls: definition.humanControls.map((decision) => ({ decision, when: whenByControl[decision] ?? "Define when this decision is required" })),
    budgets: { maxAttemptsPerWorkOrder: 3, stopOnAmbiguity: true },
    knownFailureModes: failureModesByWorkType[definition.intent.workType] ?? ["Define the failure modes this work is exposed to"],
    outcomeMetrics: [...definition.outcomeMetrics],
    provenance: { generatedBy: "fdlc.ai/start", conceptual: true },
  };
}

export function generateFactoryDefinitionV2(form: FactoryForm): FactoryDefinitionV2 {
  return upgradeFactoryDefinition(generateFactoryDefinition(form));
}

export function formatFactoryDefinitionV2Json(definition: FactoryDefinitionV2) {
  return `${JSON.stringify(definition, null, 2)}\n`;
}

export function formatFactoryDefinitionV2Yaml(definition: FactoryDefinitionV2) {
  return stringify(definition);
}

const isString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

/** Structural validation of a v0.2 definition. Returns human-readable errors. */
export function factoryDefinitionV2Errors(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["The definition must be an object."];
  if (value.version !== "0.2-draft") errors.push('version must be "0.2-draft".');
  const intent = value.intent;
  if (!isRecord(intent) || !isString(intent.outcome) || !isString(intent.workType)) errors.push("intent needs an outcome and a workType.");
  const list = (key: string, check: (item: Record<string, unknown>) => boolean, min = 1) => {
    const items = value[key];
    if (!Array.isArray(items) || items.length < min || !items.every((item) => isRecord(item) && check(item))) errors.push(`${key} is missing or malformed.`);
    return Array.isArray(items) ? items : [];
  };
  const criteria = list("acceptanceCriteria", (item) => isString(item.id) && isString(item.text) && isString(item.verifier));
  const workOrders = list("workOrders", (item) => isString(item.id) && isString(item.name) && isString(item.outcome) && isStringArray(item.scope) && isStringArray(item.authority) && isString(item.verifier) && isStringArray(item.dependsOn));
  list("authority", (item) => isString(item.capability) && isString(item.limit));
  list("verification", (item) => isString(item.check) && isString(item.command) && typeof item.independent === "boolean");
  list("humanControls", (item) => isString(item.decision) && isString(item.when));
  if (!isStringArray(value.planBoundaries) || value.planBoundaries.length === 0) errors.push("planBoundaries is missing or malformed.");
  if (!isStringArray(value.knownFailureModes)) errors.push("knownFailureModes is missing or malformed.");
  if (!isStringArray(value.outcomeMetrics) || value.outcomeMetrics.length === 0) errors.push("outcomeMetrics is missing or malformed.");
  const budgets = value.budgets;
  if (!isRecord(budgets) || !Number.isInteger(budgets.maxAttemptsPerWorkOrder) || (budgets.maxAttemptsPerWorkOrder as number) < 1 || typeof budgets.stopOnAmbiguity !== "boolean") errors.push("budgets needs a positive maxAttemptsPerWorkOrder and stopOnAmbiguity.");
  const provenance = value.provenance;
  if (!isRecord(provenance) || !isString(provenance.generatedBy) || typeof provenance.conceptual !== "boolean") errors.push("provenance is missing or malformed.");
  const ids = new Set(workOrders.map((item) => (item as { id: string }).id));
  for (const item of workOrders as Array<{ id: string; dependsOn: string[] }>) {
    for (const dependency of item.dependsOn ?? []) if (!ids.has(dependency)) errors.push(`${item.id} depends on unknown work order ${dependency}.`);
  }
  if (new Set((criteria as Array<{ id: string }>).map((item) => item.id)).size !== criteria.length) errors.push("acceptanceCriteria ids must be unique.");
  return errors;
}

export type ParsedFactoryDefinition =
  | { ok: true; definition: FactoryDefinitionV2; upgradedFrom?: "0.1-draft" }
  | { ok: false; errors: string[] };

/** Parse JSON or YAML text. Accepts v0.2 directly and upgrades v0.1. */
export function parseFactoryDefinition(text: string): ParsedFactoryDefinition {
  let raw: unknown;
  try {
    raw = parse(text);
  } catch {
    return { ok: false, errors: ["The file is not valid JSON or YAML."] };
  }
  if (!isRecord(raw)) return { ok: false, errors: ["The definition must be an object."] };
  if (raw.version === "0.1-draft") {
    const v1 = raw as unknown as FactoryDefinition;
    const required = isRecord(v1.intent) && isString(v1.intent.outcome) && isString(v1.intent.workType) && isStringArray(v1.acceptanceCriteria) && isStringArray(v1.authority) && isStringArray(v1.verificationContract) && isStringArray(v1.humanControls) && Array.isArray(v1.candidateWorkOrders) && isStringArray(v1.planBoundaries) && isStringArray(v1.outcomeMetrics);
    if (!required) return { ok: false, errors: ["This v0.1 definition is missing required fields."] };
    return { ok: true, definition: upgradeFactoryDefinition(v1), upgradedFrom: "0.1-draft" };
  }
  const errors = factoryDefinitionV2Errors(raw);
  return errors.length ? { ok: false, errors } : { ok: true, definition: raw as FactoryDefinitionV2 };
}

/** Convert a definition back into builder form fields so it can be edited. */
export function definitionToForm(definition: FactoryDefinitionV2): FactoryForm {
  return {
    workType: definition.intent.workType,
    outcome: definition.intent.outcome,
    criteria: definition.acceptanceCriteria.map((item) => item.text).join("\n"),
    authority: definition.authority.map((item) => item.capability),
    verification: definition.verification.map((item) => item.check),
    humanControls: definition.humanControls.map((item) => item.decision),
  };
}

export const exampleFactoryForm: FactoryForm = {
  workType: "Dependency upgrade",
  outcome: "Upgrade the payments SDK across three services without changing public API behavior.",
  criteria: splitLines("All existing contract tests pass\nNo deprecated SDK imports remain\nThe rollback path is documented").join("\n"),
  authority: ["Repository read", "Branch creation", "Code modification", "Test execution", "Pull request creation"],
  verification: ["Tests", "Type checking", "Security scanning"],
  humanControls: ["Plan approval", "Merge"],
};
