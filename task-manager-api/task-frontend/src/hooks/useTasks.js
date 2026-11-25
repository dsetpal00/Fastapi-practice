import { useCallback, useEffect, useState } from "react";
import { tasksApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export function useTasks() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState(null); // null = abhi load ho raha hai
  const [error, setError] = useState("");

  // Har API call isi se guzarti hai: 401 aaye to sign out, baaki errors screen pe
  const guard = useCallback(async (fn) => {
    try {
      return await fn();
    } catch (err) {
      if (err.status === 401) logout("Your session expired. Sign in again.");
      else setError(err.message);
      return undefined;
    }
  }, [logout]);

  const load = useCallback(() => guard(async () => {
    setTasks(await tasksApi.list(token));
    setError("");
  }), [token, guard]);

  useEffect(() => {
    load();
    // backend ka scheduler status badalta rehta hai, isliye har minute refresh
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [load]);

  const saveTask = (values, editing) => guard(async () => {
    if (editing) await tasksApi.update(token, editing.task_id, values);
    else await tasksApi.create(token, values);
    await load();
    return true;
  });

  const toggleTask = (task) => guard(async () => {
    const status = task.status === "completed" ? "pending" : "completed";
    await tasksApi.update(token, task.task_id, { status });
    await load();
  });

  const removeTask = (task) => guard(async () => {
    await tasksApi.remove(token, task.task_id);
    await load();
    return true;
  });

  return { tasks, error, saveTask, toggleTask, removeTask };
}
