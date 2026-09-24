import { useState, useEffect } from "react";
import { Eye, CheckCircle2, AlertTriangle, ListTodo, Clock, Loader, AlertCircle } from "lucide-react";
import { getMyTasks, updateTask} from "../../services/taskService";
import { useSearch } from "../../context/SearchContext";
import TaskDetailModal from "./components/TaskDetailModal";


const filters = ["All", "Todo", "In Progress", "Review", "Done"];

const priorityStyles = {
  High: { bg: "#FFF0E2", text: "#C2610F" },
  Medium: { bg: "#E8F0FE", text: "#2563EB" },
  Low: { bg: "#F1F1F1", text: "#6B7280" },
};

const statusStyles = {
  Todo: { bg: "#F1F1F1", text: "#6B7280" },
  "In Progress": { bg: "#FFF0E2", text: "#C2610F" },
  Review: { bg: "#EDE9FE", text: "#6D28D9" },
  Done: { bg: "#E8F4E9", text: "#05620C" },
};

function formatDate(dateString) {
  if (!dateString) return "No due date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isOverdue(task) {
  if (!task.due_date || task.status === "Done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due_date) < today;
}

export default function MyTasks() {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { searchTerm } = useSearch();
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const tasks = await getMyTasks();
        setAllTasks(tasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const handleMarkDone = async (taskId) => {
    try {
      await updateTask(taskId, "Done");
      setAllTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "Done" } : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const countsByFilter = filters.reduce((acc, filter) => {
    acc[filter] = filter === "All" ? allTasks.length : allTasks.filter((t) => t.status === filter).length;
    return acc;
  }, {});

  // Stats for the summary cards
  const stats = [
    {
      label: "Total Tasks",
      value: allTasks.length,
      icon: ListTodo,
      color: "#05620C",
    },
    {
      label: "Pending",
      value: allTasks.filter((t) => t.status !== "Done").length,
      icon: Clock,
      color: "#FF883E",
    },
    {
      label: "In Progress",
      value: allTasks.filter((t) => t.status === "In Progress").length,
      icon: Loader,
      color: "#2563EB",
    },
    {
      label: "Overdue",
      value: allTasks.filter(isOverdue).length,
      icon: AlertCircle,
      color: "#B91C1C",
    },
  ];

  const visibleTasks = allTasks
    .filter((task) => activeFilter === "All" || task.status === activeFilter)
    .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading tasks...</p>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-black/5 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#6B7280] uppercase">{label}</p>
                <p className="text-2xl font-bold text-[#1F2937] mt-1">{value}</p>
              </div>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}1A` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

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
            {filter} ({countsByFilter[filter]})
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
          visibleTasks.map((task) => {
            const overdue = isOverdue(task);
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between px-5 py-4 hover:bg-black-100 transition ${
                  overdue ? "bg-red-50/50" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-[#1F2937]">{task.title}</p>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                      style={{ background: priorityStyles[task.priority]?.bg, color: priorityStyles[task.priority]?.text }}
                    >
                      {task.priority}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                      style={{ background: statusStyles[task.status]?.bg, color: statusStyles[task.status]?.text }}
                    >
                      {task.status}
                    </span>
                    {overdue && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                        <AlertTriangle size={11} />
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${overdue ? "text-red-600 font-medium" : "text-[#6B7280]"}`}>
         Category: {task.category || "—"} • Due {formatDate(task.due_date)}
</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                 <button
                   onClick={() => setSelectedTask(task)}
                        className="p-1.5 text-[#6B7280] hover:text-[#1F2937] transition"
                           aria-label="View task"
               >
  <Eye size={18} />
</button>
                  <button
                    onClick={() => handleMarkDone(task.id)}
                    disabled={task.status === "Done"}
                    className={`p-1.5 transition ${
                      task.status === "Done"
                        ? "text-[#05620C] cursor-default"
                        : "text-[#6B7280] hover:text-[#05620C]"
                    }`}
                    aria-label="Mark complete"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {selectedTask && (
  <TaskDetailModal
    task={selectedTask}
    onClose={() => setSelectedTask(null)}
    onSaved={(updatedTask) =>
      setAllTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      )
    }
  />
)}
    </div>
  );
}