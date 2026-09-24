import { useState, useEffect } from "react";
import { getAllUsers, updateUserRole } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const roleOptions = ["Member", "Admin", "SuperAdmin"];

const roleStyles = {
  Member: { bg: "#F1F1F1", text: "#6B7280" },
  Admin: { bg: "#FFF0E2", text: "#C2610F" },
  SuperAdmin: { bg: "#E8F4E9", text: "#05620C" },
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    setError("");
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading users...</p>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="font-semibold text-[#1F2937]">All Users</h2>
          <span className="text-xs text-[#6B7280]">{users.length} total</span>
        </div>

        <div className="grid grid-cols-[1fr_1fr_140px_120px] gap-4 px-5 py-2 text-[10px] font-semibold text-[#6B7280] uppercase border-b border-black/5">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
        </div>

        {users.map((u) => {
          const isSelf = u.id === currentUser.id;
          const style = roleStyles[u.role] || roleStyles.Member;

          return (
            <div
              key={u.id}
              className="grid grid-cols-[1fr_1fr_140px_120px] gap-4 items-center px-5 py-3 border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]"
            >
              <span className="text-sm font-medium text-[#1F2937] truncate">
                {u.name} {isSelf && <span className="text-xs text-[#6B7280]">(You)</span>}
              </span>
              <span className="text-sm text-[#6B7280] truncate">{u.email}</span>

              {isSelf ? (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded w-fit"
                  style={{ background: style.bg, color: style.text }}
                >
                  {u.role}
                </span>
              ) : (
                <select
                  value={u.role}
                  disabled={updatingId === u.id}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="text-xs font-medium border border-black/10 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#05620C]/30 disabled:opacity-50"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              )}

              <span className="text-xs text-[#6B7280]">{formatDate(u.created_at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}