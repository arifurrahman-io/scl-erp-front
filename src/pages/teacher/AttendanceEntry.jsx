import { useState, useEffect } from "react";
import { useAcademic } from "../../context/AcademicContext";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/ui/Button";
import {
  CheckCircle,
  XCircle,
  Users,
  Save,
  Lock,
  Loader2,
  Calendar as CalIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const AttendanceEntry = () => {
  const { activeCampus } = useAcademic();
  const [assignedScope, setAssignedScope] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Teacher's Scope (Locking Logic)
  useEffect(() => {
    const fetchTeacherScope = async () => {
      try {
        const res = await axiosInstance.get("/routine/my-scopes");
        // Find the specific assignment for the ACTIVE CAMPUS where user is CLASS_TEACHER
        const ctScope = res.data.find(
          (s) => s.isClassTeacher && s.campusId === activeCampus?._id
        );

        if (ctScope) {
          setAssignedScope(ctScope);
          fetchStudents(ctScope);
        } else {
          setAssignedScope(null);
          setStudents([]);
        }
      } catch (err) {
        console.error("Scope fetch error", err);
      }
    };

    if (activeCampus?._id) fetchTeacherScope();
  }, [activeCampus]);

  // 2. Fetch Students for the Locked Scope
  const fetchStudents = async (scope) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/students/list`, {
        params: {
          class: scope.classId,
          section: scope.sectionId,
          campus: activeCampus?._id,
        },
      });
      setStudents(res.data);

      // Default all to Present
      const initialMap = {};
      res.data.forEach((s) => (initialMap[s._id] = "Present"));
      setAttendanceData(initialMap);
    } catch (err) {
      toast.error("Failed to load students for this section");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (id) => {
    setAttendanceData((prev) => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSubmit = async () => {
    if (!assignedScope) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/attendance/submit", {
        date: attendanceDate,
        campus: activeCampus?._id,
        class: assignedScope.classId,
        section: assignedScope.sectionId,
        records: Object.entries(attendanceData).map(([student, status]) => ({
          student,
          status,
        })),
      });
      toast.success("Roll call submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI for Teachers NOT assigned to a class
  if (!assignedScope && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-[3rem] shadow-xl border border-slate-100 p-12 text-center animate-in fade-in">
        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <Lock size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">
          Access Restricted
        </h2>
        <p className="text-slate-500 max-w-sm mt-2 font-medium">
          You are not designated as the Class Teacher for any section at{" "}
          <b>{activeCampus?.name || "this campus"}</b>.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
            <CalIcon size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Daily Attendance
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {activeCampus?.name}
              </span>
              <span className="px-3 py-1 bg-emerald-400 text-indigo-900 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Class {assignedScope?.className} - {assignedScope?.sectionName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="date"
            className="bg-white/10 border border-white/20 p-3 rounded-2xl outline-none font-bold text-sm w-full md:w-auto"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || students.length === 0}
            className="bg-white text-indigo-600 hover:bg-slate-50 px-8 rounded-2xl font-black"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            <span className="ml-2 hidden md:inline">Save Attendance</span>
          </Button>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Students"
          value={students.length}
          color="bg-slate-800"
        />
        <StatCard
          label="Present"
          value={
            Object.values(attendanceData).filter((v) => v === "Present").length
          }
          color="bg-emerald-500"
        />
        <StatCard
          label="Absent"
          value={
            Object.values(attendanceData).filter((v) => v === "Absent").length
          }
          color="bg-rose-500"
        />
      </div>

      {/* Student Attendance Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {students.map((student) => {
            const isPresent = attendanceData[student._id] === "Present";
            return (
              <div
                key={student._id}
                onClick={() => toggleStatus(student._id)}
                className={`p-5 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group ${
                  isPresent
                    ? "bg-white border-emerald-100 hover:border-emerald-300"
                    : "bg-rose-50 border-rose-100 hover:border-rose-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg transition-transform group-hover:scale-110 ${
                      isPresent
                        ? "bg-emerald-500 text-white shadow-emerald-100"
                        : "bg-rose-500 text-white shadow-rose-100"
                    }`}
                  >
                    {student.roll}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-tight truncate w-32">
                      {student.name}
                    </h4>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                        isPresent ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {attendanceData[student._id]}
                    </p>
                  </div>
                </div>
                {isPresent ? (
                  <CheckCircle className="text-emerald-500" size={24} />
                ) : (
                  <XCircle className="text-rose-500" size={24} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 flex items-center gap-6">
    <div className={`w-3 h-12 rounded-full ${color}`} />
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">
        {value}
      </h3>
    </div>
  </div>
);

export default AttendanceEntry;
