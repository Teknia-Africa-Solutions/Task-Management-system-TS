import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { SUPERADMIN_ROUTES } from "../../../utils/routes";
import { useAuth } from "../../../context/AuthContext";

const pageTitles = {
  [SUPERADMIN_ROUTES.dashboard]: "Dashboard",
  [SUPERADMIN_ROUTES.userManagement]: "User Management",
  [SUPERADMIN_ROUTES.projects]: "Projects",
  [SUPERADMIN_ROUTES.auditLog]: "Audit Log",
  [SUPERADMIN_ROUTES.reports]: "Reports",
  [SUPERADMIN_ROUTES.settings]: "Settings",
};

export default function SuperAdminTopbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const currentSegment = location.pathname.split("/").pop();
  const pageTitle = pageTitles[currentSegment] || "Dashboard";

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-black/5">
      <h1 className="text-xl font-bold text-[#1F2937]">{pageTitle}</h1>

      <div className="flex items-center gap-3 shrink-0">
        <button className="relative p-2 border border-black/10 rounded-lg hover:bg-black/5 transition">
          <Bell size={18} className="text-[#1F2937]" />
        </button>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 pl-2">
            <div className="w-9 h-9 rounded-full bg-[#FF883E] text-white flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-[#1F2937] leading-tight">{user.name}</p>
              <p className="text-xs text-[#6B7280] leading-tight">{user.role}</p>
            </div>
            <ChevronDown size={16} className="text-[#6B7280] hidden md:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-black/5 rounded-xl shadow-lg py-2 z-20">
              <div className="px-4 py-2 border-b border-black/5">
                <p className="text-sm font-medium text-[#1F2937]">{user.name}</p>
                <p className="text-xs text-[#6B7280]">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}