# Due – Task Manager Frontend

React (Vite) frontend for the FastAPI Task Manager API.

## Run locally

1. Start the backend (`uvicorn app.main:app --reload`, port 8000).
2. In this folder:

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev
```

3. Open http://localhost:5173

The backend must allow this origin in its CORS settings:
`http://localhost:5173` and `http://127.0.0.1:5173`.

## Structure

```
src/
  api/client.js          fetch wrapper + authApi / tasksApi
  context/AuthContext    token, current user, login / register / logout
  hooks/useTasks         task state + create / update / toggle / delete
  hooks/useNow           clock that ticks every 30s (for countdowns)
  lib/dates.js           due-date formatting, countdown, grouping
  components/            AuthScreen, TopBar, TaskForm, TaskRow, TaskGroup
  pages/Board.jsx        the main screen
```

## Features

- Register / sign in with JWT (stored in localStorage)
- Create, edit, delete, and complete tasks
- Tasks grouped by deadline: Overdue, Due today, Next 7 days, Later, Done
- Live countdown per task, auto-refresh every minute
- Session expiry handled: a 401 signs the user out with a message
