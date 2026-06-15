import React from "react";
import ExportToExcelButton from "../components/ExportToExcelButton";

const CustomTable = ({
  columns = [],
  data = [],
  exportable = true,
  exportFileName = "table-export",
}) => {
  const exportColumns = columns.map((col) => ({
    headerName: col.header,
    field: col.accessor,
    getExportValue: col.getExportValue,
    exportable: col.exportable,
  }));

  return (
    <div>
      {exportable && (
        <div className="flex justify-end mb-2">
          <ExportToExcelButton
            data={data}
            columns={exportColumns}
            fileName={exportFileName}
          />
        </div>
      )}
    <table className="w-full text-left border-separate border-spacing-y-3 overflow-x-hidden">
      <thead>
        <tr className="text-gray-700">
          <th className="px-4 py-3">
            <input type="checkbox" />
          </th>
          {columns.map((col, idx) => (
            <th key={idx} className="px-4 py-3">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={row.id || rowIndex}
            className="bg-[#EBEBEB] text-sm text-gray-700 border border-[#cdcdcd] rounded-xl"
            style={{
              border: "2px solid #cdcdcd",
              borderRadius: "12px",
            }}
          >
            <td className="px-4 py-3 rounded-l-xl">
              <input type="checkbox" />
            </td>
            {columns.map((col, colIndex) => (
              <td key={colIndex} className={`px-4 py-3`}>
                {col.render
                  ? col.render(row[col.accessor], row)
                  : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default CustomTable;
