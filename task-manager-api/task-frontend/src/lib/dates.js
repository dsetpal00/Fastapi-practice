export function toInputValue(date) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

export function tomorrowMorning() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return toInputValue(d);
}

export function formatDue(date) {
  return date.toLocaleString([], {
    weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
  });
}

// Deadline mein kitna time bacha (ya kitna late)
export function timeLeft(due, now) {
  const ms = due - now;
  const abs = Math.abs(ms);
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  let big, small;
  if (days >= 1) { big = `${days}d`; small = `${hours % 24}h`; }
  else if (hours >= 1) { big = `${hours}h`; small = `${mins % 60}m`; }
  else { big = `${mins}m`; small = ""; }

  return { big, small, late: ms < 0, soon: ms >= 0 && ms < 24 * 3600 * 1000 };
}

export const GROUPS = [
  { key: "overdue", title: "Overdue" },
  { key: "today", title: "Due today" },
  { key: "week", title: "Next 7 days" },
  { key: "later", title: "Later" },
  { key: "done", title: "Done", hint: "Completed tasks are removed automatically after their due date." },
];

export function bucketOf(task, now) {
  if (task.status === "completed") return "done";
  const due = new Date(task.due_date);
  if (task.status === "expired" || due < now) return "overdue";

  const startToday = new Date(now); startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday); endToday.setDate(endToday.getDate() + 1);
  const endWeek = new Date(startToday); endWeek.setDate(endWeek.getDate() + 7);

  if (due < endToday) return "today";
  if (due < endWeek) return "week";
  return "later";
}

export function groupTasks(tasks, now) {
  const out = { overdue: [], today: [], week: [], later: [], done: [] };
  (tasks || []).forEach((t) => out[bucketOf(t, now)].push(t));

  const byDue = (a, b) => new Date(a.due_date) - new Date(b.due_date);
  ["overdue", "today", "week", "later"].forEach((k) => out[k].sort(byDue));
  out.done.sort((a, b) => byDue(b, a));
  return out;
}
