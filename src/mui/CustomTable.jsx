import React from "react";

const CustomTable = ({
  columns = [],
  data = [],
  onRowActionClick = () => {},
}) => {
  return (
    <div className="w-full overflow-x-auto mt-4">
      <div className="min-w-[768px]">
        <table className="w-full table-fixed text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-700">
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3">
                  {col.header}
                </th>
              ))}
              {onRowActionClick && <th className="px-4 py-3">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="bg-white text-sm text-gray-700 border border-[#cdcdcd] rounded-xl"
                style={{
                  border: "2px solid #cdcdcd",
                  borderRadius: "12px",
                }}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-3 ${
                      colIndex === 0 ? "rounded-l-xl" : ""
                    } ${colIndex === columns.length - 1 ? "rounded-r-xl" : ""}`}
                  >
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : row[col.accessor]}
                  </td>
                ))}
                {onRowActionClick && (
                  <td className="px-4 py-3 rounded-r-xl">
                    <div className="flex gap-3 items-center">
                      {onRowActionClick(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
