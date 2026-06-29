export type TaskStatusFilter = "TODO" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED";
export type PriorityFilter = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TaskListQuery = {
  q?: string;
  status?: TaskStatusFilter;
  priority?: PriorityFilter;
};
