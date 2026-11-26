export type OperatingProfileForm = {
  definitionRef: string;
  owner: string;
  trigger: "event" | "schedule" | "manual";
  intakeSource: string;
  schedule: string;
  timezone: string;
  maxAttempts: string;
  maxElapsedMinutes: string;
  maxCostUsd: string;
  maxConcurrentAttempts: string;
  reviewWithinHours: string;
};

export const initialOperatingProfile: OperatingProfileForm = {
  definitionRef: "",
  owner: "",
  trigger: "event",
  intakeSource: "",
  schedule: "Weekdays at 08:00",
  timezone: "UTC",
  maxAttempts: "2",
  maxElapsedMinutes: "30",
  maxCostUsd: "5",
  maxConcurrentAttempts: "1",
  reviewWithinHours: "24",
};

export function operatingProfileErrors(form: OperatingProfileForm): string[] {
  const errors: string[] = [];
  if (!form.definitionRef.trim()) errors.push("Name the Factory Definition and revision this profile accompanies.");
  if (!form.owner.trim()) errors.push("Name the accountable operator or team.");
  if (!["event", "schedule", "manual"].includes(form.trigger)) errors.push("Choose an intake trigger.");
  if (!form.intakeSource.trim()) errors.push("Describe the eligible intake source and scope.");
  if (form.trigger === "schedule") {
    if (!form.schedule.trim()) errors.push("Describe the schedule.");
    try {
      if (!form.timezone.trim()) throw new Error("Timezone required");
      new Intl.DateTimeFormat("en", { timeZone: form.timezone.trim() });
    } catch { errors.push("Use a valid IANA time zone, such as America/Chicago or UTC."); }
  }
  const bounds = [
    ["maxAttempts", "Attempt limit", true],
    ["maxElapsedMinutes", "Elapsed time limit", false],
    ["maxCostUsd", "Spend limit", false],
    ["maxConcurrentAttempts", "Concurrent attempt limit", true],
    ["reviewWithinHours", "Review target", false],
  ] as const;
  for (const [field, label, integer] of bounds) {
    const value = Number(form[field]);
    if (!form[field].trim() || !Number.isFinite(value) || value <= 0 || (integer && !Number.isSafeInteger(value))) {
      errors.push(`${label} must be a positive ${integer ? "whole number" : "number"}.`);
    }
  }
  if (Number(form.maxConcurrentAttempts) > Number(form.maxAttempts)) {
    errors.push("Concurrent attempts cannot exceed the shared attempt limit.");
  }
  return errors;
}

/** Design companion only. No runtime reads this file or gains authority from it. */
export function generateOperatingProfile(form: OperatingProfileForm) {
  const errors = operatingProfileErrors(form);
  if (errors.length) throw new Error(errors.join(" "));
  return {
    kind: "fdlc-operating-profile-example",
    version: "0.1-draft",
    status: "design-only",
    executionEnabled: false,
    factoryDefinitionReference: form.definitionRef.trim(),
    accountableOwner: form.owner.trim(),
    intake: {
      trigger: form.trigger,
      eligibleSourceAndScope: form.intakeSource.trim(),
      ...(form.trigger === "schedule" ? {
        scheduleIntent: form.schedule.trim(),
        timezone: form.timezone.trim(),
        missedSchedulePolicy: "Record missed intake; require owner review before backfill.",
      } : {}),
      eventIdentity: "Retain the source event ID; duplicate delivery resolves to the existing WorkOrder.",
      overlapPolicy: "Admit concurrent Attempts only for independent Tasks with disjoint write and effect targets. Serialize shared targets and never admit the same Attempt twice.",
      noEligibleWork: "Remain idle and record that no work was eligible.",
    },
    sharedWorkOrderBudget: {
      includes: "Parent and all delegated work, retries, verification and reconciliation.",
      maxAttempts: Number(form.maxAttempts),
      maxElapsedMinutes: Number(form.maxElapsedMinutes),
      elapsedClock: "Wall time while execution, verification or reconciliation is active. Parallel activity shares the same clock. Waiting for human review pauses this budget and is measured separately.",
      maxCostUsd: Number(form.maxCostUsd),
      maxConcurrentAttempts: Number(form.maxConcurrentAttempts),
      onExhaustion: "Stop new work, retain evidence and request an owner decision. Do not reset by spawning a subagent.",
    },
    recovery: {
      checkpoint: "Persist WorkOrder, Attempt, candidate, evidence, decision and effect references before acknowledging transitions.",
      effectIdentity: "Use a stable effect ID distinct from the event and Attempt IDs.",
      ambiguousEffect: "Hold for reconciliation against the effect receipt before retrying.",
      cancellation: "Stop admitting work and propagate cancellation to delegated attempts; reconcile effects already in flight.",
    },
    humanReview: {
      targetHours: Number(form.reviewWithinHours),
      requiredBinding: ["WorkOrder", "Factory Version", "Candidate digest", "Evidence digest", "Requested action", "Current authority"],
      overdue: "Hold at the decision boundary. An overdue review grants no new authority.",
      afterCandidateChange: "Invalidate the previous decision and verify the new candidate before a fresh decision.",
    },
    measurement: {
      cohort: "All eligible WorkOrders in a declared time window; retain failures, cancellations and pending work.",
      outcomes: ["Verified outcomes", "Accepted outcomes", "Observed results after the authorized action", "Reopen or rollback rate"],
      costs: "Include failed attempts, delegated work, infrastructure, verification and human review in cohort cost.",
      operatorAttention: ["Review minutes", "Interventions per WorkOrder", "Time waiting for a decision", "Recovery time"],
    },
    activation: "Translate this draft into your runtime, qualify the exact version and obtain deployment authorization separately.",
  } as const;
}
