import { useFetch } from "../../hooks/useFetch";
import { Calendar, Clock, BookOpen, MapPin } from "lucide-react";

const MyRoutine = () => {
  const { data: routine, loading } = useFetch("/routine/my-routine");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            My Class Routine
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Session 2025-26 Academic Schedule
          </p>
        </div>
        <div className="px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
            Active Period
          </span>
          <p className="text-sm font-bold text-slate-700">Spring Term</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="space-y-4">
            <div className="text-center py-3 bg-slate-800 rounded-2xl shadow-lg">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                {day.slice(0, 3)}
              </span>
            </div>

            <div className="space-y-3">
              {routine
                ?.filter((r) => r.day === day)
                .map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-[2rem] border transition-all hover:scale-105 shadow-sm ${
                      item.isClassTeacher
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500">
                        {item.startTime}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 text-sm leading-tight mb-1">
                      {item.subject.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Class {item.class.name} - {item.section.name}
                    </p>

                    {item.isClassTeacher && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase">
                        <MapPin size={8} /> Class Teacher
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRoutine;
