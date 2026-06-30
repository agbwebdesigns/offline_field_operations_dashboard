import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

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
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const queryClient = useQueryClient();

  const logout = () => {
    authStorage.clear();
    queryClient.clear();
    navigate("/login");
  };

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

          <div className="connection-pill" aria-label="Connection status">
            Online
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
