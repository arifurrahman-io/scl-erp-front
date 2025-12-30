import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const AcademicContext = createContext();

export const AcademicProvider = ({ children }) => {
  const { user } = useAuth();

  // Selection States
  const [activeCampus, setActiveCampus] = useState(null);
  const [activeYear, setActiveYear] = useState(null);

  // Data Lists
  const [campuses, setCampuses] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const initializeAcademicData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Fetch Academic Years
      const yearRes = await axiosInstance.get("/academics/years");
      const availableYears = yearRes.data;
      setYears(availableYears);

      // Persistence Logic: Check localStorage first, then fallback to 'isCurrent' flag
      const savedYearId = localStorage.getItem("preferredYearId");
      const currentYear = availableYears.find((y) => y.isCurrent);
      const yearToSet =
        availableYears.find((y) => y._id === savedYearId) ||
        currentYear ||
        availableYears[0];

      setActiveYear(yearToSet);

      // 2. Set Campuses based on Role
      let availableCampuses = [];
      if (user.role === "SUPER_ADMIN") {
        const campusRes = await axiosInstance.get("/campuses");
        availableCampuses = campusRes.data;
      } else {
        availableCampuses = user.campuses || [];
      }

      setCampuses(availableCampuses);

      // Persistence Logic for Campus
      const savedCampusId = localStorage.getItem("preferredCampusId");
      const campusToSet =
        availableCampuses.find((c) => c._id === savedCampusId) ||
        availableCampuses[0];

      setActiveCampus(campusToSet);
    } catch (error) {
      console.error("Context Initialization Error:", error);
      toast.error("Failed to sync academic session");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    initializeAcademicData();
  }, [initializeAcademicData]);

  // Methods to change global state with persistence
  const changeCampus = (campusId) => {
    const selected = campuses.find((c) => c._id === campusId);
    if (selected) {
      setActiveCampus(selected);
      localStorage.setItem("preferredCampusId", campusId);
      toast.success(`Switched to ${selected.name}`);
    }
  };

  const changeYear = (yearId) => {
    const selected = years.find((y) => y._id === yearId);
    if (selected) {
      setActiveYear(selected);
      localStorage.setItem("preferredYearId", yearId);
      toast.success(`Session set to ${selected.year}`);
    }
  };

  const value = {
    activeCampus,
    activeYear,
    campuses,
    years,
    loading,
    changeCampus,
    changeYear,
    refreshData: initializeAcademicData,
  };

  return (
    <AcademicContext.Provider value={value}>
      {!loading && children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error("useAcademic must be used within an AcademicProvider");
  }
  return context;
};
