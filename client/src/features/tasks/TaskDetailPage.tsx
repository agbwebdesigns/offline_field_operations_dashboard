import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { EmptyState } from "../../shared/components/EmptyState";
import { ErrorState } from "../../shared/components/ErrorState";
import { LoadingState } from "../../shared/components/LoadingState";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusBadge } from "../../shared/components/StatusBadge";
import { getTaskById } from "./api";
import { formatDateTime, formatDueDate, formatPriority, formatUserRole } from "./formatters";

export function TaskDetailPage() {
  const { taskId } = useParams();

  const taskQuery = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById(taskId ?? ""),
    enabled: Boolean(taskId),
  });

  if (!taskId) {
    return (
      <div className="page-stack">
        <Link to="/tasks" className="back-link">
          ← Back to tasks
        </Link>

        <EmptyState title="Task not found" message="No task id was provided in the URL." />
      </div>
    );
  }

  if (taskQuery.isLoading) {
    return (
      <div className="page-stack">
        <Link to="/tasks" className="back-link">
          ← Back to tasks
        </Link>

        <LoadingState message="Loading task details..." />
      </div>
    );
  }

  if (taskQuery.isError) {
    return (
      <div className="page-stack">
        <Link to="/tasks" className="back-link">
          ← Back to tasks
        </Link>

        <ErrorState
          title="Unable to load task"
          message={
            taskQuery.error instanceof Error
              ? taskQuery.error.message
              : "The task details could not be loaded."
          }
          onRetry={() => void taskQuery.refetch()}
        />
      </div>
    );
  }

  const task = taskQuery.data?.task;

  if (!task) {
    return (
      <div className="page-stack">
        <Link to="/tasks" className="back-link">
          ← Back to tasks
        </Link>

        <EmptyState
          title="Task not found"
          message="This task may have been deleted or is no longer available."
        />
      </div>
    );
  }

  const completedChecklistItems = task.checklistItems.filter((item) => item.completed).length;

  return (
    <div className="page-stack">
      <Link to="/tasks" className="back-link">
        ← Back to tasks
      </Link>

      <PageHeader eyebrow={`Task ${task.id}`} title={task.title} description={task.description} />

      <section className="detail-grid">
        <article className="card">
          <div className="card-header">
            <div>
              <h3>Task Details</h3>
              <p>{task.location ?? "No location assigned"}</p>
            </div>
            <StatusBadge status={task.status} />
          </div>

          <div className="detail-list">
            <div>
              <span>Priority</span>
              <strong>{formatPriority(task.priority)}</strong>
            </div>

            <div>
              <span>Due</span>
              <strong>{formatDueDate(task.dueDate)}</strong>
            </div>

            <div>
              <span>Assigned to</span>
              <strong>{task.assignedTo?.name ?? "Unassigned"}</strong>
            </div>

            <div>
              <span>Created by</span>
              <strong>{task.createdBy.name}</strong>
            </div>

            <div>
              <span>Server version</span>
              <strong>v{task.version}</strong>
            </div>

            <div>
              <span>Last updated</span>
              <strong>{formatDateTime(task.updatedAt)}</strong>
            </div>
          </div>

          {task.assignedTo ? (
            <div className="person-card">
              <span>Assigned user</span>
              <strong>{task.assignedTo.name}</strong>
              <p>
                {task.assignedTo.email} · {formatUserRole(task.assignedTo.role)}
              </p>
            </div>
          ) : null}

          <div className="button-row">
            <button className="button button-primary" type="button" disabled>
              Save Status
            </button>
            <button className="button button-secondary" type="button" disabled>
              Queue Offline Change
            </button>
          </div>

          <p className="helper-text">
            Editing is intentionally disabled in this milestone. The next phase will add status,
            checklist, and note mutations.
          </p>
        </article>

        <article className="card">
          <div className="card-header">
            <div>
              <h3>Checklist</h3>
              <p>
                {completedChecklistItems} of {task.checklistItems.length} items completed
              </p>
            </div>
          </div>

          {task.checklistItems.length > 0 ? (
            <div className="checklist">
              {task.checklistItems.map((item) => (
                <label key={item.id} className="checklist-item">
                  <input type="checkbox" checked={item.completed} readOnly />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No checklist items"
              message="This task does not have checklist items yet."
            />
          )}
        </article>

        <article className="card notes-card">
          <div className="card-header">
            <div>
              <h3>Field Notes</h3>
              <p>Notes are saved with the task timeline.</p>
            </div>
          </div>

          {task.notes.length > 0 ? (
            <div className="note-list">
              {task.notes.map((note) => (
                <div key={note.id} className="note">
                  <div className="note-header">
                    <strong>{note.author.name}</strong>
                    <span>{formatDateTime(note.createdAt)}</span>
                  </div>
                  <p>{note.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No notes yet" message="No field notes have been added." />
          )}

          <label>
            Add note
            <textarea placeholder="Add a field note..." rows={4} disabled />
          </label>

          <button className="button button-primary" type="button" disabled>
            Add Note
          </button>
        </article>

        <article className="card conflict-card">
          <div className="card-header">
            <div>
              <h3>Offline Sync Preview</h3>
              <p>This panel will show pending updates and conflicts later.</p>
            </div>
          </div>

          <div className="sync-preview">
            <p>
              <strong>Pending queue:</strong> No pending local changes
            </p>
            <p>
              <strong>Conflict detection:</strong> Client changes will compare against server
              version v{task.version}
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
