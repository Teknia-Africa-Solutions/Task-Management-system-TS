import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMyTasks } from "../../services/taskService";
import TaskDetailModal from "./components/TaskDetailModal";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const statusColors = {
  Todo: "#6B7280",
  "In Progress": "#C2610F",
  Review: "#6D28D9",
  Done: "#05620C",
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

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

  const eventsByDate = tasks.reduce((acc, task) => {
    if (!task.due_date) return acc;
    const dateKey = task.due_date.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const dateKey = (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading calendar...</p>;
  }

  return (
    <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6">
      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setCurrentDate(new Date(year, Number(e.target.value), 1))}
            className="border border-black/10 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
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
            className="border border-black/10 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#05620C]/30"
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
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#6B7280] mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l border-black/5">
        {cells.map((day, i) => {
          const key = day ? dateKey(day) : null;
          const dayEvents = key ? eventsByDate[key] : null;

          return (
            <div key={i} className="min-h-[90px] border-r border-b border-black/5 p-2">
              {day && (
                <>
                  <span className="text-sm text-[#1F2937]">{day}</span>
                  {dayEvents?.map((task) => {
                    const color = statusColors[task.status] || "#6B7280";
                    return (
                      <button
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="w-full text-left mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded truncate block hover:opacity-80 transition"
                        style={{ background: `${color}1A`, color }}
                        title={task.title}
                      >
                        {task.title}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSaved={(updatedTask) => {
            setTasks((prev) =>
              prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
          }}
        />
      )}
    </div>
  );
}