import { useState } from "react";
import { X } from "lucide-react";
import { createUser } from "../../../services/userService";

const roleOptions = ["Member", "Admin", "SuperAdmin"];

export default function CreateUserModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const newUser = await createUser({ name, email, password, role });
      onCreated(newUser);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h2 className="text-lg font-bold text-[#1F2937]">Add New User</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#1F2937]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
              placeholder="jane@taskflow.io"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Temporary password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-sm border border-black/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1F2937]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#05620C] hover:bg-[#034A09] rounded-lg transition disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}