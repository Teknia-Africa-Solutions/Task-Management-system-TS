import { useState } from "react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      title: "Real-time updates",
      desc: "Task changes, comments, and status updates sync instantly across your whole team — no refreshing needed.",
    },
    {
      title: "Role-based access",
      desc: "Admins, project managers, and members each see exactly what they need, nothing more.",
    },
    {
      title: "Reliable task tracking",
      desc: "Every task you create is saved and tracked from start to finish, with a full history of changes.",
    },
    {
      title: "Built for teams",
      desc: "Organize work into projects, assign ownership, and keep everyone aligned on what's next.",
    },
  ];

  const steps = [
    { title: "Create a workspace", desc: "Set up your team's space in a couple of minutes." },
    { title: "Add your team", desc: "Invite members and assign roles — admin, manager, or member." },
    { title: "Assign tasks", desc: "Break projects into tasks and hand them to the right person." },
    { title: "Track progress", desc: "Watch work move forward in real time, from to-do to done." },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#26262B", background: "#FDFDFB" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Sora', sans-serif; }
      `}</style>

      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="font-display text-xl font-bold">
          <span style={{ color: "#1B6B3A" }}>Tekniafrica</span>{" "}
          <span style={{ color: "#F2801E" }}>SOLUTIONS</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#6B6B78" }}>
          <a href="#features" className="hover:opacity-70">Features</a>
          <a href="#how-it-works" className="hover:opacity-70">How it works</a>
        </nav>
        <div className="flex items-center gap-3">
         <a 
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-md border"
            style={{ borderColor: "#1B6B3A", color: "#1B6B3A" }}
          >
            Log in
          </a>
        <a
            href="/register"
            className="px-4 py-2 text-sm font-medium rounded-md text-white"
            style={{ background: "#F2801E" }}
          >
            Register
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-10 items-center px-6 md:px-12 py-12 md:py-20 max-w-6xl mx-auto">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
            Task management that keeps your whole team moving
          </h1>
          <p className="mt-5 text-lg" style={{ color: "#6B6B78", maxWidth: "42ch" }}>
            Create projects, assign tasks, and track progress together — with updates
            everyone sees the moment they happen.
          </p>
          <div className="mt-8 flex gap-4">
            
             <a href="/register"
              className="px-6 py-3 rounded-md font-medium text-white"
              style={{ background: "#1B6B3A" }}
            >
              Get started
            </a>
            
            <a  href="/login"
              className="px-6 py-3 rounded-md font-medium border"
              style={{ borderColor: "#26262B33" }}
            >
              Sign in
            </a>
          </div>
        </div>

        {/* Mock dashboard panel */}
        <div className="rounded-xl border shadow-sm p-5" style={{ borderColor: "#26262B14" }}>
          <div className="flex gap-1.5 mb-4">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F2801E" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#1B6B3A" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#26262B33" }} />
          </div>
          {[
            { name: "Redesign onboarding flow", status: "In progress" },
            { name: "Fix API auth bug", status: "Blocked" },
            { name: "Write Q3 report", status: "Done" },
          ].map((task, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-t" style={{ borderColor: "#26262B0F" }}>
              <span className="text-sm font-medium">{task.name}</span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  background: task.status === "Done" ? "#E7F4EA" : "#26262B0A",
                  color: task.status === "Done" ? "#1B6B3A" : "#6B6B78",
                }}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-10">
          Everything your team needs to stay on track
        </h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i}>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p style={{ color: "#6B6B78" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 md:px-12 py-16" style={{ background: "#F5F3EF" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-10">How it works</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white mb-3"
                  style={{ background: "#1B6B3A" }}
                >
                  {i + 1}
                </div>
                <h3 className="font-display font-semibold mb-1">{s.title}</h3>
                <p className="text-sm" style={{ color: "#6B6B78" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-10 border-t" style={{ borderColor: "#26262B0F" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: "#6B6B78" }}>
          <div className="font-display font-semibold">
            <span style={{ color: "#1B6B3A" }}>Tekniafrica</span>{" "}
            <span style={{ color: "#F2801E" }}>Solutions</span>
          </div>
          <div>&copy; {new Date().getFullYear()} Tekniafrica Solutions. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}