import { useState, useEffect } from "react";
import { CheckSquare, MessageSquare, Calendar, AlertCircle } from "lucide-react";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notificationService";

const filters = ["All", "Unread", "Read"];

const typeIcons = {
  task: CheckSquare,
  message: MessageSquare,
  deadline: Calendar,
  alert: AlertCircle,
};

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getMyNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const visibleNotifications = notifications.filter((n) => {
    if (activeFilter === "Unread") return !n.is_read;
    if (activeFilter === "Read") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading notifications...</p>;
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

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

      <div className="bg-white border border-black/5 rounded-xl shadow-sm divide-y divide-black/5">
        {visibleNotifications.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280] py-10">
            No notifications here.
          </p>
        ) : (
          visibleNotifications.map((n) => {
            const Icon = typeIcons[n.type] || AlertCircle;
            return (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`w-full flex items-start gap-3 text-left px-5 py-4 transition hover:bg-black/[0.02] ${
                  !n.is_read ? "bg-[#F8FAF8]" : ""
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: n.is_read ? "#F1F1F1" : "#E8F4E9" }}
                >
                  <Icon size={16} style={{ color: n.is_read ? "#6B7280" : "#05620C" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.is_read ? "font-semibold text-[#1F2937]" : "text-[#6B7280]"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{formatTime(n.created_at)}</p>
                </div>

                {!n.is_read && (
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