export const factoryHandoff = {
  title: "A definition is intent. A version is a qualified runtime.",
  description: "This design-to-qualification handoff sits within FDLC’s governing lifecycle. It produces a qualified factory composition; software delivery still follows intent → planning → execution → evidence → verification → approval → release → outcomes → learning.",
  steps: [
    { owner: "You + AI-FDE", title: "Factory Definition", detail: "Describe the workflow, capabilities, authority, and evidence required.", state: "Reviewable intent" },
    { owner: "Accountable human FDE", title: "Review and approve", detail: "Confirm the design and the authority being delegated.", state: "Explicit approval" },
    { owner: "Mission Control", title: "Validate and qualify", detail: "Check the submitted intent and qualify the exact runtime composition.", state: "Evidence gate" },
    { owner: "Mission Control", title: "Factory Version", detail: "Identify the immutable qualified composition. Release and execution still require authorization.", state: "Qualified runtime" },
  ],
  boundary: "This builder creates a conceptual definition. It does not submit to Mission Control or authorize execution.",
} as const;
