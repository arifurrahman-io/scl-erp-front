import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/ui/Button";
import { Printer, Search, FileText, Download } from "lucide-react";

const ReportCardView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // This fetches the aggregated results we generated in the backend earlier
  const { data: reports, loading } = useFetch("/exams/all-reports");
  const [selectedReport, setSelectedReport] = useState(null);

  const columns = [
    {
      header: "Student",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
            {row.studentName[0]}
          </div>
          <span className="font-bold text-slate-700">{row.studentName}</span>
        </div>
      ),
    },
    { header: "Roll", key: "roll" },
    { header: "Term", key: "term" },
    {
      header: "GPA",
      render: (row) => (
        <span className="font-black text-indigo-600">{row.finalGrade}</span>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <button
          onClick={() => setSelectedReport(row)}
          className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all"
        >
          <FileText size={14} /> View Card
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Report Archive
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Access and print official term results.
          </p>
        </div>
        <div className="relative w-72">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search student..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-100 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-50 overflow-hidden p-4">
        <DataTable
          columns={columns}
          data={reports?.filter((r) =>
            r.studentName.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          isLoading={loading}
        />
      </div>

      {/* --- PRINTABLE REPORT CARD MODAL --- */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Toolbar (Hidden during print) */}
            <div className="p-6 border-b flex justify-between items-center bg-slate-50 print:hidden">
              <h2 className="font-black text-slate-800">Preview Report Card</h2>
              <div className="flex gap-3">
                <Button
                  onClick={() => window.print()}
                  className="bg-indigo-600 text-white rounded-xl px-6"
                >
                  <Printer size={18} className="mr-2" /> Print Now
                </Button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-slate-400 hover:text-rose-500"
                >
                  <Download size={24} />
                </button>
              </div>
            </div>

            {/* The Actual Report Card Layout */}
            <div className="flex-1 overflow-y-auto p-12 bg-white printable-area">
              <div className="border-4 border-double border-slate-200 p-8 rounded-sm relative">
                {/* Watermark/Logo Header */}
                <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
                  <h1 className="text-4xl font-black text-slate-900 uppercase">
                    Academic Transcript
                  </h1>
                  <p className="font-bold text-indigo-600 tracking-[0.3em] uppercase mt-2">
                    Term: {selectedReport.term}
                  </p>
                </div>

                {/* Student Details Info */}
                <div className="grid grid-cols-2 gap-8 mb-8 text-sm font-bold text-slate-700">
                  <div className="space-y-1">
                    <p>
                      NAME:{" "}
                      <span className="uppercase">
                        {selectedReport.studentName}
                      </span>
                    </p>
                    <p>ROLL NO: {selectedReport.roll}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p>CLASS: {selectedReport.className}</p>
                    <p>SESSION: 2025-26</p>
                  </div>
                </div>

                {/* Marks Table */}
                <table className="w-full border-collapse border border-slate-800 mb-8">
                  <thead>
                    <tr className="bg-slate-800 text-white uppercase text-xs">
                      <th className="border border-slate-800 p-3 text-left">
                        Subject
                      </th>
                      <th className="border border-slate-800 p-3">
                        Full Marks
                      </th>
                      <th className="border border-slate-800 p-3">Obtained</th>
                      <th className="border border-slate-800 p-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.subjects.map((sub, i) => (
                      <tr
                        key={i}
                        className="text-center font-bold text-slate-800"
                      >
                        <td className="border border-slate-800 p-3 text-left">
                          {sub.name}
                        </td>
                        <td className="border border-slate-800 p-3">100</td>
                        <td className="border border-slate-800 p-3">
                          {sub.marks}
                        </td>
                        <td className="border border-slate-800 p-3">
                          {sub.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer Stats */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <div className="text-sm font-black text-slate-800">
                    TOTAL MARKS: {selectedReport.totalObtained} /{" "}
                    {selectedReport.totalPossible}
                  </div>
                  <div className="text-2xl font-black text-indigo-600">
                    RESULT: {selectedReport.finalGrade}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCardView;
