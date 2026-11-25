import TaskRow from "./TaskRow.jsx";

export default function TaskGroup({ group, tasks, now, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) return null;

  return (
    <div className={"group " + group.key}>
      <div className="group-head">
        <h3>{group.title}</h3>
        <span className="count">{tasks.length}</span>
        {group.hint && <span className="hint">{group.hint}</span>}
      </div>
      <ul className="task-list">
        {tasks.map((t) => (
          <TaskRow key={t.task_id} task={t} now={now}
            onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}
