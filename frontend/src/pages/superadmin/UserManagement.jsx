import { useState, useEffect, useRef } from "react";
import { Search, UserPlus, MoreVertical, UserX, UserCheck } from "lucide-react"; // flagging: verify these names in your lucide-react version
import { getAllUsers, updateUserRole, updateUserStatus } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import CreateUserModal from "./components/CreateUserModal";

const roleOptions = ["Member", "Admin", "SuperAdmin"];

const roleStyles = {
  Member: { bg: "#F1F1F1", text: "#6B7280" },
  Admin: { bg: "#FFF0E2", text: "#C2610F" },
  SuperAdmin: { bg: "#E8F4E9", text: "#05620C" },
};

// Shared by the header and every row so the columns always line up (desktop only)
const GRID_COLS = "md:grid-cols-[minmax(0,2fr)_150px_120px_40px]";

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 w-fit text-xs font-semibold px-2.5 py-1 rounded-full ${
        isActive ? "bg-[#E8F4E9] text-[#05620C]" : "bg-[#FFF0E2] text-[#C2610F]"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function RowMenu({ isActive, disabled, onToggleStatus }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="p-1.5 rounded-lg text-[#6B7280] hover:bg-black/5 hover:text-[#1F2937] transition disabled:opacity-50"
        aria-label="User actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-44 bg-white border border-black/5 rounded-xl shadow-lg py-1.5 z-20"
        >
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onToggleStatus();
            }}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition ${
              isActive
                ? "text-red-600 hover:bg-red-50"
                : "text-[#05620C] hover:bg-[#E8F4E9]"
            }`}
          >
            {isActive ? <UserX size={16} /> : <UserCheck size={16} />}
            {isActive ? "Deactivate" : "Reactivate"}
          </button>
        </div>
      )}
    </div>
  );
}

function ConfirmModal({ title, message, warning, confirmLabel, danger, loading, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-[#1F2937] mb-2">{title}</h2>
        <p className="text-sm text-[#6B7280]">{message}</p>

        {warning && (
          <div className="mt-4 text-xs text-[#C2610F] bg-[#FFF0E2] border border-[#C2610F]/20 rounded-md px-3 py-2">
            {warning}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1F2937] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-[#05620C] hover:bg-[#034A09]"
            }`}
          >
            {loading ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [pending, setPending] = useState(null);
  const [confirming, setConfirming] = useState(false);

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

  const askRoleChange = (target, newRole) => {
    if (newRole === target.role) return;
    setPending({ kind: "role", user: target, newRole });
  };

  const askStatusToggle = (target) => {
    setPending({ kind: "status", user: target });
  };

  const handleConfirm = async () => {
    if (!pending) return;
    setConfirming(true);
    setError("");

    try {
      if (pending.kind === "role") {
        await updateUserRole(pending.user.id, pending.newRole);
        setUsers((prev) =>
          prev.map((u) => (u.id === pending.user.id ? { ...u, role: pending.newRole } : u))
        );
      } else {
        const nextActive = !pending.user.is_active;
        await updateUserStatus(pending.user.id, nextActive);
        setUsers((prev) =>
          prev.map((u) => (u.id === pending.user.id ? { ...u, is_active: nextActive } : u))
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
      setPending(null);
    }
  };

  const visibleUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  // Work out what the confirmation modal should say for the current pending action
  let modalProps = null;
  if (pending) {
    const target = pending.user;

    if (pending.kind === "role") {
      let warning = null;
      if (pending.newRole === "SuperAdmin") {
        warning = "SuperAdmins have full access to the system, including managing every user.";
      } else if (pending.newRole === "Admin") {
        warning = "Admins can create projects and assign tasks to team members.";
      }

      modalProps = {
        title: "Change role?",
        message: `Change ${target.name}'s role from ${target.role} to ${pending.newRole}?`,
        warning,
        confirmLabel: "Change role",
        danger: false,
      };
    } else {
      const deactivating = Boolean(target.is_active);
      modalProps = {
        title: deactivating ? "Deactivate account?" : "Reactivate account?",
        message: deactivating
          ? `${target.name} won't be able to log in until you reactivate the account.`
          : `${target.name} will be able to log in again.`,
        warning: null,
        confirmLabel: deactivating ? "Deactivate" : "Reactivate",
        danger: deactivating,
      };
    }
  }

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

      <div className="relative w-full sm:max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
        />
      </div>

      <div className="bg-white border border-black/5 rounded-xl shadow-sm">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/5">
          <h2 className="font-semibold text-[#1F2937]">All Users</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#6B7280]">
              {visibleUsers.length} {visibleUsers.length === 1 ? "User" : "Users"}
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

        <div
          className={`hidden md:grid ${GRID_COLS} gap-4 px-5 py-2 text-[10px] font-semibold text-[#6B7280] uppercase border-b border-black/5`}
        >
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span />
        </div>

        {visibleUsers.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280] py-10">No users match your search.</p>
        ) : (
          visibleUsers.map((u) => {
            const isSelf = u.id === currentUser.id;
            const style = roleStyles[u.role] || roleStyles.Member;

            return (
              <div
                key={u.id}
                className={`grid grid-cols-[minmax(0,1fr)_auto] ${GRID_COLS} gap-x-3 gap-y-3 md:gap-4 items-center px-5 py-4 border-b border-black/5 last:border-b-0 last:rounded-b-xl hover:bg-black/[0.02] transition`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#05620C] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {getInitials(u.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate">
                      {u.name}
                      {isSelf && <span className="ml-1.5 text-xs font-normal text-[#6B7280]">(You)</span>}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate">{u.email}</p>
                  </div>
                </div>

                {!isSelf && (
                  <div className="md:order-last">
                    <RowMenu
                      isActive={Boolean(u.is_active)}
                      onToggleStatus={() => askStatusToggle(u)}
                    />
                  </div>
                )}

                <div className="col-span-2 flex flex-wrap items-center gap-2 md:contents">
                  {isSelf ? (
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                      style={{ background: style.bg, color: style.text }}
                    >
                      {u.role}
                    </span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) => askRoleChange(u, e.target.value)}
                      className="text-xs font-medium border border-black/10 rounded-md px-2 py-1.5 md:w-full focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  )}

                  <StatusBadge isActive={Boolean(u.is_active)} />
                </div>
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
              { ...newUser, is_active: 1, created_at: new Date().toISOString() },
              ...prev,
            ]);
          }}
        />
      )}

      {modalProps && (
        <ConfirmModal
          {...modalProps}
          loading={confirming}
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}