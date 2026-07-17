import { describe, expect, it } from "vitest";

import { api } from "../../test/testClient.js";

describe("auth routes", () => {
  it("logs in with a valid demo user", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({
        email: "field@example.com",
        password: "password123",
      })
      .expect(200);

    expect(response.body).toMatchObject({
      user: {
        email: "field@example.com",
        role: "FIELD_USER",
      },
    });

    expect(typeof response.body.token).toBe("string");
    expect(response.body.token.length).toBeGreaterThan(20);
  });

  it("rejects an invalid password", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({
        email: "field@example.com",
        password: "wrongpassword",
      })
      .expect(401);

    expect(response.body).toMatchObject({
      message: "Invalid email or password",
    });
  });

  it("rejects /me without a token", async () => {
    const response = await api.get("/api/auth/me").expect(401);

    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });
});
