import axiosInstance from "../axiosInstance";
import { ENDPOINTS } from "../endpoints";

const studentService = {
  register: async (campusId, studentData) => {
    const response = await axiosInstance.post(
      ENDPOINTS.STUDENTS.REGISTER(campusId),
      studentData
    );
    return response.data;
  },

  // Example for bulk upload
  importCSV: async (formData) => {
    const response = await axiosInstance.post(
      ENDPOINTS.STUDENTS.BULK_IMPORT,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
};

export default studentService;
