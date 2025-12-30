import EnrollmentChart from "../../components/charts/EnrollmentChart";
import FinanceChart from "../../components/charts/FinanceChart";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EnrollmentChart data={[]} /> {/* Pass fetched data here */}
        <FinanceChart data={[]} />
      </div>
    </div>
  );
};
