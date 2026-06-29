import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { ErrorState } from "../../shared/components/ErrorState";
import { LoadingState } from "../../shared/components/LoadingState";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusBadge } from "../../shared/components/StatusBadge";
import { getTasks } from "./api";
import { formatDueDate, formatPriority } from "./formatters";
import type { Priority, TaskFilters, TaskStatus } from "./types";

const validStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED"];
const validPriorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const isTaskStatus = (value: string | null): value is TaskStatus => {
  return value !== null && validStatuses.includes(value as TaskStatus);
};

const isPriority = (value: string | null): value is Priority => {
  return value !== null && validPriorities.includes(value as Priority);
};

export function TaskListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q")?.trim() || undefined;
  const statusParam = searchParams.get("status");
  const priorityParam = searchParams.get("priority");

  const filters: TaskFilters = {};

  if (q) {
    filters.q = q;
  }

  if (isTaskStatus(statusParam)) {
    filters.status = statusParam;
  }

  if (isPriority(priorityParam)) {
    filters.priority = priorityParam;
  }

  const tasksQuery = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => getTasks(filters),
  });

  const updateFilter = (key: keyof TaskFilters, value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(filters.q || filters.status || filters.priority);

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
          <input
            type="search"
            placeholder="Search tasks..."
            value={filters.q ?? ""}
            onChange={(event) => updateFilter("q", event.target.value)}
          />
        </label>

        <label>
          Status
          <select
            value={filters.status ?? ""}
            onChange={(event) => updateFilter("status", event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={filters.priority ?? ""}
            onChange={(event) => updateFilter("priority", event.target.value)}
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </label>

        <div className="toolbar-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Clear filters
          </Button>
        </div>
      </section>

      {hasActiveFilters ? (
        <section className="filter-summary" aria-label="Active task filters">
          <span>Active filters:</span>
          {filters.q ? <strong>Search: {filters.q}</strong> : null}
          {filters.status ? <strong>Status: {filters.status.replaceAll("_", " ")}</strong> : null}
          {filters.priority ? <strong>Priority: {formatPriority(filters.priority)}</strong> : null}
        </section>
      ) : null}

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
              <p>{tasksQuery.data.tasks.length} matching tasks</p>
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
