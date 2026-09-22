import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ClipboardList,
  Settings,
  BarChart2,
} from "lucide-react"; // flagging: verify these exact names exist in your installed lucide-react
import logo from "../../../assets/logo.png";
import { superAdminPath } from "../../../utils/routes";
import { useAuth } from "../../../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: superAdminPath("dashboard"), icon: LayoutDashboard },
  { label: "User Management", to: superAdminPath("userManagement"), icon: Users },
  { label: "Projects", to: superAdminPath("projects"), icon: FolderKanban },
  { label: "Audit Log", to: superAdminPath("auditLog"), icon: ClipboardList },
  { label: "Reports", to: superAdminPath("reports"), icon: BarChart2 },
  { label: "Settings", to: superAdminPath("settings"), icon: Settings },
];

export default function SuperAdminSidebar({ onClose }) {
  const { user } = useAuth();
  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <aside className="w-64 h-screen flex flex-col bg-[#0B1F0D] text-white">
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="TaskFlow" className="h-8 w-auto object-contain" />
          <div>
            <p className="font-semibold leading-tight">TaskFlow</p>
            <p className="text-[10px] tracking-wider text-white/50">SUPER ADMIN</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/70">
            ×
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-[#FF883E] text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 px-5 py-4 border-t border-white/10">
        <div className="w-9 h-9 rounded-full bg-[#05620C] flex items-center justify-center text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-white/50 truncate">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}