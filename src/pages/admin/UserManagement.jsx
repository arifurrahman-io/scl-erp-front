import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useAcademic } from "../../context/AcademicContext"; // To fetch campus list
import axiosInstance from "../../api/axiosInstance";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/ui/Button";
import {
  UserPlus,
  Edit3,
  Trash2,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  X,
  AlertTriangle,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("ADMINISTRATIVE");
  const { data: users, loading, refetch } = useFetch("/users");
  const { campuses } = useAcademic(); // Get campuses for assignment

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEACHER",
    assignedCampuses: [],
    status: "Active",
  });

  const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"];
  const TEACHER_ROLES = ["CLASS_TEACHER", "TEACHER"];

  const filteredUsers =
    users?.filter((user) =>
      activeTab === "ADMINISTRATIVE"
        ? ADMIN_ROLES.includes(user.role)
        : TEACHER_ROLES.includes(user.role)
    ) || [];

  // --- HANDLERS ---
  const handleOpenModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Keep empty for edits
        role: user.role,
        assignedCampuses: user.assignedCampuses?.map((c) => c._id || c) || [],
        status: user.status || "Active",
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: activeTab === "ADMINISTRATIVE" ? "ADMIN" : "TEACHER",
        assignedCampuses: [],
        status: "Active",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        // UPDATE
        await axiosInstance.put(`/users/${selectedUser._id}`, formData);
        toast.success("Staff profile updated");
      } else {
        // CREATE
        await axiosInstance.post("/users/register", formData);
        toast.success("New staff member registered");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await axiosInstance.delete(`/users/${selectedUser._id}`);
      toast.success("User removed successfully");
      setIsDeleteModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCampus = (id) => {
    const current = formData.assignedCampuses;
    setFormData({
      ...formData,
      assignedCampuses: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  };

  const columns = [
    {
      header: "Staff Member",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${
              ADMIN_ROLES.includes(row.role)
                ? "bg-indigo-600 shadow-indigo-100"
                : "bg-emerald-500 shadow-emerald-100"
            }`}
          >
            {row.name[0]}
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm mb-1">{row.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "System Role",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            row.role === "SUPER_ADMIN"
              ? "bg-rose-50 text-rose-600 border-rose-100"
              : "bg-slate-50 text-slate-600 border-slate-100"
          }`}
        >
          {row.role.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
          >
            <Edit3 size={18} />
          </button>
          {row.role !== "SUPER_ADMIN" && (
            <button
              onClick={() => {
                setSelectedUser(row);
                setIsDeleteModalOpen(true);
              }}
              className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Staff Control Center
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage system access and academic permissions.
            </p>
          </div>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 rounded-2xl px-8 font-black shadow-xl shadow-indigo-100"
        >
          <UserPlus size={20} /> Add New Staff
        </Button>
      </div>

      {/* TABS */}
      <div className="flex p-2 bg-slate-100 rounded-[2rem] w-fit">
        <button
          onClick={() => setActiveTab("ADMINISTRATIVE")}
          className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${
            activeTab === "ADMINISTRATIVE"
              ? "bg-white text-indigo-600 shadow-lg"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Briefcase size={18} /> Administrative
        </button>
        <button
          onClick={() => setActiveTab("ACADEMIC")}
          className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${
            activeTab === "ACADEMIC"
              ? "bg-white text-emerald-600 shadow-lg"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <GraduationCap size={18} /> Academic Staff
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-50 overflow-hidden p-4">
        <DataTable columns={columns} data={filteredUsers} isLoading={loading} />
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              {selectedUser ? (
                <Edit3 className="text-indigo-600" />
              ) : (
                <UserPlus className="text-indigo-600" />
              )}
              {selectedUser
                ? `Edit Staff: ${selectedUser.name}`
                : "Register New Staff"}
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    User Role
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    {(activeTab === "ADMINISTRATIVE"
                      ? ADMIN_ROLES
                      : TEACHER_ROLES
                    ).map((r) => (
                      <option key={r} value={r}>
                        {r.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    {selectedUser
                      ? "New Password (Optional)"
                      : "Security Password"}
                  </label>
                  <input
                    required={!selectedUser}
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-700"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">
                  Assigned Campuses (Scope)
                </label>
                <div className="flex flex-wrap gap-2">
                  {campuses.map((campus) => (
                    <button
                      key={campus._id}
                      type="button"
                      onClick={() => toggleCampus(campus._id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                        formData.assignedCampuses.includes(campus._id)
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-slate-100 text-slate-400 hover:border-indigo-100"
                      }`}
                    >
                      {campus.name}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100"
              >
                <Save size={20} className="mr-2" />{" "}
                {isSubmitting ? "Processing..." : "Finalize Profile"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Revoke Access?
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              This will permanently remove{" "}
              <span className="font-black text-slate-800">
                {selectedUser?.name}
              </span>{" "}
              from the system. This action cannot be undone.
            </p>
            <div className="flex gap-4 pt-2">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
                className="flex-1 rounded-2xl border-slate-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600"
              >
                {isSubmitting ? "Removing..." : "Delete User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
