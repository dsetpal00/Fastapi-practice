import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/client.js";

const AuthContext = createContext(null);

const store = {
  get() { try { return localStorage.getItem("due.token"); } catch { return null; } },
  set(v) { try { localStorage.setItem("due.token", v); } catch { /* storage unavailable */ } },
  clear() { try { localStorage.removeItem("due.token"); } catch { /* storage unavailable */ } },
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => store.get());
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState("");

  const logout = useCallback((message) => {
    store.clear();
    setUser(null);
    setToken(null);
    setNotice(typeof message === "string" ? message : "");
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    store.set(data.access_token);
    setNotice("");
    setToken(data.access_token);
  }, []);

  const register = useCallback(async (email, password) => {
    await authApi.register(email, password);
    await login(email, password);
  }, [login]);

  // token milte hi current user ka email le aao
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    authApi.me(token)
      .then((u) => { if (!cancelled) setUser(u); })
      .catch((err) => {
        if (err.status === 401) logout("Your session expired. Sign in again.");
      });
    return () => { cancelled = true; };
  }, [token, logout]);

  const value = useMemo(
    () => ({ token, user, notice, login, register, logout }),
    [token, user, notice, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
