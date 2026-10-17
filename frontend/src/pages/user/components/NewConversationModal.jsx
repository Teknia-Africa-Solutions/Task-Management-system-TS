import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { getAllUsersForChat, startConversation } from "../../../services/messageService";

export default function NewConversationModal({ onClose, onStarted }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startingId, setStartingId] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsersForChat();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const visibleUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = async (userId) => {
    setStartingId(userId);
    setError("");
    try {
      const { conversationId } = await startConversation(userId);
      onStarted(conversationId);
      onClose();
    } catch (err) {
      setError(err.message);
      setStartingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="text-base font-bold text-[#1F2937]">New Message</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#1F2937]">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-black/5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search people..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
            />
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-[#6B7280] text-center py-6">Loading...</p>
          ) : visibleUsers.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-6">No one matches your search.</p>
          ) : (
            visibleUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSelect(u.id)}
                disabled={startingId === u.id}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-black/[0.02] transition disabled:opacity-50"
              >
                <div className="w-9 h-9 rounded-full bg-[#05620C] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1F2937] truncate">{u.name}</p>
                  <p className="text-xs text-[#6B7280] truncate">{u.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}