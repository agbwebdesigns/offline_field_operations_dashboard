type StatusBadgeProps = {
  status: "Todo" | "In Progress" | "Blocked" | "Completed" | "Pending Sync";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const className = status.toLowerCase().replaceAll(" ", "-");

  return <span className={`status-badge status-${className}`}>{status}</span>;
}
