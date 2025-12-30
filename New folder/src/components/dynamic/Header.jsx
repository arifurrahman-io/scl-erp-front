import { useState, useEffect } from "react";
import { useAcademic } from "../../context/AcademicContext"; // Ensure correct import
import useAuthStore from "../../store/useAuthStore";
import axiosInstance from "../../api/axiosInstance";
import {
  Building2,
  Calendar,
  User,
  ChevronDown,
  Bell,
  Menu,
  Search,
  X,
} from "lucide-react";

const Header = ({ toggleSidebar }) => {
  // Pulling values and change methods from your AcademicContext
  const {
    activeYear,
    activeCampus,
    years,
    campuses,
    changeYear,
    changeCampus,
  } = useAcademic();

  const { user } = useAuthStore();
  const [schoolProfile, setSchoolProfile] = useState({
    name: "EduSmart",
    logo: null,
  });

  // 1. Fetch Dynamic Branding Data
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await axiosInstance.get("/campuses/school-profile");
        if (res.data) setSchoolProfile(res.data);
      } catch (error) {
        console.error("Failed to load branding:", error);
      }
    };
    fetchBranding();
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
      {/* LEFT SECTION: Mobile Toggle & Switchers */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Global Switchers Container (Responsive spacing) */}
        <div className="flex items-center gap-3 md:gap-6 ml-1 md:ml-0">
          {/* SESSION SWITCHER */}
          <div className="relative flex items-center gap-2 group">
            <div className="hidden sm:flex p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Calendar size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Session
              </span>
              <div className="relative">
                <select
                  value={activeYear?._id || ""}
                  onChange={(e) => changeYear(e.target.value)}
                  className="bg-transparent text-[12px] md:text-sm font-bold text-slate-800 outline-none cursor-pointer appearance-none pr-5 z-10"
                >
                  {years.map((y) => (
                    <option key={y._id} value={y._id}>
                      {y.year}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-0 top-1 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Vertical Divider (Hidden on very small screens) */}
          <div className="hidden xs:block h-8 w-[1px] bg-slate-100 mx-1 md:mx-2" />

          {/* CAMPUS SWITCHER */}
          {campuses.length > 0 && (
            <div className="relative flex items-center gap-2 group">
              <div className="hidden sm:flex p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Building2 size={18} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Campus
                </span>
                <div className="relative">
                  <select
                    value={activeCampus?._id || ""}
                    onChange={(e) => changeCampus(e.target.value)}
                    className="bg-transparent text-[12px] md:text-sm font-bold text-slate-800 outline-none cursor-pointer appearance-none pr-5 max-w-[80px] md:max-w-[150px] truncate z-10"
                  >
                    {campuses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-0 top-1 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Profile & Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Responsive Search (Hide on mobile text, keep icon) */}
        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
          <Search size={20} strokeWidth={2} />
        </button>

        {/* User Profile Component [cite: 2025-10-11] */}
        <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-slate-100 group cursor-pointer">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-black text-slate-800 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
              {user?.name}
            </p>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {user?.role}
            </span>
          </div>
          <div className="relative">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-all duration-300">
              <User size={20} strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
