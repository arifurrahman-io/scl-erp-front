import { useAcademic } from "../../context/AcademicContext";
import EnrollmentChart from "../../components/charts/EnrollmentChart";
import {
  Users,
  CreditCard,
  Activity,
  TrendingUp,
  ArrowUpRight,
  Building2,
  Calendar,
  Layers,
} from "lucide-react";

const SuperAdminStats = ({ stats, loading }) => {
  const { activeYear, activeCampus } = useAcademic();

  // Integrated Card Configuration for High-Performance UI [cite: 2025-10-11]
  const cards = [
    {
      label: "Total Students",
      value: stats?.totalStudents?.toLocaleString() || "0",
      subValue: stats?.studentGrowth || "+0% this session",
      icon: <Users size={24} />,
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-100",
    },
    {
      label: "Live Campuses",
      value: stats?.totalCampuses || "0",
      subValue: "Network Active",
      icon: <Building2 size={24} />,
      gradient: "from-violet-500 to-purple-600",
      shadow: "shadow-purple-100",
    },
    {
      label: "Revenue (MTD)",
      value: `৳${stats?.revenue?.toLocaleString() || "0"}`,
      subValue: "Current Collection",
      icon: <CreditCard size={24} />,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-100",
    },
    {
      label: "Avg. Attendance",
      value: `${stats?.attendanceRate || 0}%`,
      subValue: "System Average",
      icon: <Activity size={24} />,
      gradient: "from-orange-500 to-amber-600",
      shadow: "shadow-orange-100",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* 1. Dynamic Context Header [cite: 2025-10-11] */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/60 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <Layers size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Operational Intel
            </span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Institutional <span className="text-indigo-600">Pulse</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium italic">
            Monitoring{" "}
            <span className="font-bold text-slate-700">
              {activeCampus?.name || "Global Network"}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <Calendar size={18} className="text-indigo-500" />
            <div className="text-left">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Active Session
              </p>
              <p className="text-xs font-black text-slate-700">
                {activeYear?.year || "N/A"}
              </p>
            </div>
          </div>
          <div className="px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
            <TrendingUp size={18} className="text-emerald-500" />
            <div className="text-left">
              <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                System Status
              </p>
              <p className="text-xs font-black text-emerald-700 uppercase">
                Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Metric Grid [cite: 2025-10-11] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => <StatSkeleton key={i} />)
          : cards.map((card, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-[3.5rem] border border-slate-50 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div
                    className={`p-5 rounded-3xl text-white bg-gradient-to-br ${card.gradient} shadow-2xl ${card.shadow} group-hover:rotate-6 transition-all duration-500`}
                  >
                    {card.icon}
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-4xl font-black text-slate-800 tracking-tighter mb-1">
                    {card.value}
                  </h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    {card.label}
                  </p>
                </div>

                <div className="mt-4 pt-5 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-bold text-slate-400 italic">
                    {card.subValue}
                  </span>
                  <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-indigo-500" />
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* 3. Trends & Analytics Section [cite: 2025-10-11] */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-3 h-10 bg-indigo-600 rounded-full" />
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  Growth Projection
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Enrollment over time
                </p>
              </div>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black text-slate-500 outline-none">
              <option>Last 6 Months</option>
              <option>Full Year</option>
            </select>
          </div>
          <div className="h-[420px] w-full">
            <EnrollmentChart data={stats?.chartData || []} />
          </div>
        </div>

        {/* 4. Quick Actions / Context Alert [cite: 2025-10-11] */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-200/20 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2 tracking-tight">
              Active Insight
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              The system is currently optimized for the{" "}
              <span className="text-indigo-400 font-bold">
                {activeYear?.year}
              </span>{" "}
              session. Data is being aggregated from all{" "}
              <span className="text-indigo-400 font-bold">
                {stats?.totalCampuses || 0}
              </span>{" "}
              campuses.
            </p>
          </div>

          <div className="space-y-4 relative z-10 mt-8">
            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              Download Full Report
            </button>
            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-tighter">
              Last synced: Just now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatSkeleton = () => (
  <div className="bg-white p-8 rounded-[3.5rem] border border-slate-50 animate-pulse space-y-6 shadow-xl shadow-slate-100">
    <div className="w-16 h-16 bg-slate-100 rounded-3xl" />
    <div className="space-y-3">
      <div className="h-10 w-28 bg-slate-100 rounded-xl" />
      <div className="h-4 w-40 bg-slate-100 rounded-lg" />
    </div>
  </div>
);

export default SuperAdminStats;
