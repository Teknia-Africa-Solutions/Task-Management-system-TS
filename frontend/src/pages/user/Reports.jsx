import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tasksstats, trendData } from "../../data/mockData";
export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-5">
        {Tasksstats.map((s) => (
          <div key={s.label} className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
            <p className="text-xs font-medium text-[#6B7280] uppercase">{s.label}</p>
            <p className="text-3xl font-bold text-[#1F2937] mt-1">{s.value}</p>
            <p className={`text-xs mt-2 ${s.up ? "text-[#05620C]" : "text-red-600"}`}>
              {s.up ? "↑" : "↓"} {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-[#1F2937] mb-4">Task Completion & Pending Trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="completed" stroke="#05620C" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pending" stroke="#FF883E" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}