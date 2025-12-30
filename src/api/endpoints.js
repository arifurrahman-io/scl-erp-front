export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  // USER & STAFF MANAGEMENT
  USERS: {
    BASE: "/users",
    REGISTER: "/users/register", // Create any role
    SINGLE: (id) => `/users/${id}`, // Update/Delete by ID
    BY_ROLE_GROUP: (group) => `/users?roleGroup=${group}`, // ADMINISTRATIVE vs ACADEMIC
  },

  CAMPUS: {
    BASE: "/campuses",
    SINGLE: (id) => `/campuses/${id}`,
    ACADEMIC_YEARS: "/campuses/academic-years",
    SET_CURRENT_YEAR: (id) => `/campuses/academic-years/set-current/${id}`, //
    SCHOOL_PROFILE: "/campuses/school-profile", // Branding data
  },

  SETUP: {
    // Global Blueprints (Keep as /setup for Blueprint management)
    MASTER_CLASSES: "/setup/master-classes",
    MASTER_SUBJECTS: "/setup/master-subjects",
    DEPLOY: "/setup/deploy",

    // Subject Management
    SUBJECTS: (classId) => `/setup/subjects/${classId}`,
    SUBJECT_BASE: "/setup/subjects",

    // UPDATED: Use /settings for campus-specific structure as per your main router
    // This matches: router.use("/settings", setupRoutes)
    MASTER_STRUCTURE: "/settings/master-structure",

    // Updated Section Endpoints
    SECTIONS_BASE: "/settings/sections",
    SECTIONS_BY_CAMPUS: (campusId) => `/settings/sections/${campusId}`,
    SECTION_SINGLE: (id) => `/settings/sections/${id}`,

    CLASSES: (campusId) => `/settings/classes/${campusId}`,
    CLASS_BASE: "/settings/classes",
  },

  STUDENTS: {
    BASE: "/students", // General list with query filters
    REGISTER: (campusId) => `/students/${campusId}/register`,
    PROFILE: (studentId) => `/students/profile/${studentId}`, // For clean view
    SINGLE: (id) => `/students/${id}`, // Fetch by Mongo _id for Editing
    BULK_IMPORT: "/students/import-csv",
    LIST_BY_SECTION: (sectionId) => `/students/section/${sectionId}`,
  },

  FINANCE: {
    COLLECT_FEE: "/finance/collect",
    REPORTS: "/finance/reports",
    // Fee Blueprinting
    FEE_STRUCTURE: (className) => `/finance/structure/${className}`,
    FEE_MASTER_BULK: "/finance/master-fees/bulk",
  },

  ACADEMICS: {
    YEARS: "/academics/years", // Global session listing
    ATTENDANCE: "/teacher/attendance",
    MARKS: "/exams/marks",
  },
};
