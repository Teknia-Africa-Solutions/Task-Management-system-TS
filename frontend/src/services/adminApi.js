// frontend/src/services/adminApi.js

const API_BASE = "http://localhost:3000/api";

const getToken = () => localStorage.getItem("adminToken");

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
};

export const adminApi = {
  getUsers: () => apiFetch("/admin/users"),
  getProjects: () => apiFetch("/admin/projects"),
  getTasks: () => apiFetch("/admin/tasks"),
  getNotifications: () => apiFetch("/admin/notifications"),
  getTeams: () => apiFetch("/admin/teams"),
  getReportsSummary: () => apiFetch("/admin/reports/summary"),
  getAuditLogs: () => apiFetch("/admin/audit-logs"),

  login: (email, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
};