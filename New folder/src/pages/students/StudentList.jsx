import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAcademic } from "../../context/AcademicContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/ui/Button";
import axiosInstance from "../../api/axiosInstance";
import {
  UserPlus,
  Search,
  Download,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Building2,
  Calendar,
  Shield,
  Users,
  X,
  AlertTriangle,
} from "lucide-react";
import { exportToExcel } from "../../utils/exportToExcel";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const StudentList = () => {
  const navigate = useNavigate();
  const { activeCampus, activeYear } = useAcademic();
  const [searchTerm, setSearchTerm] = useState("");

  // Modal/Dialog States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Construct query string for dynamic filtering based on Global Context
  const fetchUrl = `${ENDPOINTS.STUDENTS.BASE}?academicYearId=${activeYear?._id}&campusId=${activeCampus?._id}`;
  const { data, loading, refetch } = useFetch(fetchUrl);

  // --- Action Handlers ---

  const handleView = (studentId) => {
    // Redirect to a dedicated profile page using the custom studentId string
    navigate(`/students/profile/${studentId}`);
  };

  const handleEdit = (id) => {
    // Redirect to the registration form in edit mode using the DB _id
    navigate(`/students/edit/${id}`);
  };

  const openDeleteConfirm = (student) => {
    setStudentToDelete(student);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      // Calls the delete endpoint using the student's unique DB _id
      await axiosInstance.delete(
        `${ENDPOINTS.STUDENTS.BASE}/${studentToDelete._id}`
      );
      toast.success(`${studentToDelete.name}'s record has been removed.`);
      setIsConfirmOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to delete student record. Please try again.");
    }
  };

  // Search logic: Matches Name, Student ID, or Class
  const filteredStudents =
    data?.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const columns = [
    {
      header: "Student Profile",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            {row.photo ? (
              <img
                src={row.photo}
                alt={row.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-slate-50 shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border-2 border-indigo-100">
                {row.name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm tracking-tight leading-none mb-1">
              {row.name}
            </p>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
              <Shield size={10} /> {row.studentId}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Academic Path",
      render: (row) => (
        <div className="space-y-1">
          <p className="text-xs font-black text-slate-700">Class {row.class}</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Sec {row.section}
            </span>
            {row.group && (
              <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">
                {row.group}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Roll",
      render: (row) => (
        <span className="font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
          #{row.roll}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row.studentId)}
            className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="View Profile"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(row._id)}
            className="p-2 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
            title="Edit Student"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => openDeleteConfirm(row)}
            className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Delete Record"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 1. Header with Global Context info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
            <Users size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Student Directory
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                <Building2 size={10} /> {activeCampus?.name || "All Branches"}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                <Calendar size={10} />{" "}
                {activeYear?.year || "Loading Session..."}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-2xl px-6 border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            onClick={() => exportToExcel(filteredStudents, "Student_Directory")}
          >
            <Download size={18} /> Export
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 font-black shadow-xl shadow-indigo-100"
            onClick={() => navigate("/students/register")}
          >
            <UserPlus size={18} /> New Admission
          </Button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white/70 backdrop-blur-md p-5 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Name, Student ID, or Class..."
            className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border-2 border-transparent focus:border-indigo-100 rounded-2xl outline-none transition-all text-sm font-semibold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="rounded-2xl px-6 border-slate-200 text-slate-500 font-bold"
        >
          <Filter size={18} /> Advanced Filter
        </Button>
      </div>

      {/* 3. DataTable Container */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden p-4">
        <DataTable
          columns={columns}
          data={filteredStudents}
          isLoading={loading}
        />

        {/* Empty State UI */}
        {!loading && filteredStudents.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex p-6 bg-slate-50 rounded-[2.5rem] mb-4 text-slate-300">
              <Search size={48} />
            </div>
            <h3 className="text-lg font-black text-slate-800">
              No records found
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
              We couldn't find any students in Class {searchTerm} for the
              current campus and session.
            </p>
          </div>
        )}
      </div>

      {/* --- CUSTOM CONFIRMATION DIALOG --- */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800">
                Confirm Deletion
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Are you sure you want to remove{" "}
                <span className="font-bold text-slate-800">
                  {studentToDelete?.name}
                </span>
                ? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setIsConfirmOpen(false)}
                variant="outline"
                className="flex-1 rounded-xl font-bold py-3 border-slate-200 text-slate-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 rounded-xl font-black py-3 bg-rose-500 text-white shadow-lg shadow-rose-100"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
