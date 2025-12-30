import { useFetch } from "../../hooks/useFetch";
import { Clock, BookOpen, Users, CheckCircle } from "lucide-react";

const TeacherSchedule = () => {
  // Fetches routine and class stats for the logged-in teacher
  const { data: dashboardData, loading } = useFetch(
    "/teacher/dashboard-summary"
  );

  if (loading)
    return <div className="h-40 bg-slate-100 animate-pulse rounded-xl" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily Routine Section */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" /> Today's Schedule
          </h3>
          <span className="text-xs font-semibold text-slate-400 uppercase">
            {new Date().toLocaleDateString("en-US", { weekday: "long" })}
          </span>
        </div>

        <div className="space-y-3">
          {dashboardData?.routine?.length > 0 ? (
            dashboardData.routine.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-100 transition-colors group"
              >
                <div className="flex gap-4 items-center">
                  <div className="text-center w-16">
                    <p className="text-xs font-bold text-indigo-600 uppercase">
                      {item.time}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-800">{item.subject}</h4>
                    <p className="text-xs text-slate-500">
                      Class {item.className} • Section {item.sectionName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => (window.location.href = "/attendance")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-indigo-600 border border-indigo-200 px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
                >
                  Mark Attendance
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">
              No classes scheduled for today.
            </div>
          )}
        </div>
      </div>

      {/* Teacher's Quick Stats */}
      <div className="space-y-6">
        <div className="bg-indigo-600 p-6 rounded-xl shadow-lg shadow-indigo-100 text-white">
          <h4 className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-4">
            Class Overview
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-80">Total Students</span>
              <span className="text-xl font-bold">
                {dashboardData?.stats?.totalStudents || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-80">Today's Attendance</span>
              <span className="text-xl font-bold">
                {dashboardData?.stats?.attendanceRate || 0}%
              </span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-indigo-500/50">
            <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-semibold transition-colors">
              View Detailed Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedule;
