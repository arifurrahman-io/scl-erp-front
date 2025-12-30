import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FinanceChart = ({ data }) => {
  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-slate-800 font-semibold mb-4">
        Collection vs Pending Fees
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "#f8fafc" }} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
          <Bar
            dataKey="collected"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            name="Paid"
          />
          <Bar
            dataKey="pending"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            name="Unpaid"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
