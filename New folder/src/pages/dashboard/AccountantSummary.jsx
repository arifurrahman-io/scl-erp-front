import { useFetch } from "../../hooks/useFetch";
import {
  IndianRupee,
  CreditCard,
  Users,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

const AccountantSummary = () => {
  // Fetches daily financial summary from the backend
  const { data: finance, loading } = useFetch("/finance/daily-summary");

  if (loading)
    return <div className="h-64 bg-slate-100 animate-pulse rounded-xl" />;

  return (
    <div className="space-y-6">
      {/* Financial Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Collection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Today's Collection
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                ৳{finance?.todayTotal?.toLocaleString() || 0}
              </h2>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <IndianRupee size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-emerald-600 text-xs font-medium">
            <ArrowUpRight size={14} className="mr-1" />
            <span>+12% from yesterday</span>
          </div>
        </div>

        {/* Pending This Month */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Pending (Current Month)
              </p>
              <h2 className="text-3xl font-black text-rose-600">
                ৳{finance?.pendingMonth?.toLocaleString() || 0}
              </h2>
            </div>
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
          </div>
          <p className="mt-4 text-slate-400 text-xs italic">
            Requires immediate follow-up
          </p>
        </div>

        {/* Total Defaulters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                Total Defaulters
              </p>
              <h2 className="text-3xl font-black text-slate-900">
                {finance?.defaulterCount || 0}
              </h2>
            </div>
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/finance/defaulters")}
            className="mt-4 text-indigo-600 text-xs font-bold hover:underline"
          >
            View List →
          </button>
        </div>
      </div>

      {/* Recent Transactions Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Collections</h3>
          <button className="text-xs font-semibold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Student ID</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Method</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {finance?.recentPayments?.map((pay, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {pay.studentId}
                  </td>
                  <td className="px-6 py-4 font-bold">৳{pay.amount}</td>
                  <td className="px-6 py-4 text-slate-500">{pay.method}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase">
                      Success
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountantSummary;
