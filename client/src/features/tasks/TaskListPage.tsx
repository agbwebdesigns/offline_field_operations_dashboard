import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { EmptyState } from "../../shared/components/EmptyState";
import { ErrorState } from "../../shared/components/ErrorState";
import { LoadingState } from "../../shared/components/LoadingState";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusBadge } from "../../shared/components/StatusBadge";
import { getTasks } from "./api";
import { formatDueDate, formatPriority } from "./formatters";
import type { Priority, TaskStatus } from "./types";

const defaultFilters: {
  q?: string;
  status?: TaskStatus;
  priority?: Priority;
} = {};

export function TaskListPage() {
  const tasksQuery = useQuery({
    queryKey: ["tasks", defaultFilters],
    queryFn: () => getTasks(defaultFilters),
  });

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Assigned Work"
        title="Field Tasks"
        description="Review assigned work, filter by task state, and continue updates even when connectivity is unreliable."
      />

      <section className="toolbar" aria-label="Task filters">
        <label>
          Search
          <input type="search" placeholder="Search tasks..." disabled />
        </label>

        <label>
          Status
          <select defaultValue="" disabled>
            <option value="">All statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>

        <label>
          Priority
          <select defaultValue="" disabled>
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </label>
      </section>

      {tasksQuery.isLoading ? <LoadingState message="Loading field tasks..." /> : null}

      {tasksQuery.isError ? (
        <ErrorState
          message={
            tasksQuery.error instanceof Error ? tasksQuery.error.message : "Unable to load tasks."
          }
          onRetry={() => void tasksQuery.refetch()}
        />
      ) : null}

      {tasksQuery.isSuccess && tasksQuery.data.tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          message="There are no field tasks matching the current filters."
        />
      ) : null}

      {tasksQuery.isSuccess && tasksQuery.data.tasks.length > 0 ? (
        <section className="card">
          <div className="card-header">
            <div>
              <h3>Task Queue</h3>
              <p>{tasksQuery.data.tasks.length} active tasks</p>
            </div>
          </div>

          <div className="task-list">
            {tasksQuery.data.tasks.map((task) => (
              <Link key={task.id} to={`/tasks/${task.id}`} className="task-row">
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.location ?? "No location assigned"}</p>
                  <p>
                    Checklist: {task.checklistSummary.completed}/{task.checklistSummary.total}
                  </p>
                </div>

                <div className="task-meta">
                  <span>{formatPriority(task.priority)}</span>
                  <span>{formatDueDate(task.dueDate)}</span>
                  <StatusBadge status={task.status} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
