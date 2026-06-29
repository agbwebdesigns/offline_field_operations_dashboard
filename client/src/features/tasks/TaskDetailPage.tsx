import { Link, useParams } from "react-router-dom";

import { Button } from "../../shared/components/Button";
import { PageHeader } from "../../shared/components/PageHeader";
import { StatusBadge } from "../../shared/components/StatusBadge";

const checklistItems = [
  {
    id: "item-001",
    label: "Verify site access and safety conditions",
    completed: true,
  },
  {
    id: "item-002",
    label: "Inspect equipment for visible damage",
    completed: true,
  },
  {
    id: "item-003",
    label: "Record current operating status",
    completed: false,
  },
  {
    id: "item-004",
    label: "Submit completion notes",
    completed: false,
  },
];

export function TaskDetailPage() {
  const { taskId } = useParams();

  return (
    <div className="page-stack">
      <Link to="/tasks" className="back-link">
        ← Back to tasks
      </Link>

      <PageHeader
        eyebrow={`Task ${taskId}`}
        title="Inspect backup generator"
        description="Complete the checklist, update the task status, and add field notes. Changes can be queued locally while offline."
      />

      <section className="detail-grid">
        <article className="card">
          <div className="card-header">
            <div>
              <h3>Task Details</h3>
              <p>North Utility Building</p>
            </div>
            <StatusBadge status="IN_PROGRESS" />
          </div>

          <div className="detail-list">
            <div>
              <span>Priority</span>
              <strong>High</strong>
            </div>
            <div>
              <span>Due</span>
              <strong>Today</strong>
            </div>
            <div>
              <span>Assigned to</span>
              <strong>Field User</strong>
            </div>
            <div>
              <span>Server version</span>
              <strong>v4</strong>
            </div>
          </div>

          <label>
            Status
            <select defaultValue="in-progress">
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <div className="button-row">
            <Button type="button">Save Status</Button>
            <Button type="button" variant="secondary">
              Queue Offline Change
            </Button>
          </div>
        </article>

        <article className="card">
          <div className="card-header">
            <div>
              <h3>Checklist</h3>
              <p>2 of 4 items completed</p>
            </div>
          </div>

          <div className="checklist">
            {checklistItems.map((item) => (
              <label key={item.id} className="checklist-item">
                <input type="checkbox" defaultChecked={item.completed} />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="card notes-card">
          <div className="card-header">
            <div>
              <h3>Field Notes</h3>
              <p>Notes are saved with the task timeline.</p>
            </div>
          </div>

          <div className="note-list">
            <div className="note">
              <strong>Field User</strong>
              <p>Generator enclosure was accessible. No external damage found.</p>
            </div>
          </div>

          <label>
            Add note
            <textarea placeholder="Add a field note..." rows={4} />
          </label>

          <Button type="button">Add Note</Button>
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
              <strong>Pending queue:</strong> 1 local change
            </p>
            <p>
              <strong>Conflict detection:</strong> compares client version to server version
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
