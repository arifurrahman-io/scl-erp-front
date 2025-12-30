export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },
  CAMPUS: {
    // Change to plural to match standard Express/MongoDB collection routing
    BASE: "/campuses",
    SINGLE: (id) => `/campuses/${id}`,
    ACADEMIC_YEARS: "/campuses/academic-years",
  },
  SETUP: {
    // Global Blueprints (The DNA)
    MASTER_CLASSES: "/setup/master-classes",
    MASTER_SUBJECTS: "/setup/master-subjects",
    DEPLOY: "/setup/deploy",

    // Subject Management (List, Edit, Delete)
    SUBJECTS: (classId) => `/setup/subjects/${classId}`, // For GET
    SUBJECT_BASE: "/setup/subjects", // For POST (if generic), PUT, and DELETE

    // Campus Specifics
    CLASSES: (campusId) => `/setup/classes/${campusId}`,
    CLASS_BASE: "/setup/classes",
    SECTIONS: (classId) => `/setup/sections/${classId}`,
  },
  STUDENTS: {
    BASE: "/students", // Added for the general list/filters
    REGISTER: (campusId) => `/students/${campusId}/register`,
    BULK_IMPORT: "/students/import-csv",
    PROFILE: (id) => `/students/profile/${id}`,
    LIST_BY_SECTION: (sectionId) => `/students/section/${sectionId}`,
  },
  FINANCE: {
    COLLECT_FEE: "/finance/collect",
    REPORTS: "/finance/reports",
    FEE_STRUCTURE: (classId) => `/finance/structure/${classId}`,
  },
};
