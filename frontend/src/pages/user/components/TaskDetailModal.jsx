import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateTask } from "../../../services/taskService";
function formatDate(dateString) {
  if (!dateString) return "No due date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


const statusOptions = ["Todo", "In Progress", "Review", "Done"];
const priorityOptions = ["Low", "Medium", "High"];

export default function TaskDetailModal({ task, onClose, onSaved }) {
  const [status, setStatus] = useState(task.status);
  const [description, setDescription] = useState(task.description || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setStatus(task.status);
    setDescription(task.description || "");
  }, [task]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateTask(task.id, { status, description });
      onSaved({ ...task, status, description });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h2 className="text-lg font-bold text-[#1F2937]">{task.title}</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#1F2937]">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] uppercase mb-1">Category</label>
              <p className="text-sm text-[#1F2937]">{task.category || "—"}</p>
            </div>
         <div>
  <label className="block text-xs font-medium text-[#6B7280] uppercase mb-1">Due date</label>
  <p className="text-sm text-[#1F2937]">{formatDate(task.due_date)}</p>
</div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] uppercase mb-1">Priority</label>
              <p className="text-sm text-[#1F2937]">{task.priority}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm border border-black/10 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6B7280] uppercase mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Add a description..."
              className="w-full text-sm border border-black/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#05620C]/30 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-black/5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1F2937]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-[#05620C] hover:bg-[#034A09] rounded-lg transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}