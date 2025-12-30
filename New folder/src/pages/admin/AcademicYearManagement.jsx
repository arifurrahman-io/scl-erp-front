import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useFetch } from "../../hooks/useFetch";
import { useAcademic } from "../../context/AcademicContext";
import Button from "../../components/ui/Button";
import DataTable from "../../components/tables/DataTable";
import { Calendar, Plus, CheckCircle2, Clock, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const AcademicYearManagement = () => {
  const {
    data: years,
    loading,
    refetch,
  } = useFetch("/campuses/academic-years");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

  const handleSetCurrent = async (yearId) => {
    try {
      await axiosInstance.patch(
        `/campuses/academic-years/set-current/${yearId}`
      );
      toast.success("Active session updated successfully!");
      refetch();
    } catch (err) {
      toast.error("Failed to update active session");
    }
  };

  const handleCreateYear = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axiosInstance.post("/campuses/academic-year", formData);
      toast.success("New academic year created!");
      setIsModalOpen(false);
      setFormData({ year: "", startDate: "", endDate: "", isCurrent: false });
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create year");
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { header: "Year Name", accessor: "year" },
    {
      header: "Duration",
      render: (row) =>
        `${new Date(row.startDate).toLocaleDateString()} - ${new Date(
          row.endDate
        ).toLocaleDateString()}`,
    },
    {
      header: "Status",
      render: (row) =>
        row.isCurrent ? (
          <span className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <CheckCircle2 size={12} /> Current Session
          </span>
        ) : (
          <span className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <Clock size={12} /> Inactive
          </span>
        ),
    },
    {
      header: "Actions",
      render: (row) =>
        !row.isCurrent && (
          <Button
            variant="outline"
            className="text-[10px] font-black uppercase tracking-widest py-1 h-8 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            onClick={() => handleSetCurrent(row._id)}
          >
            Set as Current
          </Button>
        ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <Calendar size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Academic Sessions
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage global school years and active sessions.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Year
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden p-4">
        <DataTable columns={columns} data={years || []} isLoading={loading} />
      </div>

      {/* CREATE YEAR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 space-y-6 relative border border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                New Academic Session
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Setup a new school year blueprint
              </p>
            </div>

            <form onSubmit={handleCreateYear} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Session Name
                </label>
                <input
                  required
                  placeholder="e.g. 2025-26"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 transition-all"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    End Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <input
                  type="checkbox"
                  id="isCurrent"
                  className="w-5 h-5 accent-indigo-600 rounded-lg cursor-pointer"
                  checked={formData.isCurrent}
                  onChange={(e) =>
                    setFormData({ ...formData, isCurrent: e.target.checked })
                  }
                />
                <label
                  htmlFor="isCurrent"
                  className="text-sm font-bold text-indigo-700 cursor-pointer select-none"
                >
                  Set as Current Active Session
                </label>
              </div>

              <Button
                type="submit"
                disabled={formLoading}
                className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-white shadow-lg shadow-indigo-100 active:scale-95 transition-all"
              >
                {formLoading ? (
                  "Processing..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save size={18} /> Create Session
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicYearManagement;
