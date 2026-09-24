import { useState, useEffect } from "react";
import { Users, FolderKanban, CheckSquare } from "lucide-react";
import { getSuperAdminSummary } from "../../services/dashboardService";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const roleStyles = {
  Member: { bg: "#F1F1F1", text: "#6B7280" },
  Admin: { bg: "#FFF0E2", text: "#C2610F" },
  SuperAdmin: { bg: "#E8F4E9", text: "#05620C" },
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getSuperAdminSummary();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {error}
      </div>
    );
  }

  const taskCompletionRate = summary.tasks.total > 0
    ? Math.round((summary.tasks.done / summary.tasks.total) * 100)
    : 0;

  const stats = [
    {
      label: "Total Users",
      value: summary.users.total,
      sub: `${summary.users.members} Members · ${summary.users.admins} Admins · ${summary.users.superAdmins} Super Admins`,
      icon: Users,
      color: "#05620C",
    },
    {
      label: "Total Projects",
      value: summary.projects.total,
      sub: "Across the whole organization",
      icon: FolderKanban,
      color: "#FF883E",
    },
    {
      label: "Total Tasks",
      value: summary.tasks.total,
      sub: `${taskCompletionRate}% completed org-wide`,
      icon: CheckSquare,
      color: "#2563EB",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">{label}</p>
                <p className="text-3xl font-bold text-[#1F2937] mt-1">{value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}1A` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="text-xs text-[#6B7280] mt-3">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-[#1F2937] mb-4">Recently Joined Users</h2>
        <div className="divide-y divide-black/5">
          {summary.recentUsers.map((u) => {
            const style = roleStyles[u.role] || roleStyles.Member;
            return (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">{u.name}</p>
                  <p className="text-xs text-[#6B7280]">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{ background: style.bg, color: style.text }}
                  >
                    {u.role}
                  </span>
                  <span className="text-xs text-[#6B7280] w-20 text-right">{formatDate(u.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}