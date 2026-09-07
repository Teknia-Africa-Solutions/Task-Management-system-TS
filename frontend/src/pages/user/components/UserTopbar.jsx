import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Bell,
  ChevronDown,
  User,
  Settings,
  BellRing,
  LogOut,
} from "lucide-react"; // flagging: double-check these exact icon names exist in your installed lucide-react version

export default function UserTopbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Placeholder — replace with real user data from AuthContext once it's built
  const user = { name: "Jane Doe", email: "jane@taskflow.io", role: "Member" };
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const notificationCount = 3; // placeholder — wire to real unread count later

  // Close the dropdown when clicking anywhere outside it
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-black/5">
      {/* Title + subtitle */}
      <div className="shrink-0">
        <h1 className="text-xl font-bold text-[#1F2937]">
          Dashboard{" "}
          <span className="font-normal text-[#6B7280]">
            Welcome Back, {user.name.split(" ")[0]}
          </span>
        </h1>
        <p className="text-sm text-[#6B7280]">Here's what's happening with your tasks today.</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden lg:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
          />
        </div>
      </div>

      {/* Right side: filter, notifications, new task, profile */}
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

              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-black/5 transition">
                <User size={16} />
                View Profile
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-black/5 transition">
                <Settings size={16} />
                Account Settings
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-black/5 transition">
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