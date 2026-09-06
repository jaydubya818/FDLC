/** Fixed source-reviewed browser oracles, never inferred from observed page counts. */
const layouts = {
  bridge: { source: "e4112bb06333b8244c18fc4a9736b1f3c807bc78", total: 12 },
  final: { source: "8057d1fd2c9aafaad309488aaa6038bd61b61e57", total: 13 },
} as const;

const reconciledMcp = {
  summary: "One exact Context7 query-docs read was qualified through versioned authority, brokered execution, durable receipts, and independent verification.",
  limitation: "One fixed public React query only; writes, arbitrary servers and operations, broad credentials, and harness-native MCP remain unsupported.",
} as const;

export function migrationFdlcCapabilityContract(mode: string, sourceEra: string) {
  if (mode !== "bridge" && mode !== "final") throw new RangeError("Unknown FDLC presentation mode");
  if (sourceEra !== "pre-reconciliation" && sourceEra !== "reconciled-main") throw new RangeError("Unknown FDLC public source era");
  const final = mode === "final";
  const reconciled = sourceEra === "reconciled-main";
  return {
    sourceEra,
    presentationSource: layouts[mode].source,
    publicStatusSource: reconciled ? "7a184b52a21bac207c0d7cfab99b46f40a880af8" : layouts[mode].source,
    total: layouts[mode].total,
    groups: final
      ? [["qualified", 7], ["bounded", reconciled ? 5 : 4], ["missing", reconciled ? 1 : 2]]
      : [["available", 6], ["experimental", reconciled ? 5 : 4], ["planned", reconciled ? 1 : 2]],
    mcp: {
      name: final ? "Tools/MCP runtime" : "Governed MCP runtime",
      status: final ? (reconciled ? "Partial" : "Missing") : (reconciled ? "Experimental" : "Planned"),
      group: final ? (reconciled ? "bounded" : "missing") : (reconciled ? "experimental" : "planned"),
      ...(reconciled ? reconciledMcp : {
        summary: "The architecture reserves a default-deny MCP authority boundary.",
        limitation: final ? "MCP is unsupported for the currently admitted Codex and DeepSeek manifests." : "Current admitted harness manifests mark MCP unsupported.",
      }),
    },
  };
}
