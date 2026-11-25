// Backend ka address .env ke VITE_API_URL se aata hai
export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// FastAPI ka error ya to string hota hai (HTTPException) ya list (validation 422)
function readDetail(data, fallback) {
  if (!data || !data.detail) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((d) => `${(d.loc || []).slice(1).join(".")}: ${d.msg}`)
      .join("; ");
  }
  return fallback;
}

async function request(path, { method = "GET", body, form, token } = {}) {
  const headers = {};
  let payload;

  if (token) headers.Authorization = `Bearer ${token}`;

  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form);
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(API_URL + path, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, `Can't reach the server at ${API_URL}. Check that the backend is running.`);
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, readDetail(data, `Request failed (${res.status}).`));
  return data;
}

export const authApi = {
  register: (email, password) => request("/users/", { method: "POST", body: { email, password } }),
  // OAuth2 form mein email ka field "username" hota hai
  login: (email, password) => request("/auth/login", { method: "POST", form: { username: email, password } }),
  me: (token) => request("/users/me", { token }),
};

export const tasksApi = {
  list: (token) => request("/tasks/?limit=100", { token }),
  create: (token, values) => request("/tasks/", { method: "POST", token, body: values }),
  update: (token, id, values) => request(`/tasks/${id}`, { method: "PUT", token, body: values }),
  remove: (token, id) => request(`/tasks/${id}`, { method: "DELETE", token }),
};
