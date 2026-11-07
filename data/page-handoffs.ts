export const pageHandoffs = {
  framework: {
    eyebrow: "What should I do next?",
    title: "Turn the model into a Factory Definition.",
    links: [
      ["/in-5-minutes", "Experience FDLC in 5 minutes"],
      ["/simulator", "Run the factory simulator"],
      ["/start", "Define your first factory line"],
    ],
  },
  architecture: {
    eyebrow: "What should I do next?",
    title: "See the architecture work, then build your own.",
    links: [
      ["/lab", "Build and run a minimal factory"],
      ["/mission-control", "Inspect an optional reference implementation"],
      ["/guide/appendix/execution-boundaries-and-terminology", "Read the terminology reference"],
    ],
  },
  manifesto: {
    eyebrow: "What should I do next?",
    title: "See the principles applied to one factory line.",
    links: [
      ["/in-5-minutes", "Understand FDLC in 5 minutes"],
      ["/simulator", "Run the factory simulator"],
      ["/start", "Define your first factory line"],
    ],
  },
  start: {
    eyebrow: "What should I do next?",
    title: "Next: run a governed factory on your machine.",
    links: [
      ["/lab", "Build and run a minimal factory"],
      ["/simulator", "Break a factory in the simulator"],
      ["/maturity", "Assess organizational maturity"],
    ],
  },
  deploy: {
    eyebrow: "What should I do next?",
    title: "AI-FDE helps design a Factory Definition; your chosen runtime qualifies and runs it.",
    links: [
      ["/start", "Build a Factory Definition"],
      ["/mission-control", "Inspect Mission Control"],
      ["/maturity", "Assess readiness"],
    ],
  },
  "mission-control": {
    eyebrow: "What should I do next?",
    title: "Use the reference implementation, then go deeper.",
    links: [
      ["/guide/06-improve/42-mission-control-as-a-living-case-study", "Read the living case study"],
      ["/architecture", "Inspect the architecture"],
      ["/start", "Build a Factory Definition"],
    ],
  },
  maturity: {
    eyebrow: "What should I do next?",
    title: "Close the weakest gap, then define one factory line.",
    links: [
      ["/start", "Build a Factory Definition"],
      ["/architecture", "Inspect the architecture"],
      ["/benchmarks", "Establish outcome measures"],
    ],
  },
  "in-5-minutes": {
    eyebrow: "What should I do next?",
    title: "You have the mental model. Take one concrete next step.",
    links: [
      ["/simulator", "Next: run the factory simulator"],
      ["/start", "Define your first factory line"],
      ["/lab", "Build and run a minimal factory"],
    ],
  },
} as const;
