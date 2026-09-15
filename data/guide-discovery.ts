import { proposedGuideMap } from "./guide.ts";

function fromProposedGuideMap(titles: readonly string[]) {
  return titles.map((title) => {
    const entry = proposedGuideMap.find((item) => item[0] === title);
    if (!entry) throw new Error(`Unknown proposedGuideMap title: ${title}`);
    return [entry[0], entry[1]] as const;
  });
}

export const guideDiscovery = {
  framework: fromProposedGuideMap([
    "What Is an AI Software Factory?",
    "Coding Agents vs. Software Factories",
    "Implementation Playbook",
  ]),
  architecture: fromProposedGuideMap([
    "Execution Boundaries and Canonical Terminology",
    "State, Checkpoints, and Recovery",
    "Verification and Evaluation",
  ]),
  manifesto: fromProposedGuideMap([
    "Human Oversight",
    "Continuous Learning",
    "Coding Agents vs. Software Factories",
  ]),
  "mission-control": fromProposedGuideMap([
    "State, Checkpoints, and Recovery",
    "Verification and Evaluation",
    "Failure Taxonomy",
  ]),
} as const;

export type GuideDiscoveryPage = keyof typeof guideDiscovery;
