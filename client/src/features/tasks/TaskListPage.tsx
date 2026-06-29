import { Link } from "react-router-dom";

import { PageHeader } from "../../shared/components/PageHeader";
import { StatusBadge } from "../../shared/components/StatusBadge";

const tasks = [
  {
    id: "task-001",
    title: "Inspect backup generator",
    location: "North Utility Building",
    priority: "High",
    status: "In Progress" as const,
    dueDate: "Today",
  },
  {
    id: "task-002",
    title: "Verify pump station pressure",
    location: "Pump Station 3",
    priority: "Critical",
    status: "Blocked" as const,
    dueDate: "Tomorrow",
  },
  {
    id: "task-003",
    title: "Replace damaged access panel",
    location: "West Service Corridor",
    priority: "Medium",
    status: "Todo" as const,
    dueDate: "Friday",
  },
  {
    id: "task-004",
    title: "Document utility room water leak",
    location: "Basement Utility Room",
    priority: "High",
    status: "Pending Sync" as const,
    dueDate: "Today",
  },
];

export function TaskListPage() {
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
          <input type="search" placeholder="Search tasks..." />
        </label>

        <label>
          Status
          <select defaultValue="">
            <option value="">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Priority
          <select defaultValue="">
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </label>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <h3>Task Queue</h3>
            <p>{tasks.length} active tasks</p>
          </div>
        </div>

        <div className="task-list">
          {tasks.map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`} className="task-row">
              <div>
                <h4>{task.title}</h4>
                <p>{task.location}</p>
              </div>

              <div className="task-meta">
                <span>{task.priority}</span>
                <span>{task.dueDate}</span>
                <StatusBadge status={task.status} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
