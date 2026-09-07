import { FileText, Sheet, Image, Upload, Download, Trash2 } from "lucide-react"; // flagging: verify these exact names, especially "Sheet"

const files = [
  { id: 1, name: "Database_Schema_v2.sql", size: "2.4 MB", uploadedBy: "Mike", icon: FileText, color: "#C2610F" },
  { id: 2, name: "Q3_Financial_Forecast.xlsx", size: "1.8 MB", uploadedBy: "Elina", icon: Sheet, color: "#05620C" },
  { id: 3, name: "UI_Spec.png", size: "8.1 MB", uploadedBy: "Jane", icon: Image, color: "#3B5B74" },
  { id: 4, name: "API_Doc.pdf", size: "512 KB", uploadedBy: "Nova", icon: FileText, color: "#B91C1C" },
  { id: 5, name: "Architecture.png", size: "4.3 MB", uploadedBy: "Brian", icon: Image, color: "#3B5B74" },
];

export default function Files() {
  return (
    <div className="space-y-6">
      {/* Stat + upload */}
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#05620C] hover:bg-[#034A09] transition">
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

        <div className="grid grid-cols-[1fr_100px_120px_80px] gap-4 px-5 py-2 text-[10px] font-semibold text-[#6B7280] uppercase border-b border-black/5">
          <span>Name</span>
          <span>Size</span>
          <span>Uploaded By</span>
          <span>Actions</span>
        </div>

        {files.map((file) => {
          const Icon = file.icon;
          return (
            <div
              key={file.id}
              className="grid grid-cols-[1fr_100px_120px_80px] gap-4 items-center px-5 py-3 border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${file.color}1A` }}
                >
                  <Icon size={16} style={{ color: file.color }} />
                </div>
                <span className="text-sm font-medium text-[#1F2937] truncate">{file.name}</span>
              </div>
              <span className="text-sm text-[#6B7280]">{file.size}</span>
              <span className="text-sm text-[#6B7280]">{file.uploadedBy}</span>
              <div className="flex items-center gap-3">
                <button className="text-[#6B7280] hover:text-[#05620C]" aria-label="Download">
                  <Download size={16} />
                </button>
                <button className="text-[#6B7280] hover:text-red-600" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}