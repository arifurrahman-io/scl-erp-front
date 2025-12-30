import * as XLSX from "xlsx";

/**
 * Exports JSON data to a professional Excel file
 */
export const exportToExcel = (data, fileName = "Report") => {
  // Create worksheet from JSON
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Fix column widths (optional but makes it look professional)
  const max_width = data.reduce(
    (w, r) => Math.max(w, Object.keys(r).length),
    10
  );
  worksheet["!cols"] = Array(max_width).fill({ wch: 20 });

  // Generate buffer and trigger download
  XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
};
