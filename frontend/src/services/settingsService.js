const API_URL = "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getSettings() {
  const res = await fetch(`${API_URL}/settings`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load settings");
  return data;
}

export async function updateSetting(key, value) {
  const res = await fetch(`${API_URL}/settings/${key}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ value }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update setting");
  return data;
}