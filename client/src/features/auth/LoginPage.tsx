import { Button } from "../../shared/components/Button";

export function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div>
          <p className="eyebrow">Demo Login</p>
          <h1>Offline Field Operations Dashboard</h1>
          <p>
            Sign in as a demo user to view assigned tasks, update field work, and test offline sync
            behavior.
          </p>
        </div>

        <form className="form-stack">
          <label>
            Email
            <input type="email" defaultValue="field@example.com" />
          </label>

          <label>
            Password
            <input type="password" defaultValue="password123" />
          </label>

          <Button type="button">Sign in</Button>
        </form>

        <div className="demo-logins">
          <p>Demo accounts</p>
          <div>
            <Button type="button" variant="secondary">
              Admin
            </Button>
            <Button type="button" variant="secondary">
              Manager
            </Button>
            <Button type="button" variant="secondary">
              Field User
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
