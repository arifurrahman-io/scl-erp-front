import { useState } from "react";
import { useAcademic } from "../../context/AcademicContext";
import axiosInstance from "../../api/axiosInstance";
import { Printer, FileText, Download, CheckCircle } from "lucide-react";
import Button from "../../components/ui/Button";

const ResultGenerator = () => {
  const { activeCampus } = useAcademic();
  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    term: "Half-Yearly",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/exams/generate-reports`, {
        params: filters,
      });
      setResults(res.data);
    } catch (err) {
      console.error("Error generating results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Configuration Header */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col md:flex-row gap-6 items-end">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Exam Term
            </label>
            <select
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
              onChange={(e) => setFilters({ ...filters, term: e.target.value })}
            >
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          {/* Add Class/Section Selectors here... */}
        </div>
        <Button
          onClick={handleGenerate}
          className="bg-indigo-600 rounded-2xl px-8 h-[56px] font-black shadow-lg"
        >
          Generate Reports
        </Button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((report, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  {report.studentName}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Roll: {report.roll}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-indigo-600 leading-none">
                  {report.finalGrade}
                </span>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  Final Grade
                </p>
              </div>
            </div>

            <table className="w-full mb-6">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                  <th className="text-left pb-2">Subject</th>
                  <th className="text-center pb-2">Marks</th>
                  <th className="text-right pb-2">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {report.subjects.map((sub, sIdx) => (
                  <tr key={sIdx} className="text-sm font-bold text-slate-600">
                    <td className="py-3">{sub.name}</td>
                    <td className="py-3 text-center">{sub.marks}</td>
                    <td className="py-3 text-right text-indigo-500">
                      {sub.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs font-bold text-slate-500">
                Average Percentage:{" "}
                <span className="text-slate-800">{report.percentage}%</span>
              </p>
              <button className="flex items-center gap-2 text-indigo-600 font-black text-xs hover:underline">
                <Printer size={16} /> Print Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultGenerator;
