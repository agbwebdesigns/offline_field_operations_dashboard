import type { ReactNode } from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOfflineQueue } from "../../features/offline/useOfflineQueue";
import { useOnlineStatus } from "../../features/offline/useOnlineStatus";
import { syncOfflineQueue } from "../../features/offline/syncOfflineQueue";
import { authStorage } from "../../features/auth/authStorage";
import { Button } from "./Button";

type AppLayoutProps = {
  children: ReactNode;
};

const formatRole = (role: string) => {
  return role
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export function AppLayout({ children }: AppLayoutProps) {
  const [lastConflictCount, setLastConflictCount] = useState(0);

  const navigate = useNavigate();
  const user = authStorage.getUser();
  const queryClient = useQueryClient();

  const logout = () => {
    authStorage.clear();
    queryClient.clear();
    navigate("/login");
  };

  const isOnline = useOnlineStatus();
  const { pendingCount } = useOfflineQueue();

  const syncMutation = useMutation({
    mutationFn: () => syncOfflineQueue(),
    onSuccess: async (result) => {
      setLastConflictCount(result.conflictCount);
      await queryClient.invalidateQueries();
    },
  });

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark">OF</span>
          <div>
            <strong>Offline Field Ops</strong>
            <span>Operations Dashboard</span>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/tasks">Tasks</NavLink>
        </nav>

        <div className="offline-panel">
          <span>Pending sync</span>
          <strong>{pendingCount}</strong>

          <Button
            type="button"
            variant="secondary"
            onClick={() => syncMutation.mutate()}
            disabled={!isOnline || pendingCount === 0 || syncMutation.isPending}
          >
            {syncMutation.isPending ? "Syncing..." : "Sync now"}
          </Button>

          {syncMutation.isError ? (
            <small className="sync-error">Some changes could not sync.</small>
          ) : null}

          {lastConflictCount > 0 ? (
            <small className="sync-warning">
              {lastConflictCount} change{lastConflictCount === 1 ? "" : "s"} had a version conflict
              and were not applied.
            </small>
          ) : null}
        </div>

        {user ? (
          <div className="sidebar-user">
            <span>Signed in as</span>
            <strong>{user.name}</strong>
            <small>{formatRole(user.role)}</small>
            <Button type="button" variant="secondary" onClick={logout}>
              Log out
            </Button>
          </div>
        ) : null}
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Field Operations</p>
            <h1>Offline Field Operations Dashboard</h1>
          </div>

          <div
            className={`connection-pill ${isOnline ? "" : "connection-pill-offline"}`}
            aria-label="Connection status"
          >
            {isOnline ? "Online" : "Offline"}
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
