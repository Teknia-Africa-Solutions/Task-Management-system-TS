import { useState } from "react";
import { CheckSquare, MessageSquare, Calendar, AlertCircle } from "lucide-react"; // flagging: verify these exact names exist in your installed lucide-react

const initialNotifications = [
  { id: 1, type: "task", title: "New task assigned: UI Design for Dashboard", time: "10 min ago", read: false, icon: CheckSquare },
  { id: 2, type: "message", title: "Jane Doe sent you a message", time: "1 hour ago", read: false, icon: MessageSquare },
  { id: 3, type: "deadline", title: "Project Proposal is due tomorrow", time: "3 hours ago", read: false, icon: Calendar },
  { id: 4, type: "alert", title: "Your task 'API Integration' was marked Blocked", time: "Yesterday", read: true, icon: AlertCircle },
  { id: 5, type: "task", title: "Task 'Database Design' status changed to Todo", time: "2 days ago", read: true, icon: CheckSquare },
];

const filters = ["All", "Unread", "Read"];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleNotifications = notifications.filter((n) => {
    if (activeFilter === "Unread") return !n.read;
    if (activeFilter === "Read") return n.read;
    return true; 
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition ${
                activeFilter === filter
                  ? "bg-[#05620C] text-white"
                  : "bg-white border border-black/10 text-[#6B7280] hover:bg-black/5"
              }`}
            >
              {filter}
              {filter === "Unread" && unreadCount > 0 && ` (${unreadCount})`}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-[#05620C] hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="bg-white border border-black/5 rounded-xl shadow-sm divide-y divide-black/5">
        {visibleNotifications.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280] py-10">
            No notifications here.
          </p>
        ) : (
          visibleNotifications.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`w-full flex items-start gap-3 text-left px-5 py-4 transition hover:bg-black/[0.02] ${
                  !n.read ? "bg-[#F8FAF8]" : ""
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: n.read ? "#F1F1F1" : "#E8F4E9" }}
                >
                  <Icon size={16} style={{ color: n.read ? "#6B7280" : "#05620C" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? "font-semibold text-[#1F2937]" : "text-[#6B7280]"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{n.time}</p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-[#FF883E] shrink-0 mt-1.5" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}