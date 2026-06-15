import React from "react";
import { CiExport } from "react-icons/ci";
import toast from "react-hot-toast";
import { exportTableToExcel } from "../modules/tableExportHelpers";

const ExportToExcelButton = ({
  data = [],
  columns = [],
  fileName = "export",
  cellComponents = {},
  showNA = false,
  className = "",
  label = "Export to Excel",
  disabled = false,
}) => {
  const handleExport = () => {
    const result = exportTableToExcel(data, columns, fileName, {
      cellComponents,
      showNA,
    });

    if (!result.ok) {
      toast.error(result.message || "Failed to export data");
      return;
    }

    toast.success("Excel file downloaded");
  };

  const isDisabled = disabled || !data?.length;

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isDisabled}
      className={`bg-primary text-white px-4 py-2 rounded-lg w-fit text-[16px] gap-x-2 whitespace-nowrap transition-opacity flex items-center ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
      } ${className}`}
      aria-label={label}
    >
      <CiExport className="text-white shrink-0" />
      <span className="text-white text-sm font-medium">{label}</span>
    </button>
  );
};

export default ExportToExcelButton;
