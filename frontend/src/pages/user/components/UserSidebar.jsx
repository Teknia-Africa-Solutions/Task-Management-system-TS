import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  BarChart2,
  FileText,
  MessageSquare,
  Bell,
  X,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import { userPath } from "../../../utils/routes";

const navItems = [
  { label: "Dashboard", to: userPath("dashboard"), icon: LayoutDashboard },
  { label: "My Tasks", to: userPath("myTasks"), icon: CheckSquare },
  { label: "Projects", to: userPath("projects"), icon: FolderKanban },
  { label: "Calendar", to: userPath("calendar"), icon: Calendar },
  { label: "Reports", to: userPath("reports"), icon: BarChart2 },
  { label: "Files", to: userPath("files"), icon: FileText },
  { label: "Messages", to: userPath("messages"), icon: MessageSquare },
  { label: "Notifications", to: userPath("notifications"), icon: Bell },
];

export default function UserSidebar({ onClose }) {
  const user = { name: "Jane Doe", email: "jane@taskflow.io" };

  return (
    <aside className="w-64 h-screen flex flex-col bg-[#0B1F0D] text-white">
      <div className="flex items-center justify-between px-5 py-6">
        <img src={logo} alt="TaskFlow" className="h-10 w-auto object-contain" />

        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/70" aria-label="Close menu">
            <X size={24} />
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
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-white/50 truncate">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}