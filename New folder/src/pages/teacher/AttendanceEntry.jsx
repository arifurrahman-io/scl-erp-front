import { useState, useEffect } from "react";
import { useAcademic } from "../../context/AcademicContext";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/ui/Button";
import {
  CheckCircle,
  XCircle,
  Users,
  Calendar as CalIcon,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

const AttendanceEntry = () => {
  const { activeCampus } = useAcademic();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({}); // { studentId: 'Present' | 'Absent' }
  const [loading, setLoading] = useState(false);

  // 1. Fetch Students when Class/Section is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass || !selectedSection) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/students/list`, {
          params: {
            class: selectedClass,
            section: selectedSection,
            campus: activeCampus?._id,
          },
        });
        setStudents(res.data);

        // Initialize all as "Present" by default (UX: Saves teacher's time)
        const initialMap = {};
        res.data.forEach((s) => (initialMap[s._id] = "Present"));
        setAttendanceData(initialMap);
      } catch (err) {
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass, selectedSection, activeCampus]);

  const toggleStatus = (id) => {
    setAttendanceData((prev) => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present",
    }));
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/attendance/submit", {
        date: attendanceDate,
        campus: activeCampus?._id,
        records: Object.entries(attendanceData).map(([student, status]) => ({
          student,
          status,
        })),
      });
      toast.success("Attendance submitted successfully!");
    } catch (err) {
      toast.error("Error submitting attendance");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Filters */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">
            Attendance Date
          </label>
          <input
            type="date"
            className="w-full mt-1 p-2 border rounded-lg"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
        {/* Note: Select inputs would be populated by your academic data */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">
            Class
          </label>
          <select
            className="w-full mt-1 p-2 border rounded-lg"
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {/* Map your classes here */}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">
            Section
          </label>
          <select
            className="w-full mt-1 p-2 border rounded-lg"
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">Select Section</option>
            {/* Map your sections here */}
          </select>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={students.length === 0}
          className="w-full"
        >
          <Save size={18} /> Submit Roll Call
        </Button>
      </div>

      {/* Attendance Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => {
            const isPresent = attendanceData[student._id] === "Present";
            return (
              <div
                key={student._id}
                onClick={() => toggleStatus(student._id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isPresent
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-rose-50 border-rose-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isPresent
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {student.roll}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {student.name}
                    </h4>
                    <p
                      className={`text-xs font-medium uppercase ${
                        isPresent ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {attendanceData[student._id]}
                    </p>
                  </div>
                </div>
                {isPresent ? (
                  <CheckCircle className="text-emerald-500" />
                ) : (
                  <XCircle className="text-rose-500" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {students.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500">
            Select a Class and Section to start attendance
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceEntry;
