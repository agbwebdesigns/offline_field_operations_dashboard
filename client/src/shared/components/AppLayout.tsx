import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
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
          <NavLink to="/login">Login</NavLink>
        </nav>
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
