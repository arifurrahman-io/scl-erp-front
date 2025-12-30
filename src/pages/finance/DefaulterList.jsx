import { useState, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAcademic } from "../../context/AcademicContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/ui/Button";
import {
  Search,
  Download,
  AlertCircle,
  Phone,
  IndianRupee,
} from "lucide-react";
import { exportToExcel } from "../../utils/exportToExcel";
import { formatDate } from "../../utils/dateFormatting";

const DefaulterList = () => {
  const { activeCampus, activeYear } = useAcademic();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetching data using our custom hook which auto-appends campus/year filters
  const { data: students, loading } = useFetch("/finance/defaulters");

  // Logic to calculate total due across all listed students for the summary card
  const totalOutstanding = useMemo(() => {
    return (
      students?.reduce(
        (acc, student) => acc + (student.pendingAmount || 0),
        0
      ) || 0
    );
  }, [students]);

  // Filtering data for the search bar
  const filteredData = students?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.includes(searchTerm)
  );

  const columns = [
    { header: "Student ID", accessor: "studentId" },
    {
      header: "Student Name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{row.name}</span>
          <span className="text-xs text-slate-500">
            Class: {row.class?.name}
          </span>
        </div>
      ),
    },
    {
      header: "Pending Amount",
      render: (row) => (
        <span className="text-rose-600 font-bold">
          ৳{row.pendingAmount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Last Payment",
      render: (row) =>
        row.lastPaymentDate ? formatDate(row.lastPaymentDate) : "Never",
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="p-2 h-8 w-8"
            title="Call Guardian"
          >
            <Phone size={14} />
          </Button>
          <Button
            variant="primary"
            className="text-xs py-1 h-8"
            onClick={() =>
              (window.location.href = `/finance/collect?id=${row.studentId}`)
            }
          >
            Collect
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-rose-500 text-white rounded-lg shadow-lg">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-rose-600 text-xs font-bold uppercase tracking-wider">
              Total Defaulters
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {students?.length || 0}
            </h2>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-600 text-white rounded-lg shadow-lg">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Outstanding Dues
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              ৳{totalOutstanding.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      {/* Main List Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={() =>
              exportToExcel(students, `Defaulters_${activeCampus?.name}`)
            }
          >
            <Download size={18} />
            Export to Excel
          </Button>
        </div>

        <DataTable
          data={filteredData || []}
          columns={columns}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default DefaulterList;
