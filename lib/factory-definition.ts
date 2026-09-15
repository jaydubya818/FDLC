import { stringify } from "yaml";

export type FactoryForm = {
  workType: string;
  outcome: string;
  criteria: string;
  authority: string[];
  verification: string[];
  humanControls: string[];
};

export type FactoryDefinition = {
  version: "0.1-draft";
  intent: { outcome: string; workType: string };
  acceptanceCriteria: string[];
  planBoundaries: string[];
  candidateWorkOrders: Array<{ name: string; outcome: string }>;
  requiredCapabilities: string[];
  authority: string[];
  verificationContract: string[];
  humanControls: string[];
  outcomeMetrics: string[];
};

const workOrderTemplates: Record<string, string[]> = {
  "Dependency upgrade": ["Inventory dependency surface", "Implement bounded upgrade", "Verify compatibility and evidence"],
  "Vulnerability remediation": ["Confirm affected scope", "Implement minimum safe remediation", "Run security and regression verification"],
  "Test repair": ["Reproduce and classify failure", "Implement bounded repair", "Verify determinism and regression coverage"],
  "API migration": ["Map deprecated API usage", "Migrate bounded call sites", "Verify contract and compatibility"],
  "Feature implementation": ["Confirm plan and boundaries", "Implement scoped capability", "Verify acceptance contract"],
  "Documentation update": ["Identify source-of-truth drift", "Update affected documentation", "Validate links, examples, and source alignment"],
};

export function splitLines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim().replace(/^[-*]\s*/, "")).filter(Boolean);
}

export function generateFactoryDefinition(form: FactoryForm): FactoryDefinition {
  const acceptanceCriteria = splitLines(form.criteria);
  const templates = workOrderTemplates[form.workType] ?? ["Clarify bounded scope", "Execute governed change", "Verify exact outcome"];
  const requiredCapabilities = [
    "Repository and context research",
    form.authority.includes("Code modification") ? "Code implementation" : "Read-only analysis",
    form.verification.length ? "Independent verification" : "Human evidence review",
    form.authority.includes("Deployment") ? "Governed release controls" : "Artifact handoff",
  ];

  return {
    version: "0.1-draft",
    intent: { outcome: form.outcome.trim(), workType: form.workType },
    acceptanceCriteria,
    planBoundaries: [
      `Stay within the approved ${form.workType.toLowerCase()} outcome and named repositories.`,
      "Stop when authority, acceptance criteria, or evidence requirements are ambiguous.",
      "Treat release and production action as separate from successful execution.",
    ],
    candidateWorkOrders: templates.map((name) => ({ name, outcome: `${name} for: ${form.outcome.trim()}` })),
    requiredCapabilities: Array.from(new Set(requiredCapabilities)),
    authority: form.authority,
    verificationContract: form.verification,
    humanControls: form.humanControls,
    outcomeMetrics: ["Verified completion", "Cycle time", "Human review minutes", "Cost per verified outcome", "Reopen or rollback rate"],
  };
}

function markdownList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function formatFactoryDefinitionJson(definition: FactoryDefinition) {
  return `${JSON.stringify(definition, null, 2)}\n`;
}

export function formatFactoryDefinitionYaml(definition: FactoryDefinition) {
  return stringify(definition);
}

export function formatFactoryDefinitionMarkdown(definition: FactoryDefinition) {
  const workOrders = definition.candidateWorkOrders
    .map((item) => `- **${item.name}:** ${item.outcome}`)
    .join("\n");

  return `# Factory Definition: ${definition.intent.workType}

Version: ${definition.version}
Status: Conceptual FDLC output

## Intent

${definition.intent.outcome}

## Acceptance criteria

${markdownList(definition.acceptanceCriteria)}

## Plan boundaries

${markdownList(definition.planBoundaries)}

## Candidate Work Orders

${workOrders}

## Required capabilities

${markdownList(definition.requiredCapabilities)}

## Delegated authority

${markdownList(definition.authority)}

## Verification contract

${markdownList(definition.verificationContract)}

## Human controls

${markdownList(definition.humanControls)}

## Outcome metrics

${markdownList(definition.outcomeMetrics)}

> This artifact teaches the FDLC mental model. It is not an executable Mission Control manifest or a formal FDLC Specification document.
`;
}

export function factoryFormErrors(form: FactoryForm) {
  const errors: string[] = [];
  if (!form.workType) errors.push("Choose a work type.");
  if (form.outcome.trim().length < 12) errors.push("Describe a specific engineering outcome.");
  if (splitLines(form.criteria).length === 0) errors.push("Add at least one acceptance criterion.");
  if (form.authority.length === 0) errors.push("Choose at least one authority boundary.");
  if (form.verification.length === 0) errors.push("Choose at least one deterministic verification method.");
  if (form.humanControls.length === 0) errors.push("Choose at least one human control boundary.");
  return errors;
}
