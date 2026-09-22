import { useState, useEffect } from "react";
import { FolderKanban } from "lucide-react";
import { getMyProjects } from "../../services/projectService";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getMyProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-black/5 rounded-xl shadow-sm p-5 animate-pulse">
            <div className="h-10 w-10 bg-black/10 rounded-lg mb-5" />
            <div className="h-3 w-32 bg-black/10 rounded mb-2" />
            <div className="h-2 w-full bg-black/10 rounded mb-5" />
            <div className="h-9 w-full bg-black/10 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="text-sm text-[#6B7280] text-center py-10">
        You're not assigned to any projects yet.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const percent = project.tasksTotal > 0
          ? Math.round((project.tasksDone / project.tasksTotal) * 100)
          : 0;
        const color = project.color || "#05620C";

        return (
          <div key={project.id} className="bg-white border border-black/5 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: color }}
              >
                <FolderKanban size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#1F2937] text-sm">{project.name}</p>
                <p className="text-xs text-[#6B7280]">
                  {project.tasksDone} / {project.tasksTotal} tasks
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#6B7280]">Progress</span>
              <span className="font-semibold text-[#1F2937]">{percent}%</span>
            </div>
            <div className="w-full h-2 bg-black/5 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${percent}%`, background: color }}
              />
            </div>

           <Link
  to={`/user/projects/${project.id}`}
  className="block text-center w-full py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
  style={{ background: color }}
>
  View Project
</Link>
          </div>
        );
      })}
    </div>
  );
}