import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAcademic } from "../../context/AcademicContext";
import axiosInstance from "../../api/axiosInstance";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import {
  GraduationCap,
  UserPlus,
  MapPin,
  Edit3,
  Trash2,
  ShieldCheck,
  Search,
  Users,
  X,
  Loader2,
  Link2,
} from "lucide-react";

const TeacherManagement = () => {
  const { activeCampus, currentAcademicYear } = useAcademic();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. DATA FETCHING ---

  // FIX: If academicYearId is not yet loaded from context, we fetch all academic staff
  // without the year filter first so the table isn't empty on load.
  const staffUrl = `/users?roleGroup=ACADEMIC${
    currentAcademicYear?._id ? `&academicYearId=${currentAcademicYear._id}` : ""
  }`;
  const { data: staff, loading, refetch } = useFetch(staffUrl);

  const { data: campuses } = useFetch("/campuses");

  // Fetch structure only when campus is selected
  const structureUrl = activeCampus?._id
    ? `/settings/master-structure?campusId=${activeCampus._id}`
    : null;
  const { data: masterStructure } = useFetch(structureUrl);

  // Filter local state based on roles and search
  const teachers =
    staff?.filter(
      (user) =>
        (user.role === "TEACHER" || user.role === "CLASS_TEACHER") &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getID = (data) => (data?._id ? data._id : data);

  // --- 2. HANDLERS ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    data.assignedCampuses = Array.from(formData.getAll("assignedCampuses"));

    if (data.role === "CLASS_TEACHER") {
      data.classTeacherOf = {
        class: data.targetClass,
        section: data.targetSection,
      };
    }

    try {
      if (editingTeacher) {
        await axiosInstance.put(`/users/${editingTeacher._id}`, data);
        toast.success("Profile Synchronized");
      } else {
        await axiosInstance.post("/users/register", data);
        toast.success("Teacher Registered");
      }
      setIsModalOpen(false);
      setEditingTeacher(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent removal of faculty. Proceed?")) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      toast.success("Profile removed");
      refetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const columns = [
    {
      header: "Teacher Profile",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100/50">
            {row.name[0]}
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm mb-1">{row.name}</p>
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
              {row.role.replace("_", " ")}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Academic Scope",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <MapPin size={14} className="text-rose-400" />
            {row.assignedCampuses?.map((c) => c.name || c).join(", ") ||
              "Global"}
          </div>
          {row.role === "CLASS_TEACHER" && row.classTeacherOf && (
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
              <ShieldCheck size={12} />
              Lead: {row.classTeacherOf.class?.name || "N/A"} —{" "}
              {row.classTeacherOf.section?.name || "N/A"}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingTeacher(row);
              setIsModalOpen(true);
            }}
            className="p-2 hover:bg-indigo-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[3rem] shadow-xl border border-slate-50">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Staff Management
            </h1>
            <p className="text-sm text-slate-500 font-medium italic">
              Master-Linked Academic Directory
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:min-w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search faculty..."
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl outline-none font-semibold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditingTeacher(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 rounded-2xl px-6 font-black shadow-xl shadow-indigo-100"
          >
            <UserPlus size={18} />{" "}
            <span className="hidden lg:inline ml-2">Add Teacher</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-50 overflow-hidden p-4">
        <DataTable columns={columns} data={teachers} isLoading={loading} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl p-10 relative animate-in zoom-in duration-200 max-h-[95vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-rose-500"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <Link2 className="text-indigo-600" />{" "}
              {editingTeacher ? "Edit Faculty Profile" : "Register Faculty"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
            >
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">
                  Identity
                </h3>
                <InputGroup
                  label="Full Name"
                  name="name"
                  defValue={editingTeacher?.name}
                />
                <InputGroup
                  label="Email"
                  name="email"
                  type="email"
                  defValue={editingTeacher?.email}
                />
                {!editingTeacher && (
                  <InputGroup
                    label="Password"
                    name="password"
                    type="password"
                  />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">
                  Academic Responsibility
                </h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 ml-2">
                    Primary Role
                  </label>
                  <select
                    name="role"
                    defaultValue={editingTeacher?.role}
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-indigo-100 transition-all"
                  >
                    <option value="TEACHER">Academic Teacher</option>
                    <option value="CLASS_TEACHER">Class Teacher (Lead)</option>
                  </select>
                </div>

                <div className="p-5 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50 space-y-4">
                  <p className="text-[9px] font-black text-indigo-400 uppercase text-center tracking-widest">
                    Lead Assignment
                  </p>
                  <select
                    name="targetClass"
                    defaultValue={getID(editingTeacher?.classTeacherOf?.class)}
                    className="w-full p-3 bg-white rounded-xl outline-none text-xs font-bold border border-indigo-100"
                  >
                    <option value="">Select Class</option>
                    {masterStructure?.classes?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="targetSection"
                    defaultValue={getID(
                      editingTeacher?.classTeacherOf?.section
                    )}
                    className="w-full p-3 bg-white rounded-xl outline-none text-xs font-bold border border-indigo-100"
                  >
                    <option value="">Select Section</option>
                    {masterStructure?.sections?.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Branch Permissions
                </label>
                <div className="flex flex-wrap gap-3 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  {campuses?.map((c) => (
                    <label
                      key={c._id}
                      className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 cursor-pointer hover:border-indigo-300 transition-all"
                    >
                      <input
                        type="checkbox"
                        name="assignedCampuses"
                        value={c._id}
                        defaultChecked={editingTeacher?.assignedCampuses?.some(
                          (curr) => getID(curr) === c._id
                        )}
                        className="w-5 h-5 accent-indigo-600 rounded"
                      />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-tight">
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <Button
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white rounded-[2rem] py-5 font-black shadow-xl uppercase tracking-widest"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : editingTeacher ? (
                    "Synchronize Changes"
                  ) : (
                    "Create Profile"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, name, type = "text", defValue }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
      {label}
    </label>
    <input
      required
      name={name}
      type={type}
      defaultValue={defValue}
      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-indigo-100 transition-all"
    />
  </div>
);

export default TeacherManagement;
