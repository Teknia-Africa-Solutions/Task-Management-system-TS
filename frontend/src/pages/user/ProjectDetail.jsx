import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getProjectDetail } from "../../services/projectService";

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

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await getProjectDetail(id);
        setProject(data.project);
        setTasks(data.tasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  if (loading) {
    return <p className="text-sm text-[#6B7280]">Loading project...</p>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {error}
      </div>
    );
  }

  const doneCount = tasks.filter((t) => t.status === "Done").length;
  const percent = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link to="/user/projects" className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1F2937]">
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="bg-white border border-black/5 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: project.color || "#05620C" }}
          />
          <h1 className="text-lg font-bold text-[#1F2937]">{project.name}</h1>
        </div>

        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#6B7280]">Overall progress</span>
          <span className="font-semibold text-[#1F2937]">{doneCount} / {tasks.length} tasks ({percent}%)</span>
        </div>
        <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${percent}%`, background: project.color || "#05620C" }}
          />
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-xl shadow-sm divide-y divide-black/5">
        {tasks.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280] py-10">No tasks in this project yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">{task.title}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Assigned to: {task.assigneeName || "Unassigned"} • Due {formatDate(task.due_date)}
                </p>
              </div>
              <span
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0"
                style={{ background: statusStyles[task.status]?.bg, color: statusStyles[task.status]?.text }}
              >
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}