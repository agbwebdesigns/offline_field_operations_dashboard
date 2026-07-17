import { describe, expect, it } from "vitest";

import { api } from "../../test/testClient.js";

const login = async (email: string) => {
  const response = await api
    .post("/api/auth/login")
    .send({
      email,
      password: "password123",
    })
    .expect(200);

  return response.body.token as string;
};

describe("task routes", () => {
  it("rejects task list requests without a token", async () => {
    const response = await api.get("/api/tasks").expect(401);

    expect(response.body).toMatchObject({
      message: "Authentication required",
    });
  });

  it("limits field users to assigned tasks", async () => {
    const token = await login("field@example.com");

    const response = await api
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body.tasks)).toBe(true);
    expect(response.body.tasks.length).toBeGreaterThan(0);

    for (const task of response.body.tasks) {
      expect(task.assignedTo?.email).toBe("field@example.com");
    }
  });

  it("returns 409 when expectedVersion is stale", async () => {
    const token = await login("field@example.com");

    const listResponse = await api
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const task = listResponse.body.tasks[0];

    expect(task).toBeTruthy();

    const response = await api
      .patch(`/api/tasks/${task.id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "IN_PROGRESS",
        expectedVersion: Math.max(1, task.version - 1),
      })
      .expect(409);

    expect(response.body).toMatchObject({
      code: "VERSION_CONFLICT",
    });
  });
});
