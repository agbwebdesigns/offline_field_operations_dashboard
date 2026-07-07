import type { OfflineMutation } from "./offlineQueue.types";

const notifyQueueChanged = () => {
  window.dispatchEvent(new Event("offline-queue-changed"));
};

const OFFLINE_QUEUE_KEY = "offline-field-ops-pending-mutations";

const createMutationId = () => {
  return crypto.randomUUID();
};

export const offlineQueueStorage = {
  getAll(): OfflineMutation[] {
    const storedQueue = localStorage.getItem(OFFLINE_QUEUE_KEY);

    if (!storedQueue) {
      return [];
    }

    try {
      return JSON.parse(storedQueue) as OfflineMutation[];
    } catch {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
      return [];
    }
  },

  setAll(queue: OfflineMutation[]) {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    notifyQueueChanged();
  },

  add(mutation: Omit<OfflineMutation, "id" | "createdAt">) {
    const queue = this.getAll();

    const queuedMutation = {
      ...mutation,
      id: createMutationId(),
      createdAt: new Date().toISOString(),
    } as OfflineMutation;

    const nextQueue = [...queue, queuedMutation];

    this.setAll(nextQueue);

    return queuedMutation;
  },

  remove(id: string) {
    const queue = this.getAll();
    const nextQueue = queue.filter((mutation) => mutation.id !== id);

    this.setAll(nextQueue);
  },

  clear() {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    notifyQueueChanged();
  },
};
