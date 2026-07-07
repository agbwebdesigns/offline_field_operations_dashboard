import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createTaskNoteController,
  getTaskDetail,
  listTasks,
  updateChecklistItemController,
  updateTaskStatusController,
} from "./task.controller.js";

export const taskRouter = Router();

taskRouter.get("/", requireAuth, asyncHandler(listTasks));
taskRouter.get("/:taskId", requireAuth, asyncHandler(getTaskDetail));

taskRouter.patch("/:taskId/status", requireAuth, asyncHandler(updateTaskStatusController));
taskRouter.patch(
  "/:taskId/checklist/:itemId",
  requireAuth,
  asyncHandler(updateChecklistItemController),
);

taskRouter.post("/:taskId/notes", requireAuth, asyncHandler(createTaskNoteController));
