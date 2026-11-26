import type { FactoryForm } from "../lib/factory-definition";

/** Bounded starting points; selecting a preset never grants runtime authority. */
export const smallFactoryPresets = [
  {
    id: "test-repair",
    label: "Test repair",
    form: {
      workType: "Test repair",
      outcome: "Repair one reproducible API regression in an approved repository and return a verified patch for human review.",
      criteria: "The original failing API acceptance test passes without changing the protected test\nExisting API contract and regression tests pass\nOnly the approved implementation files change\nCandidate digest, verifier output and failed attempts remain inspectable",
      authority: ["Repository read", "Branch creation", "Code modification", "Test execution"],
      verification: ["Tests", "Type checking", "Policy checks"],
      humanControls: ["Plan approval", "Merge", "Production deployment"],
    } satisfies FactoryForm,
  },
  {
    id: "documentation-drift",
    label: "Documentation drift",
    form: {
      workType: "Documentation update",
      outcome: "Find documentation that disagrees with an approved API contract and prepare a sourced correction for owner review.",
      criteria: "Every proposed correction cites the exact API contract or source revision\nPublished API behavior and executable source remain unchanged\nDocumentation links and supported examples pass their checks\nUnsupported claims and ambiguous source conflicts wait for the owner",
      authority: ["Repository read", "Branch creation", "Code modification", "Test execution"],
      verification: ["Tests", "Lint", "Policy checks"],
      humanControls: ["Plan approval", "Merge", "Production deployment"],
    } satisfies FactoryForm,
  },
] as const;
