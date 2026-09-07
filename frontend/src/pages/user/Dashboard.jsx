import { CheckSquare, Clock, Activity } from "lucide-react"; // flagging: verify these exact names exist in your installed lucide-react
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Placeholder data — replace with real API data once the backend exists
const stats = [
  { label: "Total Tasks", value: 35, change: "+12% from last week", icon: CheckSquare, color: "#05620C" },
  { label: "Pending Tasks", value: 14, change: "+5% from last week", icon: Clock, color: "#FF883E" },
  { label: "In Progress", value: 11, change: "+8% from last week", icon: Activity, color: "#2563EB" },
];

const weeklyData = [
  { day: "Mon", completed: 18, created: 24 },
  { day: "Tue", completed: 22, created: 15 },
  { day: "Wed", completed: 15, created: 20 },
  { day: "Thu", completed: 12, created: 9 },
  { day: "Fri", completed: 8, created: 9 },
];

const deadlines = [
  { date: "MAY 21", title: "Project Proposal", note: "Tomorrow" },
  { date: "MAY 23", title: "UI Design Submission", note: "In 2 days" },
  { date: "MAY 24", title: "Client Presentation", note: "In 3 days" },
  { date: "MAY 28", title: "Final Report", note: "In 7 days" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">{label}</p>
                <p className="text-3xl font-bold text-[#1F2937] mt-1">{value}</p>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}1A` }} // ~10% opacity tint of the icon color
              >
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="text-xs text-[#05620C] mt-3">↗ {change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Task overview chart */}
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

        {/* Upcoming deadlines */}
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