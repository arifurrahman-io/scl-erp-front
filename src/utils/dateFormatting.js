/**
 * Standardizes date display across the ERP
 */
export const formatDate = (date, format = "medium") => {
  if (!date) return "N/A";
  const d = new Date(date);

  const options = {
    short: { day: "2-digit", month: "2-digit", year: "numeric" }, // 15/10/2025
    medium: { day: "numeric", month: "short", year: "numeric" }, // 15 Oct 2025
    long: { day: "numeric", month: "long", year: "numeric" }, // October 15, 2025
    withTime: {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  };

  return new Intl.DateTimeFormat("en-GB", options[format]).format(d);
};

// Useful for <input type="date" /> values
export const toInputDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
