const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...opts.headers,
    ...authHeaders(),
  };
  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function register({ name, email, password }) {
  return request("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
}

export async function login({ email, password }) {
  return request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function getMe() {
  return request("/api/auth/me");
}

export async function fetchMessages() {
  return request("/api/messages");
}

export async function postMessage(text) {
  return request("/api/messages", { method: "POST", body: JSON.stringify({ text }) });
}

export async function fetchUsers() {
  return request("/api/auth/all");
}

export async function sendRequest(toUserId, text = "") {
  return request("/api/requests", {
    method: "POST",
    body: JSON.stringify({ to: toUserId, text }),
  });
}

export async function fetchRequests() {
  return request("/api/requests");
}

export async function acceptRequest(requestId) {
  return request(`/api/requests/${requestId}/accept`, { method: "POST" });
}

export async function rejectRequest(requestId) {
  return request(`/api/requests/${requestId}/reject`, { method: "POST" });
}

