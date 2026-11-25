import { formatDue, timeLeft } from "../lib/dates.js";

export default function TaskRow({ task, now, onToggle, onEdit, onDelete }) {
  const due = new Date(task.due_date);
  const done = task.status === "completed";
  const left = timeLeft(due, now);

  const leftClass = left.late ? " late" : left.soon ? " soon" : "";
  const leftLabel = left.late
    ? `${left.small} overdue`.trim()
    : left.small ? `${left.small} left` : "left";

  return (
    <li className={"task" + (done ? " is-done" : "")}>
      <button
        className="check"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        onClick={() => onToggle(task)}
      >
        {done && (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div>
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">{formatDue(due)}</div>
        <div className="task-actions">
          <button className="btn-quiet" onClick={() => onEdit(task)}>Edit</button>
          <button className="btn-quiet danger" onClick={() => onDelete(task)}>Delete</button>
        </div>
      </div>

      {done ? (
        <div className="left done"><div className="big">Done</div></div>
      ) : (
        <div className={"left" + leftClass}>
          <div className="big">{left.big}</div>
          <div className="small">{leftLabel}</div>
        </div>
      )}
    </li>
  );
}
