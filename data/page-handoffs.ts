export const pageHandoffs = {
  framework: {
    eyebrow: "What should I do next?",
    title: "Turn the model into a Factory Definition.",
    links: [
      ["/start", "Build a Factory Definition"],
      ["/in-5-minutes", "See one concrete factory"],
      ["/deploy", "Explore AI-FDE"],
    ],
  },
  architecture: {
    eyebrow: "What should I do next?",
    title: "Inspect how Mission Control realizes the control plane.",
    links: [
      ["/mission-control", "Inspect Mission Control"],
      ["/start", "Build a Factory Definition"],
      ["/guide/appendix/execution-boundaries-and-terminology", "Read the terminology reference"],
    ],
  },
  manifesto: {
    eyebrow: "What should I do next?",
    title: "See the principles applied to one factory line.",
    links: [
      ["/in-5-minutes", "Understand FDLC in 5 minutes"],
      ["/start", "Build a Factory Definition"],
      ["/mission-control", "Inspect Mission Control"],
    ],
  },
  start: {
    eyebrow: "What should I do next?",
    title: "A Factory Definition is governed intent, not an executed factory.",
    links: [
      ["/lab", "Run the reference factory"],
      ["/simulator", "Break a factory in the simulator"],
      ["/deploy", "Explore AI-FDE"],
      ["/mission-control", "Inspect Mission Control"],
    ],
  },
  deploy: {
    eyebrow: "What should I do next?",
    title: "AI-FDE helps design the Factory Definition that Mission Control can qualify.",
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
      ["/#factory-explorer", "Inspect the Factory Explorer"],
      ["/start", "Build your Factory Definition"],
      ["/mission-control", "See Mission Control"],
    ],
  },
} as const;
