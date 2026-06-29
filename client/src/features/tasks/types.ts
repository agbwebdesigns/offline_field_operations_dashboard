export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type TaskListItem = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  version: number;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  checklistSummary: {
    total: number;
    completed: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type TaskListResponse = {
  tasks: TaskListItem[];
};

export type TaskFilters = {
  q?: string;
  status?: TaskStatus;
  priority?: Priority;
};
