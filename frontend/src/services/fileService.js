const API_URL = "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getProjectFiles(projectId) {
  const res = await fetch(`${API_URL}/files/${projectId}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load files");
  return data;
}

export async function uploadFile(projectId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/files/${projectId}`, {
    method: "POST",
    headers: authHeaders(), // NOTE: no Content-Type here — the browser sets it automatically for FormData
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to upload file");
  return data;
}

export async function downloadFile(fileId, fileName) {
  const res = await fetch(`${API_URL}/files/download/${fileId}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to download file");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function deleteFile(fileId) {
  const res = await fetch(`${API_URL}/files/${fileId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete file");
  return data;
}