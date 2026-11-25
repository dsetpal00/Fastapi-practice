import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthScreen() {
  const { login, register, notice } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register") await register(email, password);
      else await login(email, password);
    } catch (err) {
      if (err.status === 409) setError("That email is already registered. Sign in instead.");
      else if (err.status === 401) setError("The email or password is wrong.");
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next) {
    setMode(next);
    setError("");
  }

  return (
    <div className="auth">
      <section className="auth-intro">
        <div className="wordmark">Due</div>
        <div>
          <h1>Know what is due, and when.</h1>
          <p>Add a task with a deadline. Due sorts everything by how much time is left.</p>
        </div>
        <div className="auth-sample" aria-hidden="true">
          <span className="big">2d 4h</span>
          <span>until your next deadline</span>
        </div>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{mode === "login" ? "Sign in" : "Create your account"}</h2>

          <div className="tabs" role="tablist">
            <button type="button" role="tab" className="tab" aria-selected={mode === "login"}
              onClick={() => switchMode("login")}>Sign in</button>
            <button type="button" role="tab" className="tab" aria-selected={mode === "register"}
              onClick={() => switchMode("register")}>Register</button>
          </div>

          {notice && !error && <div className="alert notice" role="status">{notice}</div>}
          {error && <div className="alert" role="alert">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Please wait" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </div>
  );
}
