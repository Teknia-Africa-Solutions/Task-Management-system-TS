import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getReportSummary } from "../../services/reportService";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getReportSummary();
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
    return <p className="text-sm text-[#6B7280]">Loading report...</p>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {error}
      </div>
    );
  }

  const stats = [
    { label: "Task Completion Rate", value: `${summary.completionRate}%` },
    { label: "Avg. Task Duration", value: summary.avgTaskDuration },
    { label: "Team Productivity", value: `${summary.teamProductivity}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
            <p className="text-xs font-medium text-[#6B7280] uppercase">{s.label}</p>
            <p className="text-3xl font-bold text-[#1F2937] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

     <div className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
  <h2 className="font-semibold text-[#1F2937] mb-4">Task Completion & Creation Trend</h2>
  {summary.weeklyTrend.length === 0 ? (
    <p className="text-sm text-[#6B7280] text-center py-10">
      No task activity yet — mark some tasks Done to start seeing your trend here.
    </p>
  ) : (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={summary.weeklyTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="completed" stroke="#05620C" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="created" stroke="#FF883E" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )}
</div>
    </div>
  );
}