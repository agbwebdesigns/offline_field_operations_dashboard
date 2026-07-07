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

export const syncOfflineQueue = async () => {
  const queue = offlineQueueStorage.getAll();
  const syncedMutationIds: string[] = [];
  const failedMutationIds: string[] = [];

  for (const mutation of queue) {
    try {
      await replayMutation(mutation);
      syncedMutationIds.push(mutation.id);
      offlineQueueStorage.remove(mutation.id);
    } catch {
      failedMutationIds.push(mutation.id);
    }
  }

  return {
    syncedCount: syncedMutationIds.length,
    failedCount: failedMutationIds.length,
    remainingCount: offlineQueueStorage.getAll().length,
  };
};
