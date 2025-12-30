import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Settings,
  Save,
  Upload,
  School,
  Globe,
  Phone,
  Calendar,
  Mail,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

const SchoolSettings = () => {
  const [profile, setProfile] = useState({
    name: "",
    logo: "",
    address: "",
    email: "",
    website: "",
    phone: "",
    establishedYear: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Updated to use the consistent axiosInstance and endpoint structure
        const res = await axiosInstance.get("/campuses/school-profile");
        if (res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        toast.error("Failed to load school profile");
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put("/campuses/school-profile", profile);
      toast.success("School profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100">
          <School size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            School Branding
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage global identity appearing on headers, footers, and reports.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Logo/Branding Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-100/50 border border-slate-100 p-8 text-center">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
              School Logo
            </h3>
            <div className="relative group mx-auto w-40 h-40">
              <div className="w-full h-full rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                {profile.logo ? (
                  <img
                    src={profile.logo}
                    alt="Logo"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <Upload className="text-slate-300" size={40} />
                )}
              </div>
              <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-indigo-600/0 group-hover:bg-indigo-600/10 rounded-[2rem] transition-all">
                <input
                  type="text"
                  className="hidden"
                  placeholder="Logo URL"
                  onChange={(e) =>
                    setProfile({ ...profile, logo: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="mt-6">
              <input
                type="text"
                className="w-full px-4 py-2 text-xs border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                placeholder="Paste Logo Image URL"
                value={profile.logo}
                onChange={(e) =>
                  setProfile({ ...profile, logo: e.target.value })
                }
              />
              <p className="text-[10px] text-slate-400 mt-2 italic font-medium">
                Recommended: Transparent PNG (512x512)
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Information Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-100/50 border border-slate-100 p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* School Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <School size={16} className="text-indigo-500" /> Institution
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-3.5 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50/50 transition-all font-medium"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Established Year */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Calendar size={16} className="text-indigo-500" /> Established
                  Year
                </label>
                <input
                  type="number"
                  className="w-full px-5 py-3.5 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50/50 transition-all font-medium"
                  value={profile.establishedYear}
                  onChange={(e) =>
                    setProfile({ ...profile, establishedYear: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Official Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Mail size={16} className="text-indigo-500" /> Official Email
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-3.5 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50/50 transition-all font-medium"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Phone size={16} className="text-indigo-500" /> Contact Number
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-3.5 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50/50 transition-all font-medium"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Globe size={16} className="text-indigo-500" /> Website URL
              </label>
              <input
                type="url"
                className="w-full px-5 py-3.5 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50/50 transition-all font-medium"
                placeholder="https://www.yourschool.com"
                value={profile.website}
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
              />
            </div>

            {/* Full Address */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <MapPin size={16} className="text-indigo-500" /> Full Address
              </label>
              <textarea
                rows="3"
                className="w-full px-5 py-3.5 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50/50 transition-all font-medium"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-black text-sm uppercase tracking-widest active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={20} /> Save Branding Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SchoolSettings;
