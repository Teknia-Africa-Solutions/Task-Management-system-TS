import { Outlet } from "react-router-dom";
import { useState,cloneElement } from "react";
import { Menu } from "lucide-react";

export default function Layout({ sidebar, topbar }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

   const sidebarWithClose = cloneElement(sidebar, {
    onClose: () => setSidebarOpen(false),
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
  {sidebarWithClose}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center px-4 py-3 bg-white border-b border-black/5">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={22} className="text-[#1F2937]" />
          </button>
        </div>

        {topbar}
        <main className="flex-1 overflow-y-auto bg-[#F8FAF8] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}