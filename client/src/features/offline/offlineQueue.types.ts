import type { TaskStatus } from "../tasks/types";

export type OfflineMutationType =
  "UPDATE_TASK_STATUS" | "UPDATE_CHECKLIST_ITEM" | "CREATE_TASK_NOTE";

export type OfflineMutation =
  | {
      id: string;
      type: "UPDATE_TASK_STATUS";
      createdAt: string;
      payload: {
        taskId: string;
        status: TaskStatus;
        expectedVersion: number;
      };
    }
  | {
      id: string;
      type: "UPDATE_CHECKLIST_ITEM";
      createdAt: string;
      payload: {
        taskId: string;
        itemId: string;
        completed: boolean;
        expectedVersion: number;
      };
    }
  | {
      id: string;
      type: "CREATE_TASK_NOTE";
      createdAt: string;
      payload: {
        taskId: string;
        body: string;
        expectedVersion: number;
      };
    };
