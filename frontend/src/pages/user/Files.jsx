import { useState, useRef } from "react";
import { FileText, Image, Upload, Download, Trash2 } from "lucide-react";
import { initialFiles } from "../../data/mockData";

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIconAndColor(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "svg"].includes(ext)) {
    return { icon: Image, color: "#3B5B74" };
  }
  return { icon: FileText, color: "#C2610F" };
}

export default function Files() {
  const [files, setFiles] = useState(initialFiles);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

const handleFileSelected = (e) => {
  const selectedFiles = Array.from(e.target.files);

  const newFileEntries = selectedFiles.map((file) => ({
    id: Date.now() + Math.random(),
    name: file.name,
    size: formatFileSize(file.size),
    uploadedBy: "You",
    fileObj: file, 
    ...getFileIconAndColor(file.name),
  }));

  setFiles((prev) => [...newFileEntries, ...prev]);

  e.target.value = "";
};

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDownload = (file) => {
  

  if (!file.fileObj) return;

  const url = URL.createObjectURL(file.fileObj);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelected}
        className="hidden"
      />

      <div className="flex items-center justify-between bg-white border border-black/5 rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#FFF0E2] flex items-center justify-center">
            <FileText size={18} className="text-[#C2610F]" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#6B7280] uppercase">Total Files</p>
            <p className="text-2xl font-bold text-[#1F2937]">{files.length}</p>
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

      {/* File table */}
      <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="font-semibold text-[#1F2937]">Workspace Files</h2>
          <span className="text-xs text-[#6B7280]">{files.length} items</span>
        </div>

        <div className="grid grid-cols-[1fr_60px] sm:grid-cols-[1fr_100px_120px_80px] gap-4 px-5 py-2 text-[10px] font-semibold text-[#6B7280] uppercase border-b border-black/5">
          <span>Name</span>
          <span className="hidden sm:block">Size</span>
          <span className="hidden sm:block">Uploaded By</span>
          <span>Actions</span>
        </div>

        {files.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280] py-10">No files uploaded yet.</p>
        ) : (
         files.map((file) => {
  const { icon: Icon, color } = getFileIconAndColor(file.name);
  return (
    <div
      key={file.id}
      className="grid grid-cols-[1fr_60px] sm:grid-cols-[1fr_100px_120px_80px] gap-4 items-center px-5 py-3 border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${color}1A` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
                  <span className="text-sm font-medium text-[#1F2937] truncate">{file.name}</span>
                </div>
                <span className="hidden sm:block text-sm text-[#6B7280]">{file.size}</span>
                <span className="hidden sm:block text-sm text-[#6B7280]">{file.uploadedBy}</span>
                <div className="flex items-center gap-3">
                  <button className="text-[#6B7280] hover:text-[#05620C]" aria-label="Download" onClick={() => handleDownload(file)}  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-[#6B7280] hover:text-red-600"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}