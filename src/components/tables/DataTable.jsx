import React from "react";

const DataTable = ({ columns, data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-50 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-slate-50/80 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 text-slate-700 whitespace-nowrap"
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-20 text-center text-slate-400 italic"
              >
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// ADD THIS LINE AT THE VERY BOTTOM:
export default DataTable;
