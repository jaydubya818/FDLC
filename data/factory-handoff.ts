// Stack-neutral design-to-qualification handoff. Named products appear only as optional examples.
export const factoryHandoff = {
  title: "A definition is intent. A version is a qualified runtime.",
  description: "This design-to-qualification handoff sits within FDLC’s governing lifecycle. It produces a qualified factory composition; software delivery still follows intent → planning → execution → evidence → verification → approval → release → outcomes → learning.",
  steps: [
    { owner: "You, with any design tool", title: "Factory Definition", detail: "Describe the workflow, capabilities, authority, and evidence required.", state: "Reviewable intent" },
    { owner: "Accountable human owner", title: "Review and approve", detail: "Confirm the design and the authority being delegated.", state: "Explicit approval" },
    { owner: "Your control plane", title: "Validate and qualify", detail: "Check the approved intent and qualify the exact composition of agents, harnesses, models, tools and runtime.", state: "Evidence gate" },
    { owner: "Your control plane", title: "Factory Version", detail: "Identify the immutable qualified composition. Release and execution still require authorization.", state: "Qualified runtime" },
  ],
  example: "Any stack can fill these roles. AI-FDE (Preview) is one design tool and Mission Control is one open-source reference control plane; FDLC requires neither.",
  boundary: "This builder creates a conceptual definition. It does not submit to any runtime or authorize execution.",
} as const;
