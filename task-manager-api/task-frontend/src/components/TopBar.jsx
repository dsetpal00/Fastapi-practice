import { useAuth } from "../context/AuthContext.jsx";

export default function TopBar() {
  const { user, logout } = useAuth();
  return (
    <header className="topbar">
      <div className="wordmark">Due</div>
      <div className="who">
        <span>{user ? user.email : ""}</span>
        <button className="btn-quiet" onClick={() => logout()}>Sign out</button>
      </div>
    </header>
  );
}
