import { useState, useEffect } from "react";
import { CheckSquare, Clock, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getMyTasks } from "../../services/taskService";
import { weeklyData, deadlines } from "../../data/mockData"; // still mock for now, per today's scope

const statIcons = {
  "Total Tasks": CheckSquare,
  "Pending Tasks": Clock,
  "In Progress": Activity,
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getMyTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      change: "Live from your task list",
      color: "#05620C",
    },
    {
      label: "Pending Tasks",
      value: tasks.filter((t) => t.status === "Todo").length,
      change: "Live from your task list",
      color: "#FF883E",
    },
    {
      label: "In Progress",
      value: tasks.filter((t) => t.status === "In Progress").length,
      change: "Live from your task list",
      color: "#2563EB",
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-black/5 rounded-xl shadow-sm p-5 animate-pulse">
                <div className="h-3 w-24 bg-black/10 rounded mb-3" />
                <div className="h-8 w-12 bg-black/10 rounded" />
              </div>
            ))
          : stats.map(({ label, value, change, color }) => {
              const Icon = statIcons[label];
              return (
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
                  <p className="text-xs text-[#6B7280] mt-3">{change}</p>
                </div>
              );
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-black/5 rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-[#1F2937] mb-4">Task Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#00000005" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="completed" name="Completed" fill="#05620C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="created" name="Created" fill="#FF883E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-[#1F2937] mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div key={d.title} className="flex items-center gap-3 bg-[#F8FAF8] rounded-lg p-3">
                <div className="text-center shrink-0 w-11">
                  <p className="text-[10px] font-semibold text-[#6B7280] leading-none">{d.date.split(" ")[0]}</p>
                  <p className="text-lg font-bold text-[#1F2937] leading-tight">{d.date.split(" ")[1]}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1F2937] truncate">{d.title}</p>
                  <p className="text-xs text-[#6B7280]">{d.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}