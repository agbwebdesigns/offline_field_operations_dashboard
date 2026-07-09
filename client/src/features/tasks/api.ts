import { apiRequest } from "../../shared/api/client";
import type {
  CreateTaskNoteInput,
  CreateTaskNoteResponse,
  TaskDetailResponse,
  TaskFilters,
  TaskListResponse,
  UpdateChecklistItemInput,
  UpdateChecklistItemResponse,
  UpdateTaskStatusInput,
  UpdateTaskStatusResponse,
} from "./types";

const buildTaskQueryString = (filters: TaskFilters) => {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.priority) {
    params.set("priority", filters.priority);
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
};

export const getTasks = async (filters: TaskFilters = {}) => {
  const queryString = buildTaskQueryString(filters);

  return apiRequest<TaskListResponse>(`/tasks${queryString}`);
};

export const getTaskById = async (taskId: string) => {
  return apiRequest<TaskDetailResponse>(`/tasks/${taskId}`);
};

export const updateTaskStatus = async ({
  taskId,
  status,
  expectedVersion,
}: UpdateTaskStatusInput) => {
  return apiRequest<UpdateTaskStatusResponse>(`/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      expectedVersion,
    }),
  });
};

export const updateChecklistItem = async ({
  taskId,
  itemId,
  completed,
  expectedVersion,
}: UpdateChecklistItemInput) => {
  return apiRequest<UpdateChecklistItemResponse>(`/tasks/${taskId}/checklist/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({
      completed,
      expectedVersion,
    }),
  });
};

export const createTaskNote = async ({ taskId, body, expectedVersion }: CreateTaskNoteInput) => {
  return apiRequest<CreateTaskNoteResponse>(`/tasks/${taskId}/notes`, {
    method: "POST",
    body: JSON.stringify({
      body,
      expectedVersion,
    }),
  });
};
