import { useAuth } from "../../hooks/useAuth";
import SuperAdminStats from "./SuperAdminStats";
import TeacherSchedule from "./TeacherSchedule";
import AccountantSummary from "./AccountantSummary";

const Dashboard = () => {
  const { user, isSuperAdmin, isTeacher, isAccountant } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.name}
        </h1>
        <p className="text-slate-500 text-sm">
          Here is what is happening in your campus today.
        </p>
      </header>

      {isSuperAdmin && <SuperAdminStats />}
      {isTeacher && <TeacherSchedule />}
      {isAccountant && <AccountantSummary />}
    </div>
  );
};

export default Dashboard;
