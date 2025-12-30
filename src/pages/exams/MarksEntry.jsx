import { useState } from "react";
import { Save, CheckCircle, AlertCircle } from "lucide-react";
import Button from "../../components/ui/Button";

const MarksEntry = () => {
  const [examType, setExamType] = useState("CT"); // Default category
  const categories = [
    "Half-Yearly",
    "Annual",
    "Pre-Test",
    "Test",
    "CT",
    "Diary",
    "Assignment",
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      {/* Header & Category Selection */}
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Academic Grading
          </h1>
          <p className="text-sm text-slate-500">
            Post student performance records.
          </p>
        </div>

        <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => setExamType(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                examType === cat
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
          <select
            className="bg-transparent text-xs font-black text-slate-500 outline-none px-2"
            onChange={(e) => setExamType(e.target.value)}
          >
            <option>More...</option>
            {categories.slice(4).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Spreadsheet Style Input */}
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5 text-left">Roll</th>
              <th className="px-8 py-5 text-left">Student Name</th>
              <th className="px-8 py-5 text-center">Marks (Max 100)</th>
              <th className="px-8 py-5 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {/* Map through students fetched based on Teacher's Routine */}
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4 font-black text-slate-400">{i}</td>
                <td className="px-8 py-4 font-bold text-slate-800">
                  Student Name Example
                </td>
                <td className="px-8 py-4 text-center">
                  <input
                    type="number"
                    placeholder="00"
                    className="w-20 p-3 bg-slate-100 rounded-xl text-center font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </td>
                <td className="px-8 py-4">
                  <input
                    type="text"
                    placeholder="Good progress..."
                    className="w-full p-3 bg-slate-50 rounded-xl text-sm font-medium outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-8 bg-slate-50 flex justify-end">
          <Button className="bg-indigo-600 rounded-2xl px-12 font-black shadow-xl shadow-indigo-100">
            <Save className="mr-2" size={20} /> Submit {examType} Marks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarksEntry;
