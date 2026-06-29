import type { TaskStatus } from "../../features/tasks/types";
import { formatTaskStatus } from "../../features/tasks/formatters";

type StatusBadgeProps = {
  status: TaskStatus | "PENDING_SYNC";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = status === "PENDING_SYNC" ? "Pending Sync" : formatTaskStatus(status);
  const className = label.toLowerCase().replaceAll(" ", "-");

  return <span className={`status-badge status-${className}`}>{label}</span>;
}
