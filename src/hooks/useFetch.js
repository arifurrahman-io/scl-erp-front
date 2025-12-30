import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAcademic } from "../context/AcademicContext";

export const useFetch = (url, options = { manual: false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!options.manual);
  const [error, setError] = useState(null);

  // Get global filters from AcademicContext
  const { activeYear, activeCampus } = useAcademic();

  const fetchData = useCallback(
    async (customUrl) => {
      setLoading(true);
      try {
        // Automatically append Year and Campus to every GET request
        const response = await axiosInstance.get(customUrl || url, {
          params: {
            academicYearId: activeYear?._id,
            campusId: activeCampus?._id,
          },
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [url, activeYear, activeCampus]
  );

  useEffect(() => {
    if (!options.manual && activeYear && activeCampus) {
      fetchData();
    }
  }, [fetchData, options.manual, activeYear, activeCampus]);

  return { data, loading, error, refetch: fetchData };
};
