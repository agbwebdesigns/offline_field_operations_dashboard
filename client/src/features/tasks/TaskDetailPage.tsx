import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "../../shared/components/Button";
import { EmptyState } from "../../shared/components/EmptyState";
import { ErrorState } from "../../shared/components/ErrorState";
import { LoadingState } from "../../shared/components/LoadingState";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusBadge } from "../../shared/components/StatusBadge";
import { createTaskNote, getTaskById, updateChecklistItem, updateTaskStatus } from "./api";
import { formatDateTime, formatDueDate, formatPriority, formatUserRole } from "./formatters";
import type { TaskStatus } from "./types";

export function TaskDetailPage() {
  const [draftStatus, setDraftStatus] = useState<TaskStatus | null>(null);
  const { taskId } = useParams();

  const queryClient = useQueryClient();
  const [noteBody, setNoteBody] = useState("");

  const taskQuery = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById(taskId ?? ""),
    enabled: Boolean(taskId),
  });

  const refreshTask = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["task", taskId],
    });

    await queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });
  };

  const statusMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: refreshTask,
  });

  const checklistMutation = useMutation({
    mutationFn: updateChecklistItem,
    onSuccess: refreshTask,
  });

  const noteMutation = useMutation({
    mutationFn: createTaskNote,
    onSuccess: async () => {
      setNoteBody("");
      await refreshTask();
    },
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
  const selectedStatus = draftStatus ?? task.status;

  if (task && selectedStatus === "TODO" && task.status !== "TODO") {
    setDraftStatus(task.status);
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

          <label>
            Status
            <select
              value={selectedStatus}
              onChange={(event) => setDraftStatus(event.target.value as TaskStatus)}
              disabled={statusMutation.isPending}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="BLOCKED">Blocked</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>

          <div className="button-row">
            <Button
              type="button"
              onClick={() => {
                if (!taskId) {
                  return;
                }

                statusMutation.mutate({
                  taskId,
                  status: selectedStatus,
                });
              }}
              disabled={statusMutation.isPending || selectedStatus === task.status}
            >
              {statusMutation.isPending ? "Saving..." : "Save Status"}
            </Button>

            <Button type="button" variant="secondary" disabled>
              Queue Offline Change
            </Button>
          </div>

          {statusMutation.isError ? (
            <p className="form-error" role="alert">
              {statusMutation.error instanceof Error
                ? statusMutation.error.message
                : "Unable to update task status."}
            </p>
          ) : null}

          <p className="helper-text">
            Online status updates are enabled. Offline queueing will be added in a later milestone.
          </p>

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
                  <input
                    type="checkbox"
                    checked={item.completed}
                    disabled={checklistMutation.isPending}
                    onChange={(event) => {
                      if (!taskId) {
                        return;
                      }

                      checklistMutation.mutate({
                        taskId,
                        itemId: item.id,
                        completed: event.target.checked,
                      });
                    }}
                  />
                  {checklistMutation.isError ? (
                    <p className="form-error" role="alert">
                      {checklistMutation.error instanceof Error
                        ? checklistMutation.error.message
                        : "Unable to update checklist item."}
                    </p>
                  ) : null}
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

          <form
            className="form-stack"
            onSubmit={(event) => {
              event.preventDefault();

              if (!taskId || noteBody.trim().length === 0) {
                return;
              }

              noteMutation.mutate({
                taskId,
                body: noteBody.trim(),
              });
            }}
          >
            <label>
              Add note
              <textarea
                placeholder="Add a field note..."
                rows={4}
                value={noteBody}
                maxLength={1000}
                onChange={(event) => setNoteBody(event.target.value)}
                disabled={noteMutation.isPending}
              />
            </label>

            <div className="form-footer">
              <span>{noteBody.length}/1000</span>
              <Button
                type="submit"
                disabled={noteMutation.isPending || noteBody.trim().length === 0}
              >
                {noteMutation.isPending ? "Adding..." : "Add Note"}
              </Button>
            </div>

            {noteMutation.isError ? (
              <p className="form-error" role="alert">
                {noteMutation.error instanceof Error
                  ? noteMutation.error.message
                  : "Unable to add note."}
              </p>
            ) : null}
          </form>
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
