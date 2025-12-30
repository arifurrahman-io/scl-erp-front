import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAcademic } from "../../context/AcademicContext";
import axiosInstance from "../../api/axiosInstance";
import {
  Plus,
  Trash2,
  UserCheck,
  BookOpen,
  Clock,
  X,
  Save,
  Loader2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";

const RoutineManagement = () => {
  const { activeCampus, currentAcademicYear } = useAcademic();
  const [filters, setFilters] = useState({ classId: "", sectionId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Subject State based on Selection
  const [availableSubjects, setAvailableSubjects] = useState([]);

  // --- 1. Fetch Dynamic Data ---
  const { data: routine, refetch } = useFetch(
    activeCampus?._id
      ? `/routine?campusId=${activeCampus._id}&classId=${filters.classId}&sectionId=${filters.sectionId}`
      : null
  );

  const { data: teachers } = useFetch("/users?roleGroup=ACADEMIC");
  const { data: masterData } = useFetch(
    activeCampus?._id
      ? `/settings/master-structure?campusId=${activeCampus._id}`
      : null
  );

  // --- 2. Dynamic Subject Filtering Logic ---
  const handleClassChange = async (classId) => {
    setFilters({ ...filters, classId });
    if (classId && activeCampus?._id) {
      try {
        // Fetches only subjects deployed to this specific campus/class intersection
        const { data } = await axiosInstance.get(
          `/setup/subjects/${classId}?campusId=${activeCampus._id}`
        );
        setAvailableSubjects(data);
      } catch (err) {
        toast.error("Error loading subjects for this branch");
      }
    } else {
      setAvailableSubjects([]);
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    try {
      await axiosInstance.post("/routine", {
        ...payload,
        campus: activeCampus._id,
        academicYear: currentAcademicYear._id,
      });
      toast.success("Schedule Updated");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Time conflict detected");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Selection Header */}
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col lg:flex-row gap-6 items-end justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Filter Class
            </label>
            <select
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
              value={filters.classId}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              <option value="">All Classes</option>
              {masterData?.classes?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Filter Section
            </label>
            <select
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
              value={filters.sectionId}
              onChange={(e) =>
                setFilters({ ...filters, sectionId: e.target.value })
              }
            >
              <option value="">All Sections</option>
              {masterData?.sections?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 rounded-2xl px-10 h-[60px] font-black shadow-xl shadow-indigo-100 hover:scale-105 transition-transform"
        >
          <Plus className="mr-2" /> New Assignment
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
            <div className="space-y-3 min-h-[200px]">
              {routine
                ?.filter((r) => r.day === day)
                .map((item) => (
                  <div
                    key={item._id}
                    className="group relative bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all border-l-4 border-l-indigo-500"
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
                    <p className="text-[9px] font-bold text-indigo-600 uppercase mb-3">
                      Class {item.class?.name} • {item.section?.name}
                    </p>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-black">
                        {item.teacher?.name[0]}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 truncate">
                        {item.teacher?.name}
                      </span>
                    </div>
                  </div>
                ))}
              {routine?.filter((r) => r.day === day).length === 0 && (
                <div className="h-full py-8 border-2 border-dashed border-slate-50 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-200">
                  <BookOpen size={20} className="mb-2 opacity-10" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">
                    No Class
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD ASSIGNMENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-rose-500"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-8">
              Schedule New Period
            </h2>

            <form
              onSubmit={handleAddAssignment}
              className="grid grid-cols-2 gap-6"
            >
              <div className="col-span-2 md:col-span-1 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Day
                </label>
                <select
                  name="day"
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 md:col-span-1 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Teacher
                </label>
                <select
                  name="teacher"
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                >
                  <option value="">Select Faculty</option>
                  {teachers?.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Target Class
                </label>
                <select
                  name="class"
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  <option value="">Select Class</option>
                  {masterData?.classes?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Target Section
                </label>
                <select
                  name="section"
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                >
                  <option value="">Select Section</option>
                  {masterData?.sections?.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Dynamic Subject
                </label>
                <select
                  name="subject"
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-indigo-50"
                >
                  <option value="">
                    {filters.classId ? "Select Subject" : "Choose Class First"}
                  </option>
                  {availableSubjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                />
              </div>

              <Button
                disabled={isSubmitting}
                className="col-span-2 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <>
                    <Save className="mr-2" /> Save Assignment
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineManagement;
