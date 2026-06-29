import type { Request, Response } from "express";

import { getTaskById, getTasks, isValidPriority, isValidTaskStatus } from "./task.service.js";
import type { TaskListQuery } from "./task.types.js";

export const listTasks = async (req: Request, res: Response) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined;
  const statusParam = typeof req.query.status === "string" ? req.query.status : undefined;
  const priorityParam = typeof req.query.priority === "string" ? req.query.priority : undefined;

  const query: TaskListQuery = {};

  if (q) {
    query.q = q;
  }

  if (statusParam) {
    if (!isValidTaskStatus(statusParam)) {
      res.status(400).json({
        message: "Invalid task status filter",
        validStatuses: ["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"],
      });
      return;
    }

    query.status = statusParam;
  }

  if (priorityParam) {
    if (!isValidPriority(priorityParam)) {
      res.status(400).json({
        message: "Invalid priority filter",
        validPriorities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      });
      return;
    }

    query.priority = priorityParam;
  }

  const tasks = await getTasks(query);

  res.json({
    tasks,
  });
};

export const getTaskDetail = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  if (typeof taskId !== "string") {
    res.status(400).json({
      message: "Task id is required",
    });
    return;
  }

  const task = await getTaskById(taskId);

  if (!task) {
    res.status(404).json({
      message: "Task not found",
    });
    return;
  }

  res.json({
    task,
  });
};
