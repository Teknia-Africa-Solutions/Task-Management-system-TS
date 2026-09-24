const API_URL = "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getMyNotifications() {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load notifications");
  return data;
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_URL}/notifications/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update notification");
  return data;
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${API_URL}/notifications/read-all/mark`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update notifications");
  return data;
}