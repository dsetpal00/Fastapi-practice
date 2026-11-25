import { useMemo, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskGroup from "../components/TaskGroup.jsx";
import { useTasks } from "../hooks/useTasks.js";
import { useNow } from "../hooks/useNow.js";
import { GROUPS, groupTasks } from "../lib/dates.js";

export default function Board() {
  const now = useNow();
  const { tasks, error, saveTask, toggleTask, removeTask } = useTasks();
  const [editing, setEditing] = useState(null);

  const grouped = useMemo(() => groupTasks(tasks, now), [tasks, now]);

  async function handleSave(values) {
    const ok = await saveTask(values, editing);
    if (ok) setEditing(null);
    return ok;
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    const ok = await removeTask(task);
    if (ok && editing && editing.task_id === task.task_id) setEditing(null);
  }

  return (
    <>
      <TopBar />
      <main className="board">
        <TaskForm editing={editing} onSave={handleSave} onCancel={() => setEditing(null)} />

        <section aria-live="polite">
          {error && <div className="alert" role="alert">{error}</div>}
          {tasks === null && !error && <p className="loading">Loading your tasks</p>}

          {tasks !== null && (
            <>
              <div className="summary">
                {grouped.overdue.length > 0 && (
                  <span className="bad">{grouped.overdue.length} overdue. </span>
                )}
                {grouped.today.length > 0
                  ? <span>{grouped.today.length} due today.</span>
                  : <span className="quiet">Nothing due today.</span>}
              </div>

              {tasks.length === 0 && (
                <p className="empty">No tasks yet. Add your first one with the form.</p>
              )}

              {GROUPS.map((g) => (
                <TaskGroup key={g.key} group={g} tasks={grouped[g.key]} now={now}
                  onToggle={toggleTask} onEdit={setEditing} onDelete={handleDelete} />
              ))}
            </>
          )}
        </section>
      </main>
    </>
  );
}
