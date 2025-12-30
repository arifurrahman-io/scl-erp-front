import { useState, useEffect } from "react";
import { useAcademic } from "../../context/AcademicContext";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import {
  CheckCircle,
  XCircle,
  Save,
  Lock,
  Loader2,
  Calendar as CalIcon,
  Search,
  LayoutGrid,
  Users,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

const AttendanceEntry = () => {
  const { activeCampus } = useAcademic();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: State to track if attendance is already locked for the day
  const [isLocked, setIsLocked] = useState(false);

  const [adminScope, setAdminScope] = useState({
    campusId: "",
    class: "",
    section: "",
  });
  const [assignedScope, setAssignedScope] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (isSuperAdmin) {
      if (activeCampus) handleAdminCampusChange(activeCampus._id);
    } else {
      fetchTeacherScope();
    }
  }, [activeCampus, isSuperAdmin]);

  // Re-check lock status when date or selection changes
  useEffect(() => {
    const scope = isSuperAdmin ? adminScope : assignedScope;
    if (scope?.class || scope?.className) {
      checkAttendanceLock();
    }
  }, [attendanceDate, adminScope.section, assignedScope]);

  const fetchTeacherScope = async () => {
    try {
      const res = await axiosInstance.get("/routine/my-scopes");
      const ctScope = res.data.find(
        (s) => s.isClassTeacher && s.campusId === activeCampus?._id
      );
      if (ctScope) {
        setAssignedScope(ctScope);
        fetchStudents(
          ctScope.className,
          ctScope.sectionName,
          activeCampus?._id
        );
      }
    } catch (err) {
      toast.error("Teaching scope sync failed");
    }
  };

  const checkAttendanceLock = async () => {
    const className = isSuperAdmin
      ? adminScope.class
      : assignedScope?.className;
    const sectionName = isSuperAdmin
      ? adminScope.section
      : assignedScope?.sectionName;
    const campusId = isSuperAdmin ? adminScope.campusId : activeCampus?._id;

    if (!className || !sectionName || !campusId) return;

    try {
      // Endpoint to check if record exists for this date/section
      const res = await axiosInstance.get("/attendance/check", {
        params: {
          date: attendanceDate,
          class: className,
          section: sectionName,
          campus: campusId,
        },
      });

      if (res.data.exists) {
        setIsLocked(true);
        // Map existing data to UI
        const existingMap = {};
        res.data.records.forEach(
          (r) => (existingMap[r.student._id || r.student] = r.status)
        );
        setAttendanceData(existingMap);
      } else {
        setIsLocked(false);
      }
    } catch (err) {
      setIsLocked(false);
    }
  };

  const handleAdminCampusChange = async (cid) => {
    setAdminScope((prev) => ({
      ...prev,
      campusId: cid,
      class: "",
      section: "",
    }));
    try {
      const res = await axiosInstance.get(`/setup/classes/${cid}`);
      setClasses(res.data);
    } catch (err) {
      setClasses([]);
    }
  };

  const fetchStudents = async (className, sectionName, campusId) => {
    if (!className || !sectionName || !campusId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/students/list`, {
        params: { class: className, section: sectionName, campus: campusId },
      });
      setStudents(res.data);
      // Only set default if not locked
      if (!isLocked) {
        const initialMap = {};
        res.data.forEach((s) => (initialMap[s._id] = "Present"));
        setAttendanceData(initialMap);
      }
    } catch (err) {
      toast.error("No students found");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (id) => {
    if (isLocked)
      return toast.error("Attendance is locked and cannot be modified");
    setAttendanceData((prev) => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSubmit = async () => {
    if (isLocked)
      return toast.error("Submission blocked: Already recorded for today.");

    const scope = isSuperAdmin
      ? adminScope
      : { class: assignedScope.className, section: assignedScope.sectionName };

    if (!scope.class || !scope.section)
      return toast.error("Selection incomplete");

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/attendance/submit", {
        date: attendanceDate,
        campus: isSuperAdmin ? adminScope.campusId : activeCampus?._id,
        class: scope.class,
        section: scope.section,
        records: Object.entries(attendanceData).map(([student, status]) => ({
          student,
          status,
        })),
      });
      toast.success("Attendance synced successfully!");
      setIsLocked(true); // Lock the UI immediately after success
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      {/* LOCK NOTIFICATION */}
      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
          <ShieldAlert className="text-amber-600" size={20} />
          <p className="text-amber-800 text-xs font-bold uppercase tracking-tight">
            Attendance for this day is already submitted and locked. Changes are
            restricted.
          </p>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isLocked
                ? "bg-amber-100 text-amber-600"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {isLocked ? <Lock size={24} /> : <Users size={24} />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Attendance</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isSuperAdmin
                ? "Admin View"
                : `${assignedScope?.className} — ${assignedScope?.sectionName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            className="bg-slate-50 border-none p-3 rounded-xl font-bold text-xs"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || students.length === 0 || isLocked}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors ${
              isLocked
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : isLocked ? (
              <Lock size={16} />
            ) : (
              <Save size={16} />
            )}
            {isLocked ? "Locked" : "Submit"}
          </button>
        </div>
      </div>

      {/* ... (Admin Filter Bar remains same as your original) ... */}

      {/* STUDENT GRID */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {students.map((student) => {
            const isPresent = attendanceData[student._id] === "Present";
            return (
              <div
                key={student._id}
                onClick={() => toggleStatus(student._id)}
                className={`p-4 rounded-2xl border transition-all ${
                  isLocked ? "cursor-default" : "cursor-pointer"
                } ${
                  isPresent
                    ? "bg-white border-slate-100"
                    : "bg-rose-50 border-rose-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isPresent
                        ? "bg-indigo-600 text-white"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {student.rollNumber || student.roll}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 truncate max-w-[120px]">
                      {student.name}
                    </h4>
                    <p
                      className={`text-[9px] font-black uppercase ${
                        isPresent ? "text-indigo-600" : "text-rose-500"
                      }`}
                    >
                      {attendanceData[student._id]}
                    </p>
                  </div>
                </div>
                {isPresent ? (
                  <CheckCircle className="text-emerald-500" size={20} />
                ) : (
                  <XCircle className="text-rose-500" size={20} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceEntry;
