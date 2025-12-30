import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import useAcademicStore from "../../store/useAcademicStore";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  Plus,
  Layers,
  Database,
  ChevronRight,
  BookOpen,
  Trash2,
  Edit3,
  Globe,
  Send,
  Save,
  CheckCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const SchoolStructureManagement = () => {
  // --- DATA STATES ---
  const [campuses, setCampuses] = useState([]);
  const [masterClasses, setMasterClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [deployedClasses, setDeployedClasses] = useState([]);

  // --- UI & SELECTION STATES ---
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingCampus, setEditingCampus] = useState(null);
  const [editingMaster, setEditingMaster] = useState(null);

  // --- FORM STATES ---
  const [newCampusName, setNewCampusName] = useState("");
  const [newMasterName, setNewMasterName] = useState("");
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    subjective: 0,
    objective: 0,
    practical: 0,
    ct: 0,
    diary: 0,
    assignment: 0,
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { setActiveCampus } = useAcademicStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [campusRes, masterRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.CAMPUS.BASE),
        axiosInstance.get(ENDPOINTS.SETUP.MASTER_CLASSES),
      ]);
      setCampuses(
        Array.isArray(campusRes.data)
          ? campusRes.data
          : campusRes.data.campuses || []
      );
      setMasterClasses(masterRes.data);
    } catch (err) {
      toast.error("Failed to load setup data.");
    }
  };

  // --- CAMPUS CRUD ---
  const handleAddOrUpdateCampus = async () => {
    if (!newCampusName) return toast.error("Campus name required");
    try {
      if (editingCampus) {
        await axiosInstance.put(
          `${ENDPOINTS.CAMPUS.BASE}/${editingCampus._id}`,
          { name: newCampusName }
        );
        toast.success("Campus updated!");
      } else {
        await axiosInstance.post(ENDPOINTS.CAMPUS.BASE, {
          name: newCampusName,
        });
        toast.success("Campus created!");
      }
      setNewCampusName("");
      setEditingCampus(null);
      fetchInitialData();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const triggerDeleteCampus = (campus) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Campus?",
      message: `Are you sure you want to delete ${campus.name}? This will remove all associated data for this branch.`,
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`${ENDPOINTS.CAMPUS.BASE}/${campus._id}`);
          toast.success("Campus deleted");
          fetchInitialData();
        } catch (err) {
          toast.error("Delete failed");
        }
      },
    });
  };

  // --- MASTER CLASS (BLUEPRINT) CRUD ---
  const handleAddOrUpdateMaster = async () => {
    if (!newMasterName) return toast.error("Blueprint name required");
    try {
      if (editingMaster) {
        await axiosInstance.put(
          `${ENDPOINTS.SETUP.MASTER_CLASSES}/${editingMaster._id}`,
          { name: newMasterName }
        );
        toast.success("Blueprint updated!");
      } else {
        await axiosInstance.post(ENDPOINTS.SETUP.MASTER_CLASSES, {
          name: newMasterName,
        });
        toast.success("Blueprint created!");
      }
      setNewMasterName("");
      setEditingMaster(null);
      fetchInitialData();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const triggerDeleteMaster = (cls) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Blueprint?",
      message: `Remove ${cls.name} blueprint? This won't affect already deployed classes but will remove the global template.`,
      onConfirm: async () => {
        try {
          await axiosInstance.delete(
            `${ENDPOINTS.SETUP.MASTER_CLASSES}/${cls._id}`
          );
          toast.success("Blueprint removed");
          fetchInitialData();
        } catch (err) {
          toast.error("Delete failed");
        }
      },
    });
  };

  // --- SUBJECT CRUD ---
  const handleSelectMaster = async (cls) => {
    setSelectedMaster(cls);
    setEditingSubject(null);
    try {
      const res = await axiosInstance.get(ENDPOINTS.SETUP.SUBJECTS(cls._id));
      setSubjects(res.data);
    } catch (err) {
      setSubjects([]);
    }
  };

  const handleAddOrUpdateSubject = async () => {
    try {
      const payload = {
        ...subjectForm,
        class: selectedMaster._id,
        distribution: { ...subjectForm },
      };
      if (editingSubject) {
        await axiosInstance.put(
          `${ENDPOINTS.SETUP.SUBJECT_BASE}/${editingSubject._id}`,
          payload
        );
        toast.success("Subject updated!");
      } else {
        await axiosInstance.post(ENDPOINTS.SETUP.MASTER_SUBJECTS, payload);
        toast.success("Added to blueprint!");
      }
      resetSubjectForm();
      handleSelectMaster(selectedMaster);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const triggerDeleteSubject = (subject) => {
    setModalConfig({
      isOpen: true,
      title: "Remove Subject?",
      message: `Delete ${subject.name} from the global blueprint?`,
      onConfirm: async () => {
        try {
          await axiosInstance.delete(
            `${ENDPOINTS.SETUP.SUBJECT_BASE}/${subject._id}`
          );
          toast.success("Subject removed");
          handleSelectMaster(selectedMaster);
        } catch (err) {
          toast.error("Delete failed");
        }
      },
    });
  };

  const resetSubjectForm = () => {
    setSubjectForm({
      name: "",
      code: "",
      subjective: 0,
      objective: 0,
      practical: 0,
      ct: 0,
      diary: 0,
      assignment: 0,
    });
    setEditingSubject(null);
  };

  // --- DEPLOYMENT & CAMPUS MONITORING ---
  const handleSelectCampus = async (campus) => {
    setSelectedCampus(campus);
    setActiveCampus(campus);
    try {
      const res = await axiosInstance.get(ENDPOINTS.SETUP.CLASSES(campus._id));
      setDeployedClasses(res.data);
    } catch (err) {
      setDeployedClasses([]);
    }
  };

  const handleDeploy = async (campusId) => {
    try {
      await axiosInstance.post(ENDPOINTS.SETUP.DEPLOY, {
        masterClassId: selectedMaster._id,
        campusId,
      });
      toast.success("Blueprint deployed!");
      if (selectedCampus?._id === campusId) handleSelectCampus(selectedCampus);
    } catch (err) {
      toast.error("Deployment failed");
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-3 border-b pb-6">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
          <Globe size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          Academic Structure & Blueprints
        </h1>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* COLUMN 1: DIRECTORIES */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Layers size={18} className="text-indigo-500" /> Blueprints
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 text-xs border p-2 rounded-xl outline-none"
                placeholder="e.g. Seven"
                value={newMasterName}
                onChange={(e) => setNewMasterName(e.target.value)}
              />
              <button
                onClick={handleAddOrUpdateMaster}
                className="bg-indigo-600 text-white p-2 rounded-lg"
              >
                <Save size={16} />
              </button>
            </div>
            {masterClasses.map((cls) => (
              <div key={cls._id} className="relative group">
                <button
                  onClick={() => handleSelectMaster(cls)}
                  className={`w-full p-3 mb-2 rounded-xl border-2 text-left text-sm font-bold transition-all ${
                    selectedMaster?._id === cls._id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-50"
                  }`}
                >
                  {cls.name}
                </button>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingMaster(cls);
                      setNewMasterName(cls.name);
                    }}
                    className="p-1.5 bg-white border rounded-lg text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => triggerDeleteMaster(cls)}
                    className="p-1.5 bg-white border rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Database size={18} className="text-indigo-500" /> Campuses
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 text-xs border p-2 rounded-xl outline-none"
                placeholder="New Branch..."
                value={newCampusName}
                onChange={(e) => setNewCampusName(e.target.value)}
              />
              <button
                onClick={handleAddOrUpdateCampus}
                className="bg-indigo-600 text-white p-2 rounded-lg"
              >
                <Save size={16} />
              </button>
            </div>
            {campuses.map((campus) => (
              <div key={campus._id} className="relative group">
                <button
                  onClick={() => handleSelectCampus(campus)}
                  className={`w-full p-3 mb-2 rounded-xl border-2 text-left transition-all ${
                    selectedCampus?._id === campus._id
                      ? "border-indigo-600 bg-indigo-50 shadow-sm"
                      : "border-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-700 text-xs">
                    {campus.name}
                  </p>
                </button>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingCampus(campus);
                      setNewCampusName(campus.name);
                    }}
                    className="p-1.5 bg-white border rounded-lg text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => triggerDeleteCampus(campus)}
                    className="p-1.5 bg-white border rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* COLUMN 2: WORKSPACE */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {selectedMaster ? (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">
                  {selectedMaster.name} Rules
                </h2>
                <div className="flex gap-2">
                  {campuses.map((c) => {
                    const isDeployed = deployedClasses.some(
                      (dc) =>
                        dc.name === selectedMaster.name && dc.campus === c._id
                    );
                    return (
                      !isDeployed && (
                        <button
                          key={c._id}
                          onClick={() => handleDeploy(c._id)}
                          className="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-xl font-bold shadow-lg shadow-indigo-100"
                        >
                          Deploy to {c.name.split("-")[0]}
                        </button>
                      )
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl space-y-5 border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="p-3 border rounded-xl bg-white"
                    placeholder="Subject Name"
                    value={subjectForm.name}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, name: e.target.value })
                    }
                  />
                  <input
                    className="p-3 border rounded-xl bg-white"
                    placeholder="Code"
                    value={subjectForm.code}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, code: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    "subjective",
                    "objective",
                    "practical",
                    "ct",
                    "diary",
                    "assignment",
                  ].map((field) => (
                    <div key={field}>
                      <label className="text-[9px] font-black text-slate-400 uppercase text-center block mb-1">
                        {field}
                      </label>
                      <input
                        type="number"
                        className="w-full border p-2 rounded-lg text-center font-bold bg-white"
                        value={subjectForm[field]}
                        onChange={(e) =>
                          setSubjectForm({
                            ...subjectForm,
                            [field]: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddOrUpdateSubject}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100"
                >
                  {editingSubject ? "Update Blueprint" : "Save to Blueprint"}
                </button>
              </div>

              <div className="space-y-3">
                {subjects.map((s) => (
                  <div
                    key={s._id}
                    className="p-4 border rounded-2xl flex justify-between items-center bg-white shadow-sm hover:border-indigo-200 group transition-all"
                  >
                    <div>
                      <p className="font-bold text-slate-700 text-sm">
                        {s.name}{" "}
                        <span className="text-xs text-slate-400">
                          ({s.code})
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(s.distribution || {}).map(
                          ([key, val]) => (
                            <span
                              key={key}
                              className="text-[8px] bg-slate-50 text-indigo-600 px-2 py-0.5 rounded-lg font-black uppercase border border-indigo-50"
                            >
                              {key.slice(0, 3)}: {val}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingSubject(s);
                          setSubjectForm({ ...s, ...s.distribution });
                        }}
                        className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-xl"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => triggerDeleteSubject(s)}
                        className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-4 border-dashed border-slate-50 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 italic">
              Select a blueprint to manage academic rules
            </div>
          )}
        </div>

        {/* COLUMN 3: DEPLOYED STATUS */}
        <div className="col-span-12 lg:col-span-3">
          <section className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 min-h-[400px]">
            <h2 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
              <Send size={18} className="text-indigo-500" /> Live Status
            </h2>
            {selectedCampus ? (
              <div className="space-y-4">
                <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Active Branch
                  </p>
                  <p className="text-md font-black">{selectedCampus.name}</p>
                </div>
                {deployedClasses.map((cls) => (
                  <div
                    key={cls._id}
                    className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center group shadow-sm border border-slate-100"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <CheckCircle size={14} className="text-emerald-500" />{" "}
                      {cls.name}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs italic">
                Select a campus to see live branches
              </div>
            )}
          </section>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default SchoolStructureManagement;
