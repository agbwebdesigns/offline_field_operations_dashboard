import { beforeEach, describe, expect, it } from "vitest";

import { offlineQueueStorage } from "./offlineQueueStorage";

describe("offlineQueueStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with an empty queue", () => {
    expect(offlineQueueStorage.getAll()).toEqual([]);
  });

  it("adds a pending mutation", () => {
    const mutation = offlineQueueStorage.add({
      type: "UPDATE_TASK_STATUS",
      payload: {
        taskId: "task-1",
        status: "IN_PROGRESS",
        expectedVersion: 3,
      },
    });

    expect(mutation.id).toBeTruthy();
    expect(mutation.createdAt).toBeTruthy();

    expect(offlineQueueStorage.getAll()).toHaveLength(1);
    expect(offlineQueueStorage.getAll()[0]).toMatchObject({
      type: "UPDATE_TASK_STATUS",
      payload: {
        taskId: "task-1",
        status: "IN_PROGRESS",
        expectedVersion: 3,
      },
    });
  });

  it("removes a pending mutation", () => {
    const mutation = offlineQueueStorage.add({
      type: "CREATE_TASK_NOTE",
      payload: {
        taskId: "task-1",
        body: "Queued note",
        expectedVersion: 2,
      },
    });

    offlineQueueStorage.remove(mutation.id);

    expect(offlineQueueStorage.getAll()).toEqual([]);
  });

  it("clears the queue", () => {
    offlineQueueStorage.add({
      type: "UPDATE_CHECKLIST_ITEM",
      payload: {
        taskId: "task-1",
        itemId: "item-1",
        completed: true,
        expectedVersion: 4,
      },
    });

    offlineQueueStorage.clear();

    expect(offlineQueueStorage.getAll()).toEqual([]);
  });
});
