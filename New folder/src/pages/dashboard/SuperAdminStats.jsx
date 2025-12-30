import { useFetch } from "../../hooks/useFetch";
import EnrollmentChart from "../../components/charts/EnrollmentChart";
import { Users, School, CreditCard, Activity } from "lucide-react";

const SuperAdminStats = () => {
  const { data: stats, loading } = useFetch("/dashboard/super-admin-stats");

  const cards = [
    {
      label: "Total Students",
      value: stats?.totalStudents || 0,
      icon: <Users />,
      color: "bg-blue-500",
    },
    {
      label: "Active Campuses",
      value: stats?.totalCampuses || 0,
      icon: <School />,
      color: "bg-indigo-500",
    },
    {
      label: "Revenue (MTD)",
      value: `৳${stats?.revenue?.toLocaleString() || 0}`,
      icon: <CreditCard />,
      color: "bg-emerald-500",
    },
    {
      label: "Avg. Attendance",
      value: `${stats?.attendance || 0}%`,
      icon: <Activity />,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg text-white ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{card.label}</p>
              <h3 className="text-xl font-bold text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
      <EnrollmentChart data={stats?.chartData || []} />
    </div>
  );
};

export default SuperAdminStats;
