import { useEffect, useState } from "react";
import { toInputValue, tomorrowMorning } from "../lib/dates.js";

export default function TaskForm({ editing, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState(tomorrowMorning());
  const [busy, setBusy] = useState(false);

  function reset() {
    setTitle("");
    setDescription("");
    setDue(tomorrowMorning());
  }

  // Edit dabane par form task ki values se bhar jaata hai
  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description || "");
      setDue(toInputValue(new Date(editing.due_date)));
    } else {
      reset();
    }
  }, [editing]);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    const ok = await onSave({
      title: title.trim(),
      description: description.trim() || null,
      due_date: due,
    });
    setBusy(false);
    if (ok && !editing) reset(); // naya task add hone ke baad form saaf
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <h2>{editing ? "Edit task" : "New task"}</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" type="text" required maxLength={120} value={title}
          onChange={(e) => setTitle(e.target.value)} placeholder="Finish FastAPI project" />
      </div>
      <div className="field">
        <label htmlFor="desc">Notes</label>
        <textarea id="desc" value={description}
          onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
      </div>
      <div className="field">
        <label htmlFor="due">Due</label>
        <input id="due" type="datetime-local" required value={due}
          onChange={(e) => setDue(e.target.value)} />
      </div>

      <div className="composer-actions">
        <button className="btn" type="submit" disabled={busy}>
          {editing ? "Save changes" : "Add task"}
        </button>
        {editing && <button type="button" className="btn-quiet" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
