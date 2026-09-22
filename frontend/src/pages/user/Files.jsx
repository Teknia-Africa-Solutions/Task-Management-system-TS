import { useState, useEffect, useRef } from "react";
import { FileText, Upload, Download, Trash2 } from "lucide-react";
import { getMyProjects } from "../../services/projectService";
import { getProjectFiles, uploadFile, downloadFile, deleteFile } from "../../services/fileService";

export default function Files() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getMyProjects();
        setProjects(data);
        if (data.length > 0) setSelectedProjectId(data[0].id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    async function loadFiles() {
      try {
        const data = await getProjectFiles(selectedProjectId);
        setFiles(data);
      } catch (err) {
        setError(err.message);
      }
    }
    loadFiles();
  }, [selectedProjectId]);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadFile(selectedProjectId, file);
      const updated = await getProjectFiles(selectedProjectId);
      setFiles(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      e.target.value = "";
    }
  };

  const handleDownload = async (file) => {
    try {
      await downloadFile(file.id, file.name);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading...</p>;
  }

  if (projects.length === 0) {
    return <p className="text-sm text-[#6B7280] text-center py-10">No projects to show files for yet.</p>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelected}
        className="hidden"
      />

      <div className="flex items-center justify-between bg-white border border-black/5 rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#FFF0E2] flex items-center justify-center">
            <FileText size={18} className="text-[#C2610F]" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#6B7280] uppercase">Project</p>
            <select
              value={selectedProjectId || ""}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="text-lg font-bold text-[#1F2937] border-none focus:outline-none bg-transparent"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#05620C] hover:bg-[#034A09] transition"
        >
          <Upload size={16} />
          Upload File
        </button>
      </div>

      <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="font-semibold text-[#1F2937]">Project Files</h2>
          <span className="text-xs text-[#6B7280]">{files.length} items</span>
        </div>

        {files.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280] py-10">No files uploaded to this project yet.</p>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between px-5 py-3 border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={16} className="text-[#C2610F] shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1F2937] truncate">{file.name}</p>
                  <p className="text-xs text-[#6B7280]">
                    Uploaded by {file.uploadedBy || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => handleDownload(file)} className="text-[#6B7280] hover:text-[#05620C]" aria-label="Download">
                  <Download size={16} />
                </button>
                <button onClick={() => handleDelete(file.id)} className="text-[#6B7280] hover:text-red-600" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}