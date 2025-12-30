import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axiosInstance";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ClipboardCheck,
  Settings,
  LogOut,
  ChevronRight,
  Database,
  Globe,
  Calendar,
  Building2,
  ShieldCheck,
  Banknote,
  Layers,
  X, // Added X for mobile close
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, role } = useAuth();
  const location = useLocation();
  const [schoolProfile, setSchoolProfile] = useState({
    name: "EduSmart",
    logo: null,
  });

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await axiosInstance.get("/campuses/school-profile");
        if (res.data) setSchoolProfile(res.data);
      } catch (error) {
        console.error("Branding load failed:", error);
      }
    };
    fetchBranding();
  }, []);

  const navGroups = [
    {
      group: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={20} />,
          path: "/",
          roles: [
            "SUPER_ADMIN",
            "ADMIN",
            "TEACHER",
            "CLASS_TEACHER",
            "ACCOUNTANT",
          ],
        },
      ],
    },
    {
      group: "Academic",
      items: [
        {
          label: "Student Directory",
          icon: <Users size={20} />,
          path: "/students",
          roles: ["SUPER_ADMIN", "ADMIN"],
        },
        {
          label: "Attendance",
          icon: <ClipboardCheck size={20} />,
          path: "/attendance",
          roles: ["CLASS_TEACHER", "TEACHER"],
        },
      ],
    },
    {
      group: "Finance",
      items: [
        {
          label: "Collect Fees",
          icon: <CreditCard size={20} />,
          path: "/finance/collect",
          roles: ["SUPER_ADMIN", "ACCOUNTANT"],
        },
      ],
    },
    {
      group: "Management",
      items: [
        {
          label: "Class Setup",
          icon: <Layers size={20} />,
          path: "/settings/structure",
          roles: ["SUPER_ADMIN"],
        },
        {
          label: "Fee Blueprints",
          icon: <Banknote size={20} />,
          path: "/settings/fees",
          roles: ["SUPER_ADMIN"],
        },
        {
          label: "Academic Years",
          icon: <Calendar size={20} />,
          path: "/settings/years",
          roles: ["SUPER_ADMIN"],
        },
        {
          label: "Branding",
          icon: <Globe size={20} />,
          path: "/settings/branding",
          roles: ["SUPER_ADMIN"],
        },
        {
          label: "Global Settings",
          icon: <Settings size={20} />,
          path: "/settings",
          roles: ["SUPER_ADMIN"],
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Overlay: Darkens background when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-100 transition-all duration-300 shadow-sm flex flex-col
          ${
            isOpen
              ? "w-64 translate-x-0"
              : "w-20 -translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Branding Area */}
        <div className="h-20 flex items-center justify-between px-6 mb-4">
          <div className="flex items-center gap-3 truncate">
            <div className="min-w-[40px] h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 overflow-hidden">
              {schoolProfile.logo ? (
                <img
                  src={schoolProfile.logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShieldCheck size={20} strokeWidth={2.5} />
              )}
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-black text-slate-800 tracking-tight leading-none truncate max-w-[120px]">
                  {schoolProfile.name}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
                  Enterprise
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          {isOpen && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-400 hover:text-indigo-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar pb-6">
          {navGroups.map((group, groupIdx) => {
            const filteredItems = group.items.filter((item) =>
              item.roles.includes(role)
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-2">
                {isOpen && (
                  <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    {group.group}
                  </p>
                )}
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() =>
                          window.innerWidth < 1024 && toggleSidebar()
                        } // Close on click for mobile
                        className={`group flex items-center justify-between px-3 py-3 rounded-2xl transition-all relative ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                            : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`transition-transform duration-300 ${
                              isActive ? "scale-110" : "group-hover:scale-110"
                            }`}
                          >
                            {item.icon}
                          </span>
                          {isOpen && (
                            <span className="text-sm font-bold whitespace-nowrap tracking-tight">
                              {item.label}
                            </span>
                          )}
                        </div>
                        {isOpen && isActive && (
                          <ChevronRight size={14} className="opacity-50" />
                        )}
                        {!isOpen && isActive && (
                          <div className="absolute left-0 w-1.5 h-6 bg-indigo-600 rounded-r-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 bg-slate-50/50 mt-auto border-t border-slate-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all group"
          >
            <LogOut
              size={20}
              className="transition-transform group-hover:-translate-x-1"
            />
            {isOpen && (
              <span className="text-sm font-black uppercase tracking-widest">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
