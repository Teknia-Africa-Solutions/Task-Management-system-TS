const API_URL = "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getReportSummary() {
  const res = await fetch(`${API_URL}/reports/summary`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load report data");
  return data;
}