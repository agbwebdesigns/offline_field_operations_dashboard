import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../../shared/api/client";
import { offlineQueueStorage } from "./offlineQueueStorage";
import { syncOfflineQueue } from "./syncOfflineQueue";

describe("syncOfflineQueue", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("removes successfully synced mutations", async () => {
    offlineQueueStorage.add({
      type: "UPDATE_TASK_STATUS",
      payload: {
        taskId: "task-1",
        status: "COMPLETED",
        expectedVersion: 2,
      },
    });

    const fakeApi = {
      updateTaskStatus: vi.fn().mockResolvedValue({}),
      updateChecklistItem: vi.fn().mockResolvedValue({}),
      createTaskNote: vi.fn().mockResolvedValue({}),
    };

    const result = await syncOfflineQueue(fakeApi);

    expect(fakeApi.updateTaskStatus).toHaveBeenCalledWith({
      taskId: "task-1",
      status: "COMPLETED",
      expectedVersion: 2,
    });

    expect(result).toMatchObject({
      syncedCount: 1,
      failedCount: 0,
      conflictCount: 0,
      remainingCount: 0,
    });

    expect(offlineQueueStorage.getAll()).toEqual([]);
  });

  it("keeps failed non-conflict mutations in the queue", async () => {
    offlineQueueStorage.add({
      type: "CREATE_TASK_NOTE",
      payload: {
        taskId: "task-1",
        body: "Queued note",
        expectedVersion: 3,
      },
    });

    const fakeApi = {
      updateTaskStatus: vi.fn().mockResolvedValue({}),
      updateChecklistItem: vi.fn().mockResolvedValue({}),
      createTaskNote: vi.fn().mockRejectedValue(new Error("Server unavailable")),
    };

    const result = await syncOfflineQueue(fakeApi);

    expect(result).toMatchObject({
      syncedCount: 0,
      failedCount: 1,
      conflictCount: 0,
      remainingCount: 1,
    });

    expect(offlineQueueStorage.getAll()).toHaveLength(1);
  });

  it("removes conflicted mutations and reports conflicts", async () => {
    offlineQueueStorage.add({
      type: "UPDATE_CHECKLIST_ITEM",
      payload: {
        taskId: "task-1",
        itemId: "item-1",
        completed: true,
        expectedVersion: 1,
      },
    });

    const fakeApi = {
      updateTaskStatus: vi.fn().mockResolvedValue({}),
      updateChecklistItem: vi
        .fn()
        .mockRejectedValue(new ApiError("Task has changed", 409, { code: "VERSION_CONFLICT" })),
      createTaskNote: vi.fn().mockResolvedValue({}),
    };

    const result = await syncOfflineQueue(fakeApi);

    expect(result.conflictCount).toBe(1);
    expect(result.conflicts).toHaveLength(1);
    expect(result.remainingCount).toBe(0);
    expect(offlineQueueStorage.getAll()).toEqual([]);
  });
});
