import type { Request, Response } from "express";

import {
  createTaskNote,
  getTaskById,
  getTasks,
  isValidPriority,
  isValidTaskStatus,
  updateChecklistItem,
  updateTaskStatus,
} from "./task.service.js";
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

  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const tasks = await getTasks(query, req.user);

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

  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const task = await getTaskById(taskId, req.user);

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

export const updateTaskStatusController = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  if (typeof taskId !== "string") {
    res.status(400).json({
      message: "Task id is required",
    });
    return;
  }

  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const { status } = req.body as {
    status?: unknown;
  };

  if (typeof status !== "string" || !isValidTaskStatus(status)) {
    res.status(400).json({
      message: "A valid task status is required",
      validStatuses: ["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"],
    });
    return;
  }

  const updatedTask = await updateTaskStatus(taskId, req.user, status);

  if (!updatedTask) {
    res.status(404).json({
      message: "Task not found",
    });
    return;
  }

  res.json({
    task: updatedTask,
  });
};

export const updateChecklistItemController = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const itemId = req.params.itemId;

  if (typeof taskId !== "string" || typeof itemId !== "string") {
    res.status(400).json({
      message: "Task id and checklist item id are required",
    });
    return;
  }

  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const { completed } = req.body as {
    completed?: unknown;
  };

  if (typeof completed !== "boolean") {
    res.status(400).json({
      message: "completed must be a boolean",
    });
    return;
  }

  const result = await updateChecklistItem(taskId, itemId, req.user, completed);

  if (!result) {
    res.status(404).json({
      message: "Task or checklist item not found",
    });
    return;
  }

  res.json(result);
};

export const createTaskNoteController = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  if (typeof taskId !== "string") {
    res.status(400).json({
      message: "Task id is required",
    });
    return;
  }

  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const { body } = req.body as {
    body?: unknown;
  };

  if (typeof body !== "string" || body.trim().length === 0) {
    res.status(400).json({
      message: "Note body is required",
    });
    return;
  }

  if (body.trim().length > 1000) {
    res.status(400).json({
      message: "Note body must be 1000 characters or fewer",
    });
    return;
  }

  const result = await createTaskNote(taskId, req.user, body.trim());

  if (!result) {
    res.status(404).json({
      message: "Task not found",
    });
    return;
  }

  res.status(201).json(result);
};
