import { useState, useEffect } from "react"; // Added useEffect
import { useFetch } from "../../hooks/useFetch";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import Button from "../../components/ui/Button";
import { Save, ShieldCheck, LayoutGrid, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const FeeMasterSetup = () => {
  const [loading, setLoading] = useState(false);
  const { data: masterClasses } = useFetch(ENDPOINTS.SETUP.MASTER_CLASSES);

  const initialFees = {
    sessionFee: "",
    itFee: "",
    examFees: { halfYearly: "", annual: "", preTest: "", test: "" },
    monthlyFees: {
      january: "",
      february: "",
      march: "",
      april: "",
      may: "",
      june: "",
      july: "",
      august: "",
      september: "",
      october: "",
      november: "",
      december: "",
    },
  };

  const [selectedClass, setSelectedClass] = useState("");
  const [fees, setFees] = useState(initialFees);

  // --- NEW: FETCH EXISTING DATA ON CLASS SELECTION ---
  useEffect(() => {
    const fetchExistingFees = async () => {
      if (!selectedClass) {
        setFees(initialFees);
        return;
      }

      try {
        setLoading(true);
        // Calls the endpoint we created in financeController.js
        const res = await axiosInstance.get(
          `/finance/structure/${selectedClass}`
        );

        if (res.data && res.data.fees) {
          setFees(res.data.fees); // Hydrate the form with stored data
          toast.success(`Loaded stored fees for Class ${selectedClass}`);
        } else {
          setFees(initialFees); // Reset if no blueprint exists yet
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setFees(initialFees); // Fallback to blank if not found (404)
      } finally {
        setLoading(false);
      }
    };

    fetchExistingFees();
  }, [selectedClass]); // Runs every time class selection changes

  const handleInputChange = (category, field, value) => {
    if (category) {
      setFees((prev) => ({
        ...prev,
        [category]: { ...prev[category], [field]: value },
      }));
    } else {
      setFees((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!selectedClass) return toast.error("Please select a class first");
    setLoading(true);
    try {
      await axiosInstance.post("/finance/master-fees/bulk", {
        applicableClass: selectedClass,
        fees,
      });
      toast.success(`Fee structure for Class ${selectedClass} saved!`);
    } catch (err) {
      toast.error("Failed to save fee structure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-100">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Fee Blueprint Manager
            </h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Super Admin Setup
            </p>
          </div>
        </div>
        <select
          className="p-4 bg-slate-50 rounded-2xl border-none outline-none font-black text-slate-700 min-w-[200px] ring-2 ring-indigo-50"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class to Setup</option>
          {masterClasses?.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GENERAL & EXAM FEES */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <LayoutGrid size={16} /> Basic & Exam Fees
            </h3>
            <div className="space-y-4">
              <InputField
                label="Session Fee"
                value={fees.sessionFee}
                onChange={(v) => handleInputChange(null, "sessionFee", v)}
              />
              <InputField
                label="IT Fee"
                value={fees.itFee}
                onChange={(v) => handleInputChange(null, "itFee", v)}
              />
              <div className="pt-4 border-t border-slate-50 space-y-4">
                <InputField
                  label="Half-Yearly Exam"
                  value={fees.examFees?.halfYearly || ""}
                  onChange={(v) =>
                    handleInputChange("examFees", "halfYearly", v)
                  }
                />
                <InputField
                  label="Annual Exam"
                  value={fees.examFees?.annual || ""}
                  onChange={(v) => handleInputChange("examFees", "annual", v)}
                />
                {(selectedClass.includes("Nine") ||
                  selectedClass.includes("Ten") ||
                  selectedClass.includes("9") ||
                  selectedClass.includes("10")) && (
                  <>
                    <InputField
                      label="Pre-Test Fee"
                      value={fees.examFees?.preTest || ""}
                      onChange={(v) =>
                        handleInputChange("examFees", "preTest", v)
                      }
                    />
                    <InputField
                      label="Test Exam Fee"
                      value={fees.examFees?.test || ""}
                      onChange={(v) => handleInputChange("examFees", "test", v)}
                    />
                  </>
                )}
              </div>
            </div>
          </section>

          <Button
            onClick={handleSave}
            disabled={loading || !selectedClass}
            className="w-full py-6 rounded-[2rem] bg-indigo-600 font-black text-lg shadow-xl"
          >
            <Save className="mr-2" />
            {loading ? "Processing..." : "Save Master Structure"}
          </Button>
        </div>

        {/* MONTHLY TUITION GRID */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            Monthly Tuition Fee (January - December)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.keys(fees.monthlyFees).map((month) => (
              <div key={month} className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                  {month}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-600"
                  value={fees.monthlyFees[month] || ""}
                  onChange={(e) =>
                    handleInputChange("monthlyFees", month, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
      {label}
    </label>
    <input
      type="number"
      placeholder="0.00"
      className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default FeeMasterSetup;
