export const governingLifecycle = [
  { name: "Intent", detail: "State the desired outcome, constraints, and accountable owner." },
  { name: "Planning", detail: "Define the work, acceptance criteria, and delegated authority." },
  { name: "Execution", detail: "Run bounded work against the approved plan." },
  { name: "Evidence", detail: "Record attributable proof from the exact execution and candidate." },
  { name: "Verification", detail: "Evaluate the candidate independently against acceptance criteria." },
  { name: "Approval", detail: "Apply policy and accountable human authority before progression." },
  { name: "Release", detail: "Promote the accepted artifact with authorization and a rollback path." },
  { name: "Outcomes", detail: "Measure the result against the intended outcome." },
  { name: "Learning", detail: "Use validated outcomes to propose controlled improvements." },
] as const;
