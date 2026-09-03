export function StatusBadge({ status }: { status: string }) {
  return <span className={`capability-status status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>;
}

