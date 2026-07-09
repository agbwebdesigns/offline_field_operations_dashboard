import { ApiError } from "../../shared/api/client";
import { createTaskNote, updateChecklistItem, updateTaskStatus } from "../tasks/api";
import { offlineQueueStorage } from "./offlineQueueStorage";
import type { OfflineMutation } from "./offlineQueue.types";

const replayMutation = async (mutation: OfflineMutation) => {
  if (mutation.type === "UPDATE_TASK_STATUS") {
    return updateTaskStatus(mutation.payload);
  }

  if (mutation.type === "UPDATE_CHECKLIST_ITEM") {
    return updateChecklistItem(mutation.payload);
  }

  return createTaskNote(mutation.payload);
};

export type SyncConflict = {
  mutation: OfflineMutation;
  message: string;
};

export const syncOfflineQueue = async () => {
  const queue = offlineQueueStorage.getAll();
  const syncedMutationIds: string[] = [];
  const failedMutationIds: string[] = [];
  const conflicts: SyncConflict[] = [];

  for (const mutation of queue) {
    try {
      await replayMutation(mutation);
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
