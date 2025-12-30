import { useFetch } from "../../hooks/useFetch";
import { useAcademic } from "../../context/AcademicContext"; // Import Global Context
import EnrollmentChart from "../../components/charts/EnrollmentChart";
import {
  Users,
  School,
  CreditCard,
  Activity,
  TrendingUp,
  ArrowUpRight,
  Building2,
} from "lucide-react";

const SuperAdminStats = () => {
  // 1. Pull active context from Global State
  const { activeYear, activeCampus } = useAcademic();

  // 2. Dynamic API endpoint: Filters by active session and branch
  const fetchUrl = `/dashboard/super-admin-stats?academicYearId=${
    activeYear?._id
  }&campusId=${activeCampus?._id || ""}`;
  const { data: stats, loading } = useFetch(fetchUrl);

  const cards = [
    {
      label: "Total Students",
      value: stats?.totalStudents || 0,
      subValue: "+12% from last term",
      icon: <Users size={24} />,
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-100",
    },
    {
      label: "Active Campuses",
      value: stats?.totalCampuses || 0,
      subValue: "Across 3 Districts",
      icon: <Building2 size={24} />,
      gradient: "from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-100",
    },
    {
      label: "Monthly Revenue",
      value: `৳${stats?.revenue?.toLocaleString() || 0}`,
      subValue: "Collected this month",
      icon: <CreditCard size={24} />,
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-100",
    },
    {
      label: "Avg. Attendance",
      value: `${stats?.attendance || 0}%`,
      subValue: "Overall daily average",
      icon: <Activity size={24} />,
      gradient: "from-amber-500 to-amber-600",
      shadow: "shadow-amber-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Header Info [cite: 2025-10-11] */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            System Overview
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Real-time analytics for{" "}
            <span className="text-indigo-600 font-bold">
              {activeCampus?.name || "All Branches"}
            </span>
          </p>
        </div>
        <div className="px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-500" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Session {activeYear?.year}
          </span>
        </div>
      </div>

      {/* Responsive Grid [cite: 2025-10-11] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => <StatSkeleton key={i} />)
          : cards.map((card, i) => (
              <div
                key={i}
                className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-4 rounded-2xl text-white bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-500`}
                  >
                    {card.icon}
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-1">
                    {card.value}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {card.label}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 italic">
                    {card.subValue}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Chart Section with Responsive Padding [cite: 2025-10-11] */}
      <div className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-indigo-600 rounded-full" />
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Enrollment Trends
          </h3>
        </div>
        <div className="h-[400px] w-full">
          <EnrollmentChart data={stats?.chartData || []} />
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for polished UX [cite: 2025-10-11]
const StatSkeleton = () => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 animate-pulse space-y-4">
    <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
    <div className="space-y-2">
      <div className="h-8 w-24 bg-slate-100 rounded-lg" />
      <div className="h-3 w-32 bg-slate-100 rounded-md" />
    </div>
  </div>
);

export default SuperAdminStats;
