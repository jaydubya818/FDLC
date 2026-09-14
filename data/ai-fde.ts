export const AI_FDE_SOURCE = {
  repository: "https://github.com/jaydubya818/AI-FDE-Agent",
  revision: "21305bbdb64b86bade75f4673d3e1a8233a2922e",
  tree: "7c9aea40ee3253e648062f13ec1320f22c157773",
  license: "MIT",
  qualifiedAt: "2026-09-14",
} as const;

export const factoryDefinitionStatuses = ["draft", "in_review", "approved", "rejected", "stale"] as const;
export type FactoryDefinitionStatus = (typeof factoryDefinitionStatuses)[number];

export type FactoryDefinitionConcern = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
};

export const factoryDefinitionConcerns = [
  ["objective", "Objective", "The measurable outcome the factory should produce and the constraints it must respect."],
  ["workflow", "Workflow", "The source workflow, target workflow, actors, systems, exceptions, and known unknowns."],
  ["lineage", "Source lineage", "The evidence and reviewed claims supporting each material part of the definition."],
  ["capabilities", "Capabilities", "The agents, tools, skills, models, SDKs, harnesses, and implementations required."],
  ["context", "Context", "Approved knowledge, retrieval boundaries, freshness rules, and attribution requirements."],
  ["execution", "Execution", "The runtime, sandbox, Work Graph, orchestration, and recovery design."],
  ["authority", "Authority", "Policy, delegated permissions, approvals, escalation, and accountable human decisions."],
  ["verification", "Verification", "Independent acceptance criteria, evidence requirements, and failure handling."],
  ["economics", "Economics", "Budgets, baseline assumptions, attributable cost, and value measurement."],
  ["reliability", "Reliability", "Operational limits, observability, reconciliation, rollback, and rollout controls."],
  ["outcomes", "Outcomes", "The technical, operational, and user results that will determine whether the factory worked."],
  ["readiness", "Readiness", "Maturity, confidence, unresolved claims, and the conditions required before qualification."],
].map(([id, name, description]) => ({ id, name, description })) satisfies readonly FactoryDefinitionConcern[];

export type FactoryDefinition = {
  readonly schema: "fdlc.factory-definition/v1";
  readonly definitionId: string;
  readonly version: number;
  readonly status: FactoryDefinitionStatus;
  readonly engagementId: string;
  readonly sourceRevision: string;
  readonly contentDigest: string;
  readonly approvedAt: string | null;
  readonly approvedBy: string | null;
  readonly concerns: readonly FactoryDefinitionConcern[];
  readonly unresolvedClaimIds: readonly string[];
};

export type MissionControlHandoff = {
  readonly schema: "fdlc.ai-fde.mission-control-handoff/v1";
  readonly handoffId: string;
  readonly factoryDefinition: Pick<
    FactoryDefinition,
    "definitionId" | "version" | "contentDigest" | "sourceRevision" | "approvedAt" | "approvedBy"
  >;
  readonly qualificationMaterialDigest: string;
  readonly requestedEnvironment: "qualification";
  readonly requestedAction: "validate_factory_definition";
  readonly requestedAt: string;
};

export const missionControlHandoffBoundary = {
  aiFdeMay: ["prepare qualification material", "request validation", "report validation status"],
  aiFdeMayNot: ["create a Factory Version", "qualify a Factory Version", "activate runtime execution"],
  missionControlOwns: ["validation", "Factory Version qualification", "WorkOrders", "Attempts", "execution evidence", "release authority"],
} as const;
