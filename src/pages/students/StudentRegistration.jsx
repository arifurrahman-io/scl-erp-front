import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAcademic } from "../../context/AcademicContext";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import Button from "../../components/ui/Button";
import {
  UserPlus,
  Camera,
  GraduationCap,
  Users,
  Save,
  Building2,
  Contact2,
  Hash,
  X,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { activeCampus, activeYear } = useAcademic(); // Reverted to activeYear

  const [campuses, setCampuses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]); // Dynamic sections state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    campus: "",
    campusId: "",
    class: "",
    section: "",
    roll: "",
    group: "",
    dob: "",
    gender: "Male",
    bloodGroup: "",
    birthRegNumber: "",
    fatherName: "",
    fatherNid: "",
    motherName: "",
    motherNid: "",
    presentAddress: "",
    homeDistrict: "",
    photo: "",
  });

  const isGroupRequired =
    formData.class.toLowerCase().includes("nine") ||
    formData.class.toLowerCase().includes("ten") ||
    ["9", "10", "11", "12"].some((v) => formData.class.includes(v));

  // --- 1. DYNAMIC STRUCTURE FETCHING ---
  const fetchCampusStructure = async (campusId) => {
    try {
      // Parallel fetch for Classes and Sections linked to this campus
      const [classRes, sectionRes] = await Promise.all([
        axiosInstance.get(`${ENDPOINTS.SETUP.CLASS_BASE}/${campusId}`),
        axiosInstance.get(ENDPOINTS.SETUP.SECTIONS_BY_CAMPUS(campusId)),
      ]);
      setClasses(classRes.data);
      setSections(sectionRes.data); // Dynamic data
    } catch (err) {
      toast.error("Error loading branch structure");
    }
  };

  // --- 2. INITIAL DATA HYDRATION ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.CAMPUS.BASE);
        const campusList = Array.isArray(res.data)
          ? res.data
          : res.data.campuses || [];
        setCampuses(campusList);

        if (isEditMode) {
          const studentRes = await axiosInstance.get(
            ENDPOINTS.STUDENTS.SINGLE(id)
          );
          const s = studentRes.data;
          setFormData({
            ...s,
            dob: s.dob ? new Date(s.dob).toISOString().split("T")[0] : "",
            campusId: s.campusId?._id || s.campusId,
          });
          setImagePreview(s.photo);
          if (s.campusId) fetchCampusStructure(s.campusId?._id || s.campusId);
          setFetching(false);
        } else if (activeCampus) {
          handleCampusChange(activeCampus._id, campusList);
        }
      } catch (err) {
        toast.error("Initialization failed");
        setFetching(false);
      }
    };
    fetchInitialData();
  }, [id, isEditMode, activeCampus]);

  const handleCampusChange = async (campusId, campusList = campuses) => {
    const selected = campusList.find((c) => c._id === campusId);
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      campusId: campusId,
      campus: selected.name,
      studentId: isEditMode
        ? prev.studentId
        : `${selected.name.substring(0, 3).toUpperCase()}-${
            activeYear?.year || "NEW"
          }-`,
    }));
    fetchCampusStructure(campusId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation for Critical IDs
    if (!formData.campusId)
      return toast.error("Campus ID is missing. Please re-select campus.");
    if (!activeYear?._id)
      return toast.error("Academic Session must be active.");

    setLoading(true);

    try {
      // 2. Build Payload with explicit Campus ID
      const payload = {
        ...formData,
        campusId: formData.campusId, // Explicitly sending the ObjectId for DB filtering
        academicYear: activeYear?._id, // Linking to Session document
      };

      // 3. Clean Payload logic
      if (!isGroupRequired) payload.group = "";

      if (isEditMode) {
        // Update existing record using DB ID
        await axiosInstance.put(ENDPOINTS.STUDENTS.SINGLE(id), payload);
        toast.success("Profile Synchronized Successfully");
      } else {
        // Register new student with Campus-linked URL
        await axiosInstance.post(
          ENDPOINTS.STUDENTS.REGISTER(formData.campusId),
          payload
        );
        toast.success("Student Enrolled & Indexed Successfully");
      }

      navigate("/students");
    } catch (err) {
      // Return backend validation message if roll number or ID exists
      toast.error(err.response?.data?.message || "Admission process failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20"
    >
      {/* ACTION HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-2xl sticky top-4 z-50 gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[2rem] text-white shadow-xl">
            {isEditMode ? <RefreshCcw size={32} /> : <UserPlus size={32} />}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isEditMode ? "Update Student" : "Admission Portal"}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1">
                <Building2 size={10} /> {formData.campus || "Select Branch"}
              </span>
              <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                <Hash size={10} /> Session {activeYear?.year || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl px-8"
            onClick={() => navigate("/students")}
          >
            <X size={20} className="mr-2" /> Discard
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-2xl px-10 bg-indigo-600 text-white font-black shadow-xl"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Save size={20} className="mr-2" />
            )}
            {isEditMode ? "Update Record" : "Finalize Admission"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* CORE IDENTITY */}
          <section className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-50 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
            <h3 className="flex items-center gap-3 font-black text-slate-800 text-lg uppercase">
              <Users size={24} className="text-indigo-600" /> Identity Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Student ID *
                </label>
                <input
                  required
                  disabled={isEditMode}
                  type="text"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-black text-indigo-600"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Birth Date *
                </label>
                <input
                  required
                  type="date"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Gender *
                </label>
                <select
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
          </section>

          {/* FAMILY INFO */}
          <section className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-50 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-400"></div>
            <h3 className="flex items-center gap-3 font-black text-slate-800 text-lg uppercase tracking-tight">
              <Contact2 size={24} className="text-indigo-400" /> Guardian &
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                placeholder="Father's Name"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                value={formData.fatherName}
                onChange={(e) =>
                  setFormData({ ...formData, fatherName: e.target.value })
                }
              />
              <input
                placeholder="Mother's Name"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                value={formData.motherName}
                onChange={(e) =>
                  setFormData({ ...formData, motherName: e.target.value })
                }
              />
              <div className="md:col-span-2">
                <textarea
                  placeholder="Present Address"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold min-h-[100px]"
                  value={formData.presentAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, presentAddress: e.target.value })
                  }
                />
              </div>
            </div>
          </section>
        </div>

        {/* ACADEMIC SCOPE & PHOTO */}
        <div className="lg:col-span-4 space-y-10">
          <section className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl text-white">
            <h3 className="flex items-center gap-3 font-black text-white/90 text-lg uppercase">
              <GraduationCap size={24} /> Academic Placement
            </h3>
            <div className="space-y-6 mt-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase ml-2">
                  Class *
                </label>
                <select
                  required
                  className="w-full p-4 bg-white/10 rounded-2xl outline-none text-white font-black"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class: e.target.value,
                      group: "",
                    })
                  }
                >
                  <option value="" className="text-slate-800">
                    Select Class
                  </option>
                  {classes.map((c) => (
                    <option
                      key={c._id}
                      value={c.name}
                      className="text-slate-800"
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DYNAMIC SECTIONS */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase ml-2">
                  Section *
                </label>
                <select
                  required
                  className="w-full p-4 bg-white/10 rounded-2xl outline-none text-white font-black"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                >
                  <option value="" className="text-slate-800">
                    Select Section
                  </option>
                  {sections.map((s) => (
                    <option
                      key={s._id}
                      value={s.name}
                      className="text-slate-800"
                    >
                      Section {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase ml-2">
                  Roll Number *
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-white/10 rounded-2xl outline-none text-white font-black"
                  value={formData.roll}
                  onChange={(e) =>
                    setFormData({ ...formData, roll: e.target.value })
                  }
                />
              </div>

              {isGroupRequired && (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {["Science", "Commerce", "Humanities"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, group: g })}
                      className={`py-3 rounded-xl font-black text-[10px] uppercase transition-all ${
                        formData.group === g
                          ? "bg-white text-indigo-600 shadow-xl"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-50 text-center">
            <label className="relative group w-44 h-44 cursor-pointer inline-block mx-auto">
              <div className="w-full h-full bg-slate-50 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-slate-100 overflow-hidden hover:border-indigo-200 transition-all">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={48} className="text-slate-200" />
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImagePreview(reader.result);
                      setFormData({ ...formData, photo: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            <p className="text-[9px] font-black uppercase text-slate-400 mt-4 tracking-widest">
              ID Passport Photo
            </p>
          </section>
        </div>
      </div>
    </form>
  );
};

export default StudentRegistration;
