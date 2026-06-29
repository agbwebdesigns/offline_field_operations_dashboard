import type { Priority, TaskStatus, TaskUser } from "./types";

export const formatTaskStatus = (status: TaskStatus) => {
  const labels: Record<TaskStatus, string> = {
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    BLOCKED: "Blocked",
    COMPLETED: "Completed",
  };

  return labels[status];
};

export const formatPriority = (priority: Priority) => {
  const labels: Record<Priority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
  };

  return labels[priority];
};

export const formatUserRole = (role: TaskUser["role"]) => {
  const labels: Record<TaskUser["role"], string> = {
    ADMIN: "Admin",
    MANAGER: "Manager",
    FIELD_USER: "Field User",
  };

  return labels[role];
};

export const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dueDate));
};

export const formatDateTime = (dateTime: string) => {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateTime));
};
