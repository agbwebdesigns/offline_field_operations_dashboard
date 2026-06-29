import { Router } from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

export const taskRouter = Router();

taskRouter.get("/", requireAuth, (_req, res) => {
  res.status(501).json({
    message: "Task list route not implemented yet",
  });
});

taskRouter.post("/", requireAuth, requireRole("ADMIN", "MANAGER"), (_req, res) => {
  res.status(501).json({
    message: "Create task route not implemented yet",
  });
});

taskRouter.get("/:taskId", requireAuth, (_req, res) => {
  res.status(501).json({
    message: "Task detail route not implemented yet",
  });
});

taskRouter.patch("/:taskId", requireAuth, (_req, res) => {
  res.status(501).json({
    message: "Update task route not implemented yet",
  });
});

taskRouter.patch("/:taskId/checklist/:itemId", requireAuth, (_req, res) => {
  res.status(501).json({
    message: "Update checklist item route not implemented yet",
  });
});

taskRouter.post("/:taskId/notes", requireAuth, (_req, res) => {
  res.status(501).json({
    message: "Create note route not implemented yet",
  });
});
