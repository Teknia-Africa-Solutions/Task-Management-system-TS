const API_URL = "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getMyTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load tasks");
  return data;
}
export async function updateTask(taskId, updates) {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update task");
  return data;
}

