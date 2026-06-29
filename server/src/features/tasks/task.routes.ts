import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getTaskDetail, listTasks } from "./task.controller.js";

export const taskRouter = Router();

taskRouter.get("/", requireAuth, asyncHandler(listTasks));
taskRouter.get("/:taskId", requireAuth, asyncHandler(getTaskDetail));
