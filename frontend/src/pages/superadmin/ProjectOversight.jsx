import { useState, useEffect } from "react";
import { FolderKanban, Users } from "lucide-react";
import { getAllProjectsAdmin } from "../../services/projectService";

export default function ProjectOversight() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getAllProjectsAdmin();
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
    return <p className="text-sm text-[#6B7280]">Loading projects...</p>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return <p className="text-sm text-[#6B7280] text-center py-10">No projects in the system yet.</p>;
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
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: color }}
              >
                <FolderKanban size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#1F2937] text-sm truncate">{project.name}</p>
                <p className="text-xs text-[#6B7280] truncate">
                  Created by {project.createdByName || "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#6B7280]">Progress</span>
              <span className="font-semibold text-[#1F2937]">
                {project.tasksDone} / {project.tasksTotal} tasks ({percent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full"
                style={{ width: `${percent}%`, background: color }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <Users size={13} />
              <span>{project.teamSize} team member{project.teamSize !== 1 ? "s" : ""}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}