import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const events = {
  "2026-05-21": [{ title: "Project Proposal", color: "#B91C1C" }],
  "2026-05-23": [{ title: "UI Design", color: "#C2610F" }],
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [view, setView] = useState("Month"); // ✅ NEW: track active view

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const dateKey = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setCurrentDate(new Date(year, Number(e.target.value), 1))}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setCurrentDate(new Date(Number(e.target.value), month, 1))}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={2020 + i}>
                {2020 + i}
              </option>
            ))}
          </select>

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
          {["Month"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-sm rounded-md font-medium ${
                view === v ? "bg-white shadow-sm text-[#1F2937]" : "text-[#6B7280]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "Month" && (
        <>
          <div className="grid grid-cols-7 sm:grid-cols-4 md:grid-cols-7 text-center text-xs font-semibold text-[#6B7280] mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7  border-t border-l border-black/5">
            {cells.map((day, i) => {
              const key = day ? dateKey(day) : null;
              const dayEvents = key ? events[key] : null;

              return (
                <div key={i} className="min-h-[60px] border-r border-b border-black/5 p-2">
                  {day && (
                    <>
                      <span className="text-xs sm:text-sm text-[#1F2937]">{day}</span>
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
        </>
      )}
    </div>
  );
}
