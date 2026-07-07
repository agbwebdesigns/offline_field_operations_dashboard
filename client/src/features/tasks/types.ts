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
export type TaskUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "FIELD_USER";
};

export type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type TaskNote = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: TaskUser;
};

export type TaskDetail = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  assignedTo: TaskUser | null;
  createdBy: TaskUser;
  checklistItems: ChecklistItem[];
  notes: TaskNote[];
};

export type TaskDetailResponse = {
  task: TaskDetail;
};

export type UpdateTaskStatusInput = {
  taskId: string;
  status: TaskStatus;
};

export type UpdateTaskStatusResponse = {
  task: {
    id: string;
    status: TaskStatus;
    version: number;
    updatedAt: string;
  };
};

export type UpdateChecklistItemInput = {
  taskId: string;
  itemId: string;
  completed: boolean;
};

export type UpdateChecklistItemResponse = {
  checklistItem: {
    id: string;
    completed: boolean;
    updatedAt: string;
  };
  task: {
    id: string;
    version: number;
    updatedAt: string;
  };
};

export type CreateTaskNoteInput = {
  taskId: string;
  body: string;
};

export type CreateTaskNoteResponse = {
  note: TaskNote;
  task: {
    id: string;
    version: number;
    updatedAt: string;
  };
};
