import { Folder, LayoutGrid, FileText, Smartphone } from "lucide-react"; // flagging: verify these exact names exist in your installed lucide-react

// Placeholder data — replace with real API data once the backend exists
const projects = [
  {
    id: 1,
    name: "Inventory Management System",
    tasksDone: 15,
    tasksTotal: 20,
    icon: Folder,
    color: "#05620C", // brand green
  },
  {
    id: 2,
    name: "Task Management System",
    tasksDone: 12,
    tasksTotal: 18,
    icon: LayoutGrid,
    color: "#FF883E", // brand orange
  },
  {
    id: 3,
    name: "Website Redesign",
    tasksDone: 8,
    tasksTotal: 15,
    icon: FileText,
    color: "#D97757",
  },
  {
    id: 4,
    name: "Mobile App Development",
    tasksDone: 10,
    tasksTotal: 25,
    icon: Smartphone,
    color: "#3B5B74",
  },
];

export default function Projects() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const Icon = project.icon;
        const percent = Math.round((project.tasksDone / project.tasksTotal) * 100);

        return (
          <div
            key={project.id}
            className="bg-white border border-black/5 rounded-xl shadow-sm p-5"
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: project.color }}
              >
                <Icon size={18} className="text-white" />
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
                style={{ width: `${percent}%`, background: project.color }}
              />
            </div>

            <button
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: project.color }}
            >
              View Project
            </button>
          </div>
        );
      })}
    </div>
  );
}