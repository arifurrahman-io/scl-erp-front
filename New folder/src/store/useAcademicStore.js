import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAcademicStore = create(
  persist(
    (set) => ({
      activeYear: null,
      activeCampus: null,
      availableYears: [],
      availableCampuses: [],

      // Actions
      setAcademicMetadata: (years, campuses) => {
        const currentYear = years.find((y) => y.isCurrent) || years[0];
        set({
          availableYears: years,
          availableCampuses: campuses,
          activeYear: currentYear,
          activeCampus: campuses[0], // Default to first assigned campus
        });
      },

      setActiveYear: (year) => set({ activeYear: year }),

      setActiveCampus: (campus) => set({ activeCampus: campus }),

      clearAcademicStore: () =>
        set({
          activeYear: null,
          activeCampus: null,
          availableYears: [],
          availableCampuses: [],
        }),
    }),
    {
      name: "academic-storage", // Key for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAcademicStore;
