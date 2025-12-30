import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";

// Dashboard / General Pages
import Dashboard from "./pages/dashboard/Index";
import Unauthorized from "./pages/feedback/Unauthorized";

// Student Pages
import StudentList from "./pages/students/StudentList";
import StudentRegistration from "./pages/students/StudentRegistration";
import StudentProfile from "./pages/students/StudentProfile";

// Finance Pages
import FeeCollection from "./pages/finance/FeeCollection";
import DefaulterList from "./pages/finance/DefaulterList";
import FeeMasterSetup from "./pages/admin/FeeMasterSetup";

// Academic / Exam Pages
import MarksEntry from "./pages/exams/MarksEntry";
import ResultGenerator from "./pages/exams/ResultGenerator";
import ReportCardView from "./pages/exams/ReportCardView";
import AttendanceEntry from "./pages/teacher/AttendanceEntry";

// Routine Management Pages
import MyRoutine from "./pages/teacher/MyRoutine"; // New: For Staff
import RoutineManagement from "./pages/admin/RoutineManagement"; // New: For Admins

// Settings & Management Pages
import SchoolSettings from "./pages/admin/SchoolSettings";
import AcademicYearManagement from "./pages/admin/AcademicYearManagement";
import SchoolStructureManagement from "./pages/admin/SchoolStructureManagement";
import UserManagement from "./pages/admin/UserManagement";
import TeacherManagement from "./pages/admin/TeacherManagement";

// Constants for RBAC
import { ROLES } from "./constants/roles";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* --- PROTECTED DASHBOARD ROUTES --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* 1. General Access (All Authenticated Users) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* 2. Staff Personal Workspace (Teachers & Class Teachers) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.TEACHER,
                    ROLES.CLASS_TEACHER,
                    ROLES.SUPER_ADMIN,
                  ]}
                />
              }
            >
              <Route path="/routine" element={<MyRoutine />} />
            </Route>

            {/* 3. Academic Management (Super Admin & Admin) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}
                />
              }
            >
              <Route path="/students" element={<StudentList />} />
              <Route
                path="/students/register"
                element={<StudentRegistration />}
              />
              <Route
                path="/students/profile/:studentId"
                element={<StudentProfile />}
              />
              <Route
                path="/students/edit/:id"
                element={<StudentRegistration />}
              />

              {/* Examination & Result Nodes */}
              <Route
                path="/exams/generate-results"
                element={<ResultGenerator />}
              />

              {/* Routine Assignment Tool */}
              <Route
                path="/settings/routine-setup"
                element={<RoutineManagement />}
              />
            </Route>

            {/* 4. Financial Management (Super Admin & Accountant) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT]}
                />
              }
            >
              <Route path="/finance/collect" element={<FeeCollection />} />
              <Route path="/finance/defaulters" element={<DefaulterList />} />
            </Route>

            {/* 5. Teaching & Performance Node (Shared Academic Roles) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.TEACHER,
                    ROLES.CLASS_TEACHER,
                    ROLES.SUPER_ADMIN,
                    ROLES.ADMIN,
                  ]}
                />
              }
            >
              <Route path="/attendance" element={<AttendanceEntry />} />
              <Route path="/exams/marks-entry" element={<MarksEntry />} />
              <Route path="/exams/report-cards" element={<ReportCardView />} />
            </Route>

            {/* 6. Enterprise Config & HR (SUPER_ADMIN ONLY) */}
            <Route
              element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}
            >
              <Route path="/settings/users" element={<UserManagement />} />
              <Route
                path="/settings/teachers"
                element={<TeacherManagement />}
              />
              <Route path="/settings" element={<SchoolSettings />} />
              <Route path="/settings/branding" element={<SchoolSettings />} />
              <Route path="/settings/fees" element={<FeeMasterSetup />} />
              <Route
                path="/settings/years"
                element={<AcademicYearManagement />}
              />
              <Route
                path="/settings/structure"
                element={<SchoolStructureManagement />}
              />
            </Route>
          </Route>
        </Route>

        {/* --- 404 CATCH-ALL --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
