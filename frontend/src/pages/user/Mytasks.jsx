import { useState } from "react";
import { Eye, CheckCircle2 } from "lucide-react";
import { allTasks } from "../../data/mockData";

const filters = ["All", "Todo", "In Progress", "Review", "Done"];

const priorityStyles = {
  High: { bg: "#FFF0E2", text: "#C2610F" },
  Medium: { bg: "#E8F0FE", text: "#1D4ED8" },
  Low: { bg: "#F1F1F1", text: "#6B7280" },
};

const statusStyles = {
  Todo: { bg: "#F1F1F1", text: "#6B7280" },
  "In Progress": { bg: "#FFF0E2", text: "#C2610F" },
  Review: { bg: "#EDE9FE", text: "#6D28D9" },
  Done: { bg: "#E7F4EA", text: "#05620C" },
};

export default function MyTasks() {
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleTasks =
    activeFilter === "All"
      ? allTasks
      : allTasks.filter((task) => task.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
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
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="bg-white border border-black/5 rounded-xl shadow-sm divide-y divide-black/5">
        {visibleTasks.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280] py-10">
            No tasks match this filter.
          </p>
        ) : (
          visibleTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between px-5 py-4 hover:bg-black/[0.02] transition"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#1F2937]">{task.title}</p>
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{ background: priorityStyles[task.priority].bg, color: priorityStyles[task.priority].text }}
                  >
                    {task.priority}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{ background: statusStyles[task.status].bg, color: statusStyles[task.status].text }}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Category: {task.category} • Due {task.due} • Assignee: {task.assignee}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button className="p-1.5 text-[#6B7280] hover:text-[#1F2937] transition" aria-label="View task">
                  <Eye size={18} />
                </button>
                <button className="p-1.5 text-[#6B7280] hover:text-[#05620C] transition" aria-label="Mark complete">
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}