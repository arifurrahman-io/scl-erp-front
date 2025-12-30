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
import StudentProfile from "./pages/students/StudentProfile"; // New: View Profile

// Finance Pages
import FeeCollection from "./pages/finance/FeeCollection";
import DefaulterList from "./pages/finance/DefaulterList";
import FeeMasterSetup from "./pages/admin/FeeMasterSetup"; // Management page

// Academic / Exam Pages
import MarksEntry from "./pages/exams/MarksEntry";
import AttendanceEntry from "./pages/teacher/AttendanceEntry";

// Settings Pages (Super Admin Specific Features)
import SchoolSettings from "./pages/admin/SchoolSettings";
import AcademicYearManagement from "./pages/admin/AcademicYearManagement";
import SchoolStructureManagement from "./pages/admin/SchoolStructureManagement";

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
            {/* 1. General Access (All authenticated users) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* 2. Academic Management (Super Admin & Admin) */}
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
              {/* New: Dedicated Student View & Edit Routes */}
              <Route
                path="/students/profile/:studentId"
                element={<StudentProfile />}
              />
              <Route
                path="/students/edit/:id"
                element={<StudentRegistration />}
              />
            </Route>

            {/* 3. Financial Management (Super Admin & Accountant) */}
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

            {/* 4. Teaching & Attendance (Teachers & Class Teachers) */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.TEACHER, ROLES.CLASS_TEACHER]}
                />
              }
            >
              <Route path="/attendance" element={<AttendanceEntry />} />
              <Route path="/marks-entry" element={<MarksEntry />} />
            </Route>

            {/* 5. Enterprise Settings (SUPER_ADMIN ONLY) */}
            <Route
              element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}
            >
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
