import ExportToExcelButton from "./ExportToExcelButton";

/**
 * Inline row for filter controls + export button (same row).
 */
const TableActionsRow = ({
  children,
  exportData = [],
  exportColumns = [],
  exportFileName = "export",
  exportCellComponents = {},
  className = "mt-2 mb-4",
}) => {
  return (
    <div
      className={`flex flex-row flex-wrap items-center justify-end gap-2 sm:gap-3 ${className}`}
    >
      {children}
      {exportColumns.length > 0 && (
        <ExportToExcelButton
          data={exportData}
          columns={exportColumns}
          fileName={exportFileName}
          cellComponents={exportCellComponents}
        />
      )}
    </div>
  );
};

export default TableActionsRow;
