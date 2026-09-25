import { useState, useEffect } from "react";
import { Search, UserPlus, UserX, UserCheck } from "lucide-react";
import { getAllUsers, updateUserRole, updateUserStatus } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import CreateUserModal from "./components/CreateUserModal";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleStatusToggle = async (userId, currentStatus) => {
    setUpdatingId(userId);
    setError("");
    try {
      await updateUserStatus(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_active: !currentStatus } : u
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

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

      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
        />
      </div>

      <div className="bg-white border border-black/5 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <h2 className="font-semibold text-[#1F2937]">All Users</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B7280]">
              {visibleUsers.length} of {users.length}
            </span>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#05620C] hover:bg-[#034A09] transition"
            >
              <UserPlus size={14} />
              Add User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_140px_100px_90px] gap-4 px-5 py-2 text-[10px] font-semibold text-[#6B7280] uppercase border-b border-black/5">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {visibleUsers.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280] py-10">
            No users match your search.
          </p>
        ) : (
          visibleUsers.map((u) => {
            const isSelf = u.id === currentUser.id;
            const style = roleStyles[u.role] || roleStyles.Member;

            return (
              <div
                key={u.id}
                className="grid grid-cols-[1fr_1fr_140px_100px_90px] gap-4 items-center px-5 py-3 border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]"
              >
                <span className="text-sm font-medium text-[#1F2937] truncate">
                  {u.name}{" "}
                  {isSelf && (
                    <span className="text-xs text-[#6B7280]">(You)</span>
                  )}
                </span>
                <span className="text-sm text-[#6B7280] truncate">
                  {u.email}
                </span>

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
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )}

                <span className="text-xs font-medium">
                  {u.is_active ? (
                    <span className="text-[#05620C]">Active</span>
                  ) : (
                    <span className="text-[#C2610F]">Inactive</span>
                  )}
                </span>

                {!isSelf && (
                  <button
                    onClick={() => handleStatusToggle(u.id, u.is_active)}
                    disabled={updatingId === u.id}
                    className="flex items-center gap-1 text-xs font-medium text-[#6B7280] hover:text-[#1F2937] disabled:opacity-50"
                  >
                    {u.is_active ? (
                      <>
                        <UserX size={14} /> Disable
                      </>
                    ) : (
                      <>
                        <UserCheck size={14} /> Enable
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newUser) => {
            setUsers((prev) => [
              { ...newUser, created_at: new Date().toISOString() },
              ...prev,
            ]);
          }}
        />
      )}
    </div>
  );
}