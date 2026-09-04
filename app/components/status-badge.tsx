import type { MissionControlCapabilityStatus } from "../../data/mission-control";

const statusTones = {
  "Qualified": "qualified",
  "Qualified; advisory": "qualified",
  "Qualified diagnostic system": "qualified",
  "Implemented, gated": "implemented",
  "Production-pilot eligible; Preview": "preview",
  "Partial": "partial",
  "Missing": "missing",
  "Missing canonical lifecycle": "missing",
} as const satisfies Record<MissionControlCapabilityStatus, string>;

function statusTone(status: string) {
  return Object.prototype.hasOwnProperty.call(statusTones, status)
    ? statusTones[status as MissionControlCapabilityStatus]
    : "neutral";
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`capability-status status-${statusTone(status)}`}>{status}</span>;
}
