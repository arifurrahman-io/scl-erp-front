import axiosInstance from "../axiosInstance";
import { ENDPOINTS } from "../endpoints";

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
