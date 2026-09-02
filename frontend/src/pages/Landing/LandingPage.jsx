import { useState } from "react";
import {Link } from "react-router-dom";
import {Menu,X} from "lucide-react";
import Logo from "../../assets/logo.png";
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

      <header className=" relative flex items-center justify-between px-6 py-5 md:px-12 h-20">
       <div className="flex items-center gap-2 h-full py-3">
        <img src={Logo} alt="Tekina Logo" className="h-20 mt-6  w-auto object-contain" />
      
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#6B6B78" }}>
          <a href="#features" className="hover:opacity-70">Features</a>
          <a href="#how-it-works" className="hover:opacity-70">How it works</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
         <Link 
            to="/login"
            className="px-4 py-2 text-sm font-medium rounded-md border"
            style={{ borderColor: "#1B6B3A", color: "#1B6B3A" }}
          >
            Log in
          </Link>
        <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium rounded-md text-white"
            style={{ background: "#F2801E" }}
          >
            Register
          </Link>
        </div>

        <button
        className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-t border-black/10 shadow-md p-4 flex flex-col gap-3 md:hidden">
            <a href="#features" onClick={()=>setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={()=>setMenuOpen(false)}>How it works</a>
            <Link to="/login" onClick={()=>setMenuOpen(false)}>Log in</Link>
            <Link to="/register" onClick={()=>setMenuOpen(false)}>Register</Link>
            </div>
          )
              }
      </header>

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
            
             <Link to="/register"
              className="px-6 py-3 rounded-md font-medium text-white"
              style={{ background: "#1B6B3A" }}
            >
              Get started
            </Link>
            
            <Link to ="/login"
              className="px-6 py-3 rounded-md font-medium border"
              style={{ borderColor: "#26262B33" }}
            >
              Sign in
            </Link>
          </div>
        </div>

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
        background:
          task.status === "Done"
            ? "#E7F4EA"
            : task.status === "Blocked"
            ? "#FDE8E8"
            : "#FFF0E2",
        color:
          task.status === "Done"
            ? "#1B6B3A"
            : task.status === "Blocked"
            ? "#B91C1C"
            : "#C2610F",
      }}
    >
      {task.status}
    </span>
  </div>
))}
        </div>
      </section>

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

    <section id="how-it-works" className="px-6 md:px-12 py-16 md:py-24" style={{ background: "#F8FAF8" }}>
  <div className="max-w-6xl mx-auto">
    <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-center">
      How it works
    </h2>
    <p className="text-center mb-16" style={{ color: "#6B7280" }}>
      From setup to shipped work, in four simple steps.
    </p>

    <div className="relative">
      {/* Connector line — only visible from md breakpoint up, sits behind the circles */}
      <div
        className="hidden md:block absolute top-6 left-0 w-full h-0.5"
        style={{ background: "#E8F4E9" }}
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative">
        {steps.map((s, i) => (
          <div key={i} className="relative">
            {/* Step number circle — sits on top of the connector line */}
            <div
              className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white mb-5 shadow-sm"
              style={{ background: "#05620C" }}
            >
              {i + 1}
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5 transition-shadow hover:shadow-md">
              <h3 className="font-display font-semibold text-base mb-1.5">{s.title}</h3>
              <p className="text-sm" style={{ color: "#6B7280" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

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