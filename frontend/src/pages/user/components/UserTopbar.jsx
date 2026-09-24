import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userPath, USER_ROUTES } from "../../../utils/routes";
import { useSearch } from "../../../context/SearchContext";
import { useAuth } from "../../../context/AuthContext";

import {
  Search,
  SlidersHorizontal,
  Bell,
  ChevronDown,
  User,
  Settings,
  BellRing,
  LogOut,
} from "lucide-react";

// Maps each route segment to what the topbar heading should say
const pageTitles = {
  [USER_ROUTES.dashboard]: "Dashboard",
  [USER_ROUTES.myTasks]: "My Tasks",
  [USER_ROUTES.projects]: "Projects",
  [USER_ROUTES.calendar]: "Calendar",
  [USER_ROUTES.reports]: "Reports",
  [USER_ROUTES.files]: "Files",
  [USER_ROUTES.messages]: "Messages",
  [USER_ROUTES.notifications]: "Notifications",
  [USER_ROUTES.viewProfile]: "View Profile",
  [USER_ROUTES.accountSettings]: "Account Settings",
  [USER_ROUTES.notificationPreferences]: "Notification Preferences",
};

export default function UserTopbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, logout } = useAuth();
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const notificationCount = 3;

  // Extract the last segment of the URL, e.g. "/user/my-tasks" -> "my-tasks"
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
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold text-[#1F2937]">
          {pageTitle}{" "}
          {currentSegment === USER_ROUTES.dashboard && (
            <span className="font-normal text-[#6B7280]">
              Welcome Back, {user.name.split(" ")[0]}
            </span>
          )}
        </h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md ">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
          />
        </div>
      </div>

      {/*filter, notifications, new task, profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium border border-black/10 rounded-lg text-[#1F2937] hover:bg-black/5 transition">
          <SlidersHorizontal size={16} />
          Filter
        </button>

        <button className="relative p-2 border border-black/10 rounded-lg hover:bg-black/5 transition">
          <Bell size={18} className="text-[#1F2937]" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-semibold text-white bg-red-500 rounded-full">
              {notificationCount}
            </span>
          )}
        </button>

       

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-2"
          >
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

              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-black/5 transition"
                  onClick={() => {
                    navigate(userPath("viewProfile"));
                    setMenuOpen(false); 
                  }}
                >
                <User size={16} />
                View Profile
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-black/5 transition"
                  onClick={() => {
                    navigate(userPath("accountSettings"));
                    setMenuOpen(false);
                  }}  
                >
                <Settings size={16} />
                Account Settings
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-black/5 transition"
                  onClick={() => {
                    navigate(userPath("notificationPreferences"));
                    setMenuOpen(false);
                  }}
                >
                <BellRing size={16} />
                Notification Preferences
              </button>

              <div className="border-t border-black/5 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}