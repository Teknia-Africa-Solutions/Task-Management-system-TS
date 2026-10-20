import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSuperAdminReportSummary } from "../../services/reportService";

// On small screens each card is a compact row (label left, value right) to save height.
// From md up it becomes the stacked card.
function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-black/5 rounded-xl shadow-sm p-4 sm:p-5 flex items-center justify-between gap-3 md:block">
      <p className="text-xs font-medium text-[#6B7280] uppercase leading-snug">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-[#1F2937] shrink-0 md:mt-1">{value}</p>
    </div>
  );
}

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        setSummary(await getSuperAdminReportSummary());
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

  const trend = summary.weeklyTrend ?? [];

  const stats = [
    { label: "Org-wide Completion Rate", value: `${summary.completionRate}%` },
    { label: "Avg. Task Duration", value: summary.avgTaskDuration },
    { label: "On-Time Completion Rate", value: `${summary.onTimeRate}%` },
  ];

  return (
    // max-w-7xl stops the page stretching edge to edge on very wide monitors
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-4 sm:p-5">
        <h2 className="font-semibold text-[#1F2937] text-sm sm:text-base mb-4">
          Org-wide Task Completion &amp; Creation Trend
        </h2>

        {trend.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-10">
            No task activity yet to show a trend.
          </p>
        ) : (
          // The height steps up with the screen. min-w-0 lets the chart shrink inside flex/grid parents.
          <div className="h-60 sm:h-72 lg:h-80 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={12}
                />
                <YAxis
                  width={32}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#05620C"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  name="Created"
                  stroke="#FF883E"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}