import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dynamic/Sidebar";
import Header from "../components/dynamic/Header";

const DashboardLayout = () => {
  // Initialize state based on screen size: closed on mobile, open on desktop
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  // Handle window resizing to ensure UI remains consistent
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 1. Mobile Overlay: Darkens the screen when sidebar is open on small devices */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Dynamic Sidebar: Passes toggle function to close itself on mobile item click */}
      <Sidebar
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 3. Header: Now receives the toggle function for the hamburger menu */}
        <Header
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />

        {/* 4. Main Content: Adjusts padding for mobile/desktop */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>

        {/* 5. Footer: Responsive padding */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 py-4 px-4 md:px-8 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} EduSmart School ERP. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
