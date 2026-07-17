import { ApiError } from "../../shared/api/client";
import { createTaskNote, updateChecklistItem, updateTaskStatus } from "../tasks/api";
import type {
  CreateTaskNoteInput,
  UpdateChecklistItemInput,
  UpdateTaskStatusInput,
} from "../tasks/types";
import { offlineQueueStorage } from "./offlineQueueStorage";
import type { OfflineMutation } from "./offlineQueue.types";

type SyncApi = {
  updateTaskStatus: (input: UpdateTaskStatusInput) => Promise<unknown>;
  updateChecklistItem: (input: UpdateChecklistItemInput) => Promise<unknown>;
  createTaskNote: (input: CreateTaskNoteInput) => Promise<unknown>;
};

const defaultSyncApi: SyncApi = {
  updateTaskStatus,
  updateChecklistItem,
  createTaskNote,
};

const replayMutation = async (mutation: OfflineMutation, syncApi: SyncApi) => {
  if (mutation.type === "UPDATE_TASK_STATUS") {
    return syncApi.updateTaskStatus(mutation.payload);
  }

  if (mutation.type === "UPDATE_CHECKLIST_ITEM") {
    return syncApi.updateChecklistItem(mutation.payload);
  }

  return syncApi.createTaskNote(mutation.payload);
};

export type SyncConflict = {
  mutation: OfflineMutation;
  message: string;
};

export const syncOfflineQueue = async (syncApi = defaultSyncApi) => {
  const queue = offlineQueueStorage.getAll();
  const syncedMutationIds: string[] = [];
  const failedMutationIds: string[] = [];
  const conflicts: SyncConflict[] = [];

  for (const mutation of queue) {
    try {
      await replayMutation(mutation, syncApi);
      syncedMutationIds.push(mutation.id);
      offlineQueueStorage.remove(mutation.id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        conflicts.push({
          mutation,
          message: error.message,
        });

        offlineQueueStorage.remove(mutation.id);
        continue;
      }

      failedMutationIds.push(mutation.id);
    }
  }

  return {
    syncedCount: syncedMutationIds.length,
    failedCount: failedMutationIds.length,
    conflictCount: conflicts.length,
    conflicts,
    remainingCount: offlineQueueStorage.getAll().length,
  };
};
