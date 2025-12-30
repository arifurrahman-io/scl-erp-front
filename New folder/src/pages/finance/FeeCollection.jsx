import { useState, useEffect } from "react";
import { useAcademic } from "../../context/AcademicContext";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import Button from "../../components/ui/Button";
import {
  Search,
  Receipt,
  Wallet,
  CheckCircle2,
  Circle,
  Calendar,
  UserCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

const FeeCollection = () => {
  const { activeCampus, activeYear } = useAcademic();
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState(null);
  const [feeBlueprint, setFeeBlueprint] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Search Student & Load the Class-wise Nested Blueprint
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.STUDENTS.PROFILE(searchId));
      const studentData = res.data;
      setStudent(studentData);

      // Fetch the nested blueprint for the student's class (e.g., "Six")
      const feeRes = await axiosInstance.get(
        `${ENDPOINTS.FINANCE.FEE_STRUCTURE(studentData.class)}`
      );

      // feeRes.data will now contain the 'fees' object with monthlyFees, examFees, etc.
      setFeeBlueprint(feeRes.data.fees);
      setSelectedFees([]);
      toast.success("Student records & class fee schedule loaded");
    } catch (err) {
      toast.error("Student ID not found");
      setStudent(null);
      setFeeBlueprint(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. Toggle Fee Selection (Handles nested naming)
  const toggleFee = (feeName, amount, category) => {
    const feeId = `${category}-${feeName}`; // Unique ID for selection tracking
    const isSelected = selectedFees.find((f) => f.id === feeId);

    if (isSelected) {
      setSelectedFees(selectedFees.filter((f) => f.id !== feeId));
    } else {
      setSelectedFees([
        ...selectedFees,
        { id: feeId, name: feeName, amount: Number(amount), category },
      ]);
    }
  };

  const totalAmount = selectedFees.reduce((acc, curr) => acc + curr.amount, 0);

  // 3. Process Collection
  const handlePayment = async () => {
    if (selectedFees.length === 0)
      return toast.error("Please select at least one item");

    try {
      setLoading(true);
      const payload = {
        student: student._id,
        studentId: student.studentId,
        campus: student.campus,
        academicYear: activeYear?._id,
        selectedItems: selectedFees.map((f) => ({
          feeName: f.name,
          amount: f.amount,
          category: f.category,
        })),
        totalAmount,
        paymentMethod: "Cash",
      };

      const res = await axiosInstance.post(
        ENDPOINTS.FINANCE.COLLECT_FEE,
        payload
      );
      toast.success(`Payment successful! Receipt: ${res.data.receiptNo}`);

      setStudent(null);
      setFeeBlueprint(null);
      setSearchId("");
    } catch (err) {
      toast.error("Failed to process transaction");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render fee cards
  const FeeCard = ({ name, amount, category }) => {
    if (!amount || amount <= 0) return null;
    const feeId = `${category}-${name}`;
    const isSelected = selectedFees.find((f) => f.id === feeId);

    return (
      <div
        onClick={() => toggleFee(name, amount, category)}
        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${
          isSelected
            ? "border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]"
            : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {isSelected ? (
            <CheckCircle2 size={18} className="text-indigo-600" />
          ) : (
            <Circle
              size={18}
              className="text-slate-300 group-hover:text-slate-400"
            />
          )}
          <div>
            <p
              className={`font-bold text-xs capitalize ${
                isSelected ? "text-indigo-900" : "text-slate-700"
              }`}
            >
              {name.replace(/([A-Z])/g, " $1")}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              {category}
            </p>
          </div>
        </div>
        <p
          className={`font-black text-sm ${
            isSelected ? "text-indigo-600" : "text-slate-500"
          }`}
        >
          ৳{Number(amount).toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Search & Student Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Search size={14} className="text-indigo-600" /> Identity Search
            </h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: BAN-2025-26-01"
                className="flex-1 p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <Button
                type="submit"
                disabled={loading}
                className="rounded-2xl px-6 bg-indigo-600"
              >
                <ArrowRight size={20} />
              </Button>
            </form>
          </div>

          {student && (
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 space-y-6 animate-in slide-in-from-left-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center text-2xl font-black border border-white/20">
                  {student.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-black leading-tight">
                    {student.name}
                  </h2>
                  <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                    Class {student.class} • Sec {student.section}
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-indigo-300 uppercase">
                    Roll No
                  </p>
                  <p className="font-bold">#{student.roll}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-300 uppercase">
                    Campus
                  </p>
                  <p className="font-bold truncate">{student.campus}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Dynamic Fee Grid */}
        <div className="lg:col-span-8">
          {student && feeBlueprint ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                {/* 1. General Fees Section */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Wallet size={14} className="text-emerald-500" /> Basic &
                    Academic Fees
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FeeCard
                      name="Session Fee"
                      amount={feeBlueprint.sessionFee}
                      category="General"
                    />
                    <FeeCard
                      name="IT Fee"
                      amount={feeBlueprint.itFee}
                      category="General"
                    />
                    <FeeCard
                      name="Half-Yearly Exam"
                      amount={feeBlueprint.examFees.halfYearly}
                      category="Exam"
                    />
                    <FeeCard
                      name="Annual Exam"
                      amount={feeBlueprint.examFees.annual}
                      category="Exam"
                    />
                    <FeeCard
                      name="Pre-Test Fee"
                      amount={feeBlueprint.examFees.preTest}
                      category="Exam"
                    />
                    <FeeCard
                      name="Test Exam Fee"
                      amount={feeBlueprint.examFees.test}
                      category="Exam"
                    />
                  </div>
                </div>

                {/* 2. Monthly Fees Section */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-500" /> Monthly
                    Tuition (Jan - Dec)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(feeBlueprint.monthlyFees).map(
                      ([month, amount]) => (
                        <FeeCard
                          key={month}
                          name={month}
                          amount={amount}
                          category="Monthly"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction Summary Footer */}
              {selectedFees.length > 0 && (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
                      Items Selected: {selectedFees.length}
                    </p>
                    <p className="text-4xl font-black text-white">
                      ৳{totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                  >
                    {loading ? "Processing..." : "Confirm & Pay Now"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400">
              <Receipt size={64} className="opacity-10 mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">
                Search student to load dynamic fee structure
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeCollection;
