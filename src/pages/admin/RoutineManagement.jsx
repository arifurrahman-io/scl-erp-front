import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import axiosInstance from "../../api/axiosInstance";
import { Plus, Trash2, UserCheck, BookOpen, Clock } from "lucide-react";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";

const RoutineManagement = () => {
  const [filters, setFilters] = useState({ classId: "", sectionId: "" });
  const { data: routine, refetch } = useFetch(
    `/routine/admin/view?classId=${filters.classId}&sectionId=${filters.sectionId}`
  );
  const { data: teachers } = useFetch("/users?roleGroup=ACADEMIC");
  const { data: subjects } = useFetch("/settings/subjects"); // Assuming this exists

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await axiosInstance.delete(`/routine/${id}`);
      toast.success("Assignment removed");
      refetch();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Selection Header */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col md:flex-row gap-6 items-end">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Class
            </label>
            <select
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold mt-1"
              onChange={(e) =>
                setFilters({ ...filters, classId: e.target.value })
              }
            >
              <option value="">Select Class</option>
              {/* Map your classes here */}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Section
            </label>
            <select
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold mt-1"
              onChange={(e) =>
                setFilters({ ...filters, sectionId: e.target.value })
              }
            >
              <option value="">Select Section</option>
              {/* Map your sections here */}
            </select>
          </div>
        </div>
        <Button className="bg-indigo-600 rounded-2xl px-8 h-[56px] font-black shadow-lg">
          <Plus className="mr-2" /> Add Assignment
        </Button>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="flex flex-col gap-4">
            <div className="text-center py-3 bg-slate-800 rounded-2xl shadow-lg shadow-slate-100">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                {day.slice(0, 3)}
              </span>
            </div>

            <div className="space-y-3">
              {routine
                ?.filter((r) => r.day === day)
                .map((item) => (
                  <div
                    key={item._id}
                    className="group relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all border-l-4 border-l-indigo-500"
                  >
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 size={12} />
                    </button>

                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold">
                        {item.startTime} - {item.endTime}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">
                      {item.subject?.name}
                    </h4>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <UserCheck size={10} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 truncate">
                        {item.teacher?.name}
                      </span>
                    </div>

                    {item.isClassTeacher && (
                      <span className="mt-2 block text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg uppercase tracking-tighter text-center">
                        Class Teacher
                      </span>
                    )}
                  </div>
                ))}

              {routine?.filter((r) => r.day === day).length === 0 && (
                <div className="py-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                  <BookOpen size={20} className="mb-2 opacity-20" />
                  <span className="text-[10px] font-bold uppercase">
                    No Class
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineManagement;
