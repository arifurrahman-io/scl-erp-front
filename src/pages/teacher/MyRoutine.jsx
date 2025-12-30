import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAcademic } from "../../context/AcademicContext"; // Use your context hook
import axiosInstance from "../../api/axiosInstance";
import {
  Users,
  BookOpen,
  Plus,
  Trash2,
  X,
  Save,
  Loader2,
  GraduationCap,
  Layers,
  Star,
} from "lucide-react";
import { toast } from "react-hot-toast";

const RoutineManagement = () => {
  // 1. Destructure using your EXACT context variable names
  const { activeCampus, activeYear, loading: contextLoading } = useAcademic();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  // --- 2. Safe Data Fetching ---
  // Only trigger the API if the context has successfully resolved
  const campusId = activeCampus?._id;
  const yearId = activeYear?._id;

  const {
    data: mappings,
    refetch,
    loading: dataLoading,
  } = useFetch(
    campusId && yearId
      ? `/routine?campusId=${campusId}&academicYearId=${yearId}`
      : null
  );

  const { data: staff } = useFetch("/users?roleGroup=ACADEMIC");
  const { data: master } = useFetch(
    campusId ? `/settings/master-structure?campusId=${campusId}` : null
  );

  // --- 3. Dynamic Subject Filtering ---
  useEffect(() => {
    if (selectedClass && campusId) {
      const fetchClassSubjects = async () => {
        try {
          const { data } = await axiosInstance.get(
            `/setup/subjects/${selectedClass}?campusId=${campusId}`
          );
          setFilteredSubjects(data);
        } catch (err) {
          toast.error("Failed to load class subjects");
        }
      };
      fetchClassSubjects();
    }
  }, [selectedClass, campusId]);

  // --- 4. Loading Guard (The "Just Loading" experience) ---
  // If context is still fetching the session, show a full-page attractive loader
  if (contextLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute top-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
          Syncing Session
        </p>
      </div>
    );
  }

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    try {
      await axiosInstance.post("/routine/create", {
        ...payload,
        campus: campusId,
        academicYear: yearId,
        isClassTeacher: payload.isClassTeacher === "on",
      });
      toast.success("Assignment mapped successfully");
      setIsModalOpen(false);
      setSelectedClass("");
      refetch();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Assignment conflict detected"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this teacher assignment?")) return;
    try {
      await axiosInstance.delete(`/routine/${id}`);
      toast.success("Assignment removed");
      refetch();
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 5. Header Area [cite: 2025-10-11] */}
      <div className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 text-white">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Teacher Mappings
          </h1>
          <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px] mt-2 bg-white/10 px-4 py-1 rounded-full inline-block">
            {activeCampus?.name} • Session{" "}
            {activeYear?.year || activeYear?.name}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-indigo-600 px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-2xl hover:scale-105 transition-all group"
        >
          <Plus
            size={24}
            className="group-hover:rotate-90 transition-transform"
          />
          Create Assignment
        </button>
      </div>

      {/* 6. Assignment Cards [cite: 2025-10-11] */}
      {dataLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappings?.map((item) => (
            <div
              key={item._id}
              className="group relative bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all overflow-hidden"
            >
              {item.isClassTeacher && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Star size={12} fill="currentColor" /> Class Teacher
                </div>
              )}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-indigo-600 font-black text-2xl">
                  {item.teacher?.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 leading-tight">
                    {item.teacher?.name}
                  </h4>
                  <p className="text-sm font-bold text-indigo-600 mt-1">
                    {item.subject?.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-400">
                  <Layers size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Class {item.class?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Sec {item.section?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-8 w-full py-4 rounded-2xl bg-rose-50 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Remove Mapping
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 7. Modal Form [cite: 2025-10-11] */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl p-12 relative animate-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-10 right-10 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={28} />
            </button>
            <h2 className="text-3xl font-black text-slate-800 mb-10 flex items-center gap-4">
              <Plus className="text-indigo-600" /> New Mapping
            </h2>
            <form onSubmit={handleAddAssignment} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                    Teacher
                  </label>
                  <select
                    name="teacher"
                    required
                    className="w-full p-5 bg-slate-50 rounded-[2rem] font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-100"
                  >
                    <option value="">Select Faculty</option>
                    {staff?.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                    Class
                  </label>
                  <select
                    name="class"
                    required
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-5 bg-slate-50 rounded-[2rem] font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-100"
                  >
                    <option value="">Choose Class</option>
                    {master?.classes?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                    Section
                  </label>
                  <select
                    name="section"
                    required
                    className="w-full p-5 bg-slate-50 rounded-[2rem] font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-100"
                  >
                    <option value="">Choose Section</option>
                    {master?.sections?.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                    Subject
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full p-5 bg-slate-50 rounded-[2rem] font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-100"
                  >
                    <option value="">
                      {selectedClass ? "Choose Subject" : "Class First"}
                    </option>
                    {filteredSubjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6 bg-indigo-50 rounded-[2.5rem] flex items-center justify-between border border-indigo-100">
                <div>
                  <h4 className="text-sm font-black text-indigo-900">
                    Class Teacher Assignment
                  </h4>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase">
                    Section Lead Privileges
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="isClassTeacher"
                  className="w-6 h-6 rounded-lg accent-indigo-600"
                />
              </div>
              <button
                disabled={isSubmitting}
                className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black shadow-2xl shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}{" "}
                Confirm Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineManagement;
