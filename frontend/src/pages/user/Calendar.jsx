import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Placeholder events — replace with real API data later
const events = {
  "2026-05-21": [{ title: "Project Proposal", color: "#B91C1C" }],
  "2026-05-23": [{ title: "UI Design", color: "#C2610F" }],
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a flat array: leading blanks + actual day numbers
  const cells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date(2026, 4, 1));

  const dateKey = (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6">
      {/* Header: month nav + view toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-[#1F2937]">{monthLabel}</h2>
          <button onClick={goToPrevMonth} className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5">
            <ChevronLeft size={16} />
          </button>
          <button onClick={goToToday} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-[#05620C]">
            Today
          </button>
          <button onClick={goToNextMonth} className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex gap-1 bg-black/5 rounded-lg p-1">
          {["Month", "Week", "Day"].map((v) => (
            <button
              key={v}
              className={`px-3 py-1 text-sm rounded-md font-medium ${
                v === "Month" ? "bg-white shadow-sm text-[#1F2937]" : "text-[#6B7280]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Weekday header row */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#6B7280] mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 border-t border-l border-black/5">
        {cells.map((day, i) => {
          const key = day ? dateKey(day) : null;
          const dayEvents = key ? events[key] : null;

          return (
            <div
              key={i}
              className="min-h-[90px] border-r border-b border-black/5 p-2"
            >
              {day && (
                <>
                  <span className="text-sm text-[#1F2937]">{day}</span>
                  {dayEvents?.map((ev, j) => (
                    <div
                      key={j}
                      className="mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded truncate"
                      style={{ background: `${ev.color}1A`, color: ev.color }}
                    >
                      {ev.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}