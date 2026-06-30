import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../shared/components/Button";
import { login } from "./api";
import { authStorage } from "./authStorage";
import type { LoginInput } from "./types";

const demoAccounts = [
  {
    label: "Admin",
    email: "admin@example.com",
  },
  {
    label: "Manager",
    email: "manager@example.com",
  },
  {
    label: "Field User",
    email: "field@example.com",
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<LoginInput>({
    email: "field@example.com",
    password: "password123",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);

      queryClient.clear();

      navigate("/tasks");
    },
  });

  const updateField = (key: keyof LoginInput, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submitLogin = () => {
    loginMutation.mutate(form);
  };

  const onDemoAccount = (email: string) => {
    setForm({
      email,
      password: "password123",
    });
  };

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

        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            submitLogin();
          }}
        >
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          </label>

          {loginMutation.isError ? (
            <p className="form-error" role="alert">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "Unable to sign in."}
            </p>
          ) : null}

          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="demo-logins">
          <p>Demo accounts</p>
          <div>
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="secondary"
                onClick={() => onDemoAccount(account.email)}
              >
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
