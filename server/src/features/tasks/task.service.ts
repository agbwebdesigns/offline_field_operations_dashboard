import { prisma } from "../../lib/prisma.js";
import type { AuthUser } from "../../types/auth.js";

import type { PriorityFilter, TaskListQuery, TaskStatusFilter } from "./task.types.js";

const validStatuses: TaskStatusFilter[] = ["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"];

const validPriorities: PriorityFilter[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const isValidTaskStatus = (status: string): status is TaskStatusFilter => {
  return validStatuses.includes(status as TaskStatusFilter);
};

export const isValidPriority = (priority: string): priority is PriorityFilter => {
  return validPriorities.includes(priority as PriorityFilter);
};

export const getTasks = async (query: TaskListQuery, user: AuthUser) => {
  const roleVisibilityWhere = getTaskVisibilityWhere(user);

  const where = {
    ...roleVisibilityWhere,
    ...(query.status ? { status: query.status } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
    ...(query.q
      ? {
          OR: [
            {
              title: {
                contains: query.q,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: query.q,
                mode: "insensitive" as const,
              },
            },
            {
              location: {
                contains: query.q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const tasks = await prisma.task.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      status: true,
      priority: true,
      dueDate: true,
      version: true,
      createdAt: true,
      updatedAt: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      checklistItems: {
        select: {
          completed: true,
        },
      },
    },
    orderBy: [
      {
        dueDate: "asc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });

  return tasks.map((task) => {
    const completedChecklistItems = task.checklistItems.filter((item) => item.completed).length;

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      location: task.location,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      version: task.version,
      assignedTo: task.assignedTo,
      checklistSummary: {
        total: task.checklistItems.length,
        completed: completedChecklistItems,
      },
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  });
};

export const getTaskById = async (taskId: string, user: AuthUser) => {
  const roleVisibilityWhere = getTaskVisibilityWhere(user);

  return prisma.task.findFirst({
    where: {
      id: taskId,
      ...roleVisibilityWhere,
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      status: true,
      priority: true,
      dueDate: true,
      version: true,
      createdAt: true,
      updatedAt: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      checklistItems: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          label: true,
          completed: true,
          order: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      notes: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });
};

const getTaskVisibilityWhere = (user: AuthUser) => {
  if (user.role === "ADMIN") {
    return {};
  }

  if (user.role === "MANAGER") {
    return {
      createdById: user.id,
    };
  }

  return {
    assignedToId: user.id,
  };
};
