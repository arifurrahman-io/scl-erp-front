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
} from "lucide-react";
import toast from "react-hot-toast";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Detects ID from /students/edit/:id
  const isEditMode = Boolean(id);
  const { activeCampus, activeYear } = useAcademic();

  const SECTION_OPTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const [campuses, setCampuses] = useState([]);
  const [classes, setClasses] = useState([]);
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
    formData.class.includes("9") ||
    formData.class.includes("10");

  // 1. DATA HYDRATION: Fetch student data if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const res = await axiosInstance.get(`/students/${id}`);
          const s = res.data;
          setFormData({
            ...s,
            dob: s.dob ? new Date(s.dob).toISOString().split("T")[0] : "", // Format for date input
          });
          setImagePreview(s.photo);

          // Fetch classes for the student's campus immediately
          if (s.campus) {
            const campusRes = await axiosInstance.get(ENDPOINTS.CAMPUS.BASE);
            const targetCampus = campusRes.data.find(
              (c) => c.name === s.campus
            );
            if (targetCampus) fetchClasses(targetCampus._id);
          }
        } catch (err) {
          toast.error("Could not load student data");
          navigate("/students");
        } finally {
          setFetching(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode]);

  // 2. CAMPUS & CLASS FETCHING
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axiosInstance.get(ENDPOINTS.CAMPUS.BASE);
        const campusData = Array.isArray(res.data)
          ? res.data
          : res.data.campuses || [];
        setCampuses(campusData);

        if (activeCampus && !isEditMode) {
          handleCampusChange(activeCampus._id, campusData);
        }
      } catch (err) {
        toast.error("Network error");
      }
    };
    fetchInitialData();
  }, [activeCampus, isEditMode]);

  const fetchClasses = async (campusId) => {
    try {
      const res = await axiosInstance.get(
        `${ENDPOINTS.SETUP.CLASS_BASE}/${campusId}`
      );
      setClasses(res.data);
    } catch (err) {
      setClasses([]);
    }
  };

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
    fetchClasses(campusId);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, academicYear: activeYear._id };
      if (!isGroupRequired) payload.group = null;
      delete payload.campusId;

      if (isEditMode) {
        await axiosInstance.put(`/students/${id}`, payload);
        toast.success("Profile Updated Successfully!");
      } else {
        await axiosInstance.post(
          `/students/${formData.campusId}/register`,
          payload
        );
        toast.success("Enrollment Successful!");
      }
      navigate("/students");
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse">
        Loading Profile...
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20"
    >
      {/* 1. DYNAMIC STICKY HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white/80 backdrop-blur-xl p-6 rounded-[3rem] border border-white shadow-2xl shadow-slate-200/50 sticky top-4 z-50 gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-200">
            {isEditMode ? (
              <RefreshCcw size={32} strokeWidth={2.5} />
            ) : (
              <UserPlus size={32} strokeWidth={2.5} />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isEditMode ? "Update Profile" : "Enrollment Portal"}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                <Building2 size={10} /> {formData.campus || "Select Branch"}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                <Hash size={10} /> Session {activeYear?.year || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl px-8 border-slate-200 text-slate-500 font-bold"
            onClick={() => navigate("/students")}
          >
            <X size={20} className="mr-2" /> Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-2xl px-10 bg-indigo-600 text-white font-black shadow-xl shadow-indigo-200"
          >
            <Save size={20} className="mr-2" />{" "}
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Record"
              : "Finalize Admission"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* IDENTITIY SECTION */}
          <section className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-50 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
            <h3 className="flex items-center gap-3 font-black text-slate-800 text-lg uppercase">
              <Users size={24} className="text-indigo-600" /> Student Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-semibold"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Student ID *
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-indigo-600"
                  value={formData.studentId}
                  disabled={isEditMode}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Birth Date *
                </label>
                <input
                  required
                  type="date"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>
              {/* ... Gender and Blood Group inputs remain the same as your previous code ... */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Gender
                </label>
                <select
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-semibold"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Blood Group
                </label>
                <select
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-semibold"
                  value={formData.bloodGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodGroup: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </section>

          {/* PARENTAL INFO */}
          <section className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-50 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-400"></div>
            <h3 className="flex items-center gap-3 font-black text-slate-800 text-lg uppercase tracking-tighter">
              <Contact2 size={24} className="text-indigo-400" /> Parental
              Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <input
                  placeholder="Father's Name"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                  value={formData.fatherName}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherName: e.target.value })
                  }
                />
                <input
                  placeholder="Father's NID"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                  value={formData.fatherNid}
                  onChange={(e) =>
                    setFormData({ ...formData, fatherNid: e.target.value })
                  }
                />
              </div>
              <div className="space-y-6">
                <input
                  placeholder="Mother's Name"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                  value={formData.motherName}
                  onChange={(e) =>
                    setFormData({ ...formData, motherName: e.target.value })
                  }
                />
                <input
                  placeholder="Mother's NID"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                  value={formData.motherNid}
                  onChange={(e) =>
                    setFormData({ ...formData, motherNid: e.target.value })
                  }
                />
              </div>
            </div>
          </section>
        </div>

        {/* PLACEMENT & PHOTO */}
        <div className="lg:col-span-4 space-y-10">
          <section className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl text-white">
            <h3 className="flex items-center gap-3 font-black text-white/90 text-lg uppercase">
              <GraduationCap size={24} /> Placement
            </h3>
            <div className="space-y-5 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase ml-2">
                  Class *
                </label>
                <select
                  required
                  className="w-full p-4 bg-white/10 rounded-2xl outline-none text-white font-bold"
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
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase ml-2">
                  Section *
                </label>
                <select
                  required
                  className="w-full p-4 bg-white/10 rounded-2xl outline-none text-white font-bold"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                >
                  <option value="" className="text-slate-800">
                    Select Section
                  </option>
                  {SECTION_OPTIONS.map((s) => (
                    <option key={s} value={s} className="text-slate-800">
                      Section {s}
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
                  type="number"
                  className="w-full p-4 bg-white/10 rounded-2xl outline-none text-white font-bold"
                  value={formData.roll}
                  onChange={(e) =>
                    setFormData({ ...formData, roll: e.target.value })
                  }
                />
              </div>
              {isGroupRequired && (
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {["Science", "Commerce", "Humanities"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, group: g })}
                      className={`py-3 rounded-xl font-black text-xs transition-all ${
                        formData.group === g
                          ? "bg-white text-indigo-600 shadow-xl"
                          : "bg-white/10 text-white"
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
              <div className="w-full h-full bg-slate-100 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-slate-200 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={48} className="text-slate-300" />
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
            <p className="text-[10px] font-black uppercase text-slate-400 mt-4">
              Student Photo
            </p>
          </section>
        </div>
      </div>
    </form>
  );
};

export default StudentRegistration;
