import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import useAcademicStore from "../../store/useAcademicStore";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  Plus,
  Layers,
  Database,
  BookOpen,
  Trash2,
  Edit3,
  Globe,
  Save,
  CheckCircle,
  X,
  Hash,
  Send,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

const SchoolStructureManagement = () => {
  // --- DATA STATES ---
  const [campuses, setCampuses] = useState([]);
  const [masterClasses, setMasterClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [deployedClasses, setDeployedClasses] = useState([]);

  // --- UI & SELECTION STATES ---
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingCampus, setEditingCampus] = useState(null);
  const [editingMaster, setEditingMaster] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- FORM STATES ---
  const [newCampusName, setNewCampusName] = useState("");
  const [newMasterName, setNewMasterName] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
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
    setLoading(true);
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
      toast.error("Failed to load academic data.");
    } finally {
      setLoading(false);
    }
  };

  // --- 1. CAMPUS CRUD ---
  const handleAddOrUpdateCampus = async () => {
    if (!newCampusName) return toast.error("Campus name required");
    try {
      if (editingCampus) {
        await axiosInstance.put(
          `${ENDPOINTS.CAMPUS.BASE}/${editingCampus._id}`,
          { name: newCampusName }
        );
        toast.success("Campus updated");
      } else {
        await axiosInstance.post(ENDPOINTS.CAMPUS.BASE, {
          name: newCampusName,
        });
        toast.success("Campus created");
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
      message: `Confirm deletion of ${campus.name}? All branch data will be permanently removed.`,
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`${ENDPOINTS.CAMPUS.BASE}/${campus._id}`);
          toast.success("Campus deleted");
          setSelectedCampus(null);
          fetchInitialData();
        } catch (err) {
          toast.error("Delete failed");
        }
      },
    });
  };

  // --- 2. MASTER BLUEPRINT CRUD ---
  const handleAddOrUpdateMaster = async () => {
    if (!newMasterName) return toast.error("Blueprint name required");
    try {
      if (editingMaster) {
        await axiosInstance.put(
          `${ENDPOINTS.SETUP.MASTER_CLASSES}/${editingMaster._id}`,
          { name: newMasterName }
        );
        toast.success("Blueprint updated");
      } else {
        await axiosInstance.post(ENDPOINTS.SETUP.MASTER_CLASSES, {
          name: newMasterName,
        });
        toast.success("Blueprint created");
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
      message: `Remove ${cls.name} global template? Deployed classes will remain intact.`,
      onConfirm: async () => {
        try {
          await axiosInstance.delete(
            `${ENDPOINTS.SETUP.MASTER_CLASSES}/${cls._id}`
          );
          toast.success("Blueprint removed");
          setSelectedMaster(null);
          fetchInitialData();
        } catch (err) {
          toast.error("Delete failed");
        }
      },
    });
  };

  // --- 3. SUBJECT CRUD (Within Blueprint) ---
  const fetchSubjects = async (clsId) => {
    try {
      const res = await axiosInstance.get(ENDPOINTS.SETUP.SUBJECTS(clsId));
      setSubjects(res.data);
    } catch (err) {
      setSubjects([]);
    }
  };

  const handleAddOrUpdateSubject = async () => {
    if (!subjectForm.name || !subjectForm.code)
      return toast.error("Name and Code required");
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
        toast.success("Subject updated");
      } else {
        await axiosInstance.post(ENDPOINTS.SETUP.MASTER_SUBJECTS, payload);
        toast.success("Added to blueprint");
      }
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
      fetchSubjects(selectedMaster._id);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const triggerDeleteSubject = (sub) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Subject?",
      message: `Remove ${sub.name} from global blueprint?`,
      onConfirm: async () => {
        try {
          await axiosInstance.delete(
            `${ENDPOINTS.SETUP.SUBJECT_BASE}/${sub._id}`
          );
          toast.success("Subject deleted");
          fetchSubjects(selectedMaster._id);
        } catch (err) {
          toast.error("Delete failed");
        }
      },
    });
  };

  // --- 4. SECTION CRUD (Campus Specific) ---
  const fetchSections = async (campusId) => {
    try {
      const res = await axiosInstance.get(`/settings/sections/${campusId}`);
      setSections(res.data);
    } catch (err) {
      setSections([]);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName) return toast.error("Section name required");
    try {
      await axiosInstance.post("/settings/sections", {
        name: newSectionName,
        campusId: selectedCampus._id,
      });
      toast.success("Section created");
      setNewSectionName("");
      fetchSections(selectedCampus._id);
    } catch (err) {
      toast.error("Add failed");
    }
  };

  const triggerDeleteSection = (id) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Section?",
      message: "Confirm removal of this section from campus master.",
      onConfirm: async () => {
        try {
          await axiosInstance.delete(ENDPOINTS.SETUP.SECTION_SINGLE(id));
          toast.success("Section removed");
          fetchSections(selectedCampus._id);
        } catch (err) {
          toast.error("Delete failed");
        }
      },
    });
  };

  // --- 5. DEPLOYMENT LOGIC ---
  const handleSelectCampus = (campus) => {
    setSelectedCampus(campus);
    setActiveCampus(campus);
    fetchSections(campus._id);
    axiosInstance
      .get(ENDPOINTS.SETUP.CLASSES(campus._id))
      .then((res) => setDeployedClasses(res.data));
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
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <Globe size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Academic Master
            </h1>
            <p className="text-sm text-slate-500 font-medium italic">
              Manage Blueprints & Branch Structures
            </p>
          </div>
        </div>
        {loading && (
          <Loader2 className="animate-spin text-indigo-600" size={24} />
        )}
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT: BLUEPRINTS & CAMPUSES */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Master Classes */}
          <section className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50">
            <h2 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers size={14} className="text-indigo-600" /> Blueprints
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 text-xs bg-slate-50 p-3 rounded-xl outline-none font-bold"
                placeholder={
                  editingMaster ? "Edit name..." : "New Blueprint..."
                }
                value={newMasterName}
                onChange={(e) => setNewMasterName(e.target.value)}
              />
              <button
                onClick={handleAddOrUpdateMaster}
                className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                {editingMaster ? <CheckCircle size={16} /> : <Plus size={16} />}
              </button>
            </div>
            <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
              {masterClasses.map((cls) => (
                <div key={cls._id} className="relative group">
                  <button
                    onClick={() => {
                      setSelectedMaster(cls);
                      fetchSubjects(cls._id);
                    }}
                    className={`w-full p-4 rounded-2xl border-2 text-left text-xs font-black transition-all ${
                      selectedMaster?._id === cls._id
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-transparent bg-slate-50"
                    }`}
                  >
                    {cls.name}
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMaster(cls);
                        setNewMasterName(cls.name);
                      }}
                      className="p-1.5 bg-white shadow-sm rounded-lg text-indigo-500"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => triggerDeleteMaster(cls)}
                      className="p-1.5 bg-white shadow-sm rounded-lg text-rose-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Campuses */}
          <section className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50">
            <h2 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database size={14} className="text-rose-500" /> Branch List
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 text-xs bg-slate-50 p-3 rounded-xl outline-none font-bold"
                placeholder="New Campus..."
                value={newCampusName}
                onChange={(e) => setNewCampusName(e.target.value)}
              />
              <button
                onClick={handleAddOrUpdateCampus}
                className="bg-rose-500 text-white p-3 rounded-xl shadow-lg"
              >
                <Save size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {campuses.map((campus) => (
                <div key={campus._id} className="relative group">
                  <button
                    onClick={() => handleSelectCampus(campus)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      selectedCampus?._id === campus._id
                        ? "border-rose-500 bg-rose-50"
                        : "border-transparent bg-slate-50"
                    }`}
                  >
                    <p className="font-black text-slate-700 text-[10px] uppercase">
                      {campus.name}
                    </p>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingCampus(campus);
                        setNewCampusName(campus.name);
                      }}
                      className="p-1.5 bg-white shadow-sm rounded-lg text-indigo-500"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => triggerDeleteCampus(campus)}
                      className="p-1.5 bg-white shadow-sm rounded-lg text-rose-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CENTER: SUBJECT WORKSPACE */}
        <div className="col-span-12 lg:col-span-6">
          {selectedMaster ? (
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50 space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <BookOpen className="text-indigo-600" /> {selectedMaster.name}{" "}
                  Subjects
                </h2>
                <div className="flex gap-2">
                  {campuses.map(
                    (c) =>
                      !deployedClasses.some(
                        (dc) =>
                          dc.name === selectedMaster.name && dc.campus === c._id
                      ) && (
                        <button
                          key={c._id}
                          onClick={() => handleDeploy(c._id)}
                          className="text-[9px] bg-emerald-500 text-white px-3 py-2 rounded-xl font-black uppercase"
                        >
                          Deploy to {c.name}
                        </button>
                      )
                  )}
                </div>
              </div>

              {/* Subject CRUD Form */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                      Subject Name
                    </label>
                    <input
                      className="w-full bg-white p-3 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-200"
                      value={subjectForm.name}
                      onChange={(e) =>
                        setSubjectForm({ ...subjectForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                      Code
                    </label>
                    <input
                      className="w-full bg-white p-3 rounded-xl font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-200"
                      value={subjectForm.code}
                      onChange={(e) =>
                        setSubjectForm({ ...subjectForm, code: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    "subjective",
                    "objective",
                    "practical",
                    "ct",
                    "diary",
                    "assignment",
                  ].map((f) => (
                    <div key={f} className="space-y-1 text-center">
                      <label className="text-[8px] font-black text-slate-400 uppercase">
                        {f}
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white p-2 rounded-lg text-center font-black text-indigo-600 text-xs"
                        value={subjectForm[f]}
                        onChange={(e) =>
                          setSubjectForm({
                            ...subjectForm,
                            [f]: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleAddOrUpdateSubject}
                  className="w-full bg-indigo-600 rounded-2xl py-4 font-black text-white shadow-xl"
                >
                  {editingSubject
                    ? "Update Subject"
                    : "Add Subject to Blueprint"}
                </Button>
              </div>

              {/* Subject List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((s) => (
                  <div
                    key={s._id}
                    className="p-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all relative group"
                  >
                    <p className="font-black text-slate-700 text-sm mb-2">
                      {s.name}{" "}
                      <span className="text-indigo-400">[{s.code}]</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(s.distribution || {}).map(
                        ([k, v]) =>
                          v > 0 && (
                            <span
                              key={k}
                              className="text-[8px] font-black bg-slate-100 px-2 py-0.5 rounded-md uppercase"
                            >
                              {k.slice(0, 2)}: {v}
                            </span>
                          )
                      )}
                    </div>
                    <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingSubject(s);
                          setSubjectForm({ ...s, ...s.distribution });
                        }}
                        className="text-indigo-500"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => triggerDeleteSubject(s)}
                        className="text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 gap-4 italic font-bold uppercase tracking-widest text-xs">
              <Layers size={64} className="opacity-10" /> Select Blueprint to
              Manage
            </div>
          )}
        </div>

        {/* RIGHT: SECTIONS & LIVE STATUS */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <section className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50">
            <h2 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Hash size={14} className="text-emerald-500" /> Section Master
            </h2>
            {selectedCampus ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-white p-2 rounded-xl text-xs font-black outline-none border border-emerald-100 uppercase"
                      placeholder="Section A"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                    />
                    <button
                      onClick={handleAddSection}
                      className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {sections.map((sec) => (
                    <div
                      key={sec._id}
                      className="p-3 bg-slate-50 rounded-xl flex justify-between items-center group border border-slate-100"
                    >
                      <span className="text-[10px] font-black text-slate-600 uppercase">
                        {sec.name}
                      </span>
                      <button
                        onClick={() => triggerDeleteSection(sec._id)}
                        className="opacity-0 group-hover:opacity-100 text-rose-500 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Select Branch First
              </p>
            )}
          </section>

          <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="font-black text-white/30 text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Send size={14} /> Active Deployment
            </h2>
            <div className="space-y-3">
              {deployedClasses.map((dc) => (
                <div
                  key={dc._id}
                  className="p-3 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5 backdrop-blur-sm"
                >
                  <span className="text-[11px] font-black uppercase tracking-tight">
                    {dc.name}
                  </span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>
                </div>
              ))}
              {deployedClasses.length === 0 && (
                <p className="text-center py-4 text-[10px] font-bold text-white/20 uppercase italic">
                  No Live Classes
                </p>
              )}
            </div>
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
