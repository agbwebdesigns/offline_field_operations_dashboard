import { useCallback, useSyncExternalStore } from "react";

import { offlineQueueStorage } from "./offlineQueueStorage";

const QUEUE_CHANGED_EVENT = "offline-queue-changed";

export const notifyOfflineQueueChanged = () => {
  window.dispatchEvent(new Event(QUEUE_CHANGED_EVENT));
};

const subscribe = (callback: () => void) => {
  window.addEventListener(QUEUE_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(QUEUE_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

const getSnapshot = () => {
  return offlineQueueStorage.getAll().length;
};

export const useOfflineQueue = () => {
  const pendingCount = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const refreshQueue = useCallback(() => {
    notifyOfflineQueueChanged();
  }, []);

  return {
    pendingCount,
    refreshQueue,
  };
};
