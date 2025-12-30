import { useAuth as useAuthContext } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

export const useAuth = () => {
  const context = useAuthContext();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, logout, isAuthenticated, loading } = context;

  // Utility helpers for quick role checks
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  const isAdmin = user?.role === ROLES.ADMIN;
  const isTeacher =
    user?.role === ROLES.TEACHER || user?.role === ROLES.CLASS_TEACHER;
  const isAccountant = user?.role === ROLES.ACCOUNTANT;

  return {
    user,
    logout,
    isAuthenticated,
    loading,
    isSuperAdmin,
    isAdmin,
    isTeacher,
    isAccountant,
    role: user?.role,
  };
};
