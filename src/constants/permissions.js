import { ROLES } from "./roles";

export const PERMISSIONS = {
  // User Management
  CAN_CREATE_USER: [ROLES.SUPER_ADMIN],
  CAN_DELETE_USER: [ROLES.SUPER_ADMIN],

  // Academic Structure
  CAN_MANAGE_CAMPUS: [ROLES.SUPER_ADMIN],
  CAN_MANAGE_CLASSES: [ROLES.SUPER_ADMIN, ROLES.ADMIN],

  // Student Lifecycle
  CAN_REGISTER_STUDENT: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  CAN_PROMOTE_STUDENT: [ROLES.SUPER_ADMIN, ROLES.ADMIN],

  // Daily Operations
  CAN_MARK_ATTENDANCE: [ROLES.CLASS_TEACHER],
  CAN_ENTRY_MARKS: [ROLES.CLASS_TEACHER, ROLES.TEACHER],

  // Finance
  CAN_COLLECT_FEES: [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT],
  CAN_WAIVE_FINES: [ROLES.SUPER_ADMIN, ROLES.CLASS_TEACHER], // Per your requirement

  // Reporting
  CAN_VIEW_GLOBAL_REPORTS: [ROLES.SUPER_ADMIN],
  CAN_VIEW_CAMPUS_REPORTS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
};

/**
 * Helper function to check permission
 * Usage: hasPermission(user.role, PERMISSIONS.CAN_COLLECT_FEES)
 */
export const hasPermission = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};
