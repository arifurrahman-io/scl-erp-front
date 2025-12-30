import { useState, useEffect } from "react";
import { useAcademic } from "../../context/AcademicContext";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/ui/Button";
import { Save, ClipboardList, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const MarksEntry = () => {
  const { activeCampus, activeYear } = useAcademic();

  // Selection State
  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    subjectId: "",
    examType: "Final Term",
  });
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({}); // { studentId: { subjective: 0, objective: 0, practical: 0 } }
  const [loading, setLoading] = useState(false);

  // Fetch students and existing marks when filters change
  const fetchStudentList = async () => {
    if (!filters.classId || !filters.subjectId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get("/exams/marks-sheet", {
        params: { ...filters, campusId: activeCampus?._id },
      });
      setStudents(res.data.students);

      // Initialize marks state with existing data or zeros
      const initialMarks = {};
      res.data.students.forEach((s) => {
        initialMarks[s._id] = s.existingMarks || {
          subjective: "",
          objective: "",
          practical: "",
        };
      });
      setMarksData(initialMarks);
    } catch (err) {
      toast.error("Failed to load marks sheet");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (studentId, field, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post("/exams/submit-marks", {
        ...filters,
        academicYearId: activeYear?._id,
        campusId: activeCampus?._id,
        marksArray: Object.entries(marksData).map(([studentId, scores]) => ({
          studentId,
          ...scores,
        })),
      });
      toast.success("Marks saved successfully!");
    } catch (err) {
      toast.error("Error saving marks. Check your connection.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <ClipboardList size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            Result Management
          </h1>
        </div>
        <Button onClick={handleSave} disabled={students.length === 0}>
          <Save size={18} /> Save Marks
        </Button>
      </div>

      {/* Grid: 3 Columns for Selection, 9 Columns for Sheet */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Configuration
            </h3>
            <div>
              <label className="text-xs font-semibold mb-1 block">
                Exam Type
              </label>
              <select className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option>First Term</option>
                <option>Mid Term</option>
                <option>Final Term</option>
              </select>
            </div>
            {/* Class/Subject selectors would be populated here */}
            <Button
              variant="outline"
              className="w-full"
              onClick={fetchStudentList}
            >
              Load Marksheet
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800">
              Ensure all subjective and objective marks are entered before
              locking the result.
            </p>
          </div>
        </div>

        {/* Marksheet Grid */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {students.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">Roll</th>
                  <th className="px-6 py-4 font-bold text-slate-600">
                    Student Name
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-center">
                    Subj. (40)
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-center">
                    Obj. (40)
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-center">
                    Prac. (20)
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-center">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student) => {
                  const scores = marksData[student._id] || {};
                  const total =
                    (Number(scores.subjective) || 0) +
                    (Number(scores.objective) || 0) +
                    (Number(scores.practical) || 0);

                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                        {student.roll}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {student.name}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          className="w-16 mx-auto block p-1 border rounded text-center"
                          value={scores.subjective}
                          onChange={(e) =>
                            handleInputChange(
                              student._id,
                              "subjective",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          className="w-16 mx-auto block p-1 border rounded text-center"
                          value={scores.objective}
                          onChange={(e) =>
                            handleInputChange(
                              student._id,
                              "objective",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          className="w-16 mx-auto block p-1 border rounded text-center"
                          value={scores.practical}
                          onChange={(e) =>
                            handleInputChange(
                              student._id,
                              "practical",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`font-bold ${
                            total < 33 ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
              <p>Select criteria and load marksheet to begin entry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CRITICAL FIX: The export statement
export default MarksEntry;
