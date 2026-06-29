import { apiRequest } from "../../shared/api/client";
import type { TaskDetailResponse, TaskFilters, TaskListResponse } from "./types";

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
