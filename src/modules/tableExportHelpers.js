import {
  buildStyledWorksheet,
  writeStyledWorkbookToFile,
} from "./excelSheetFormatting";

const DEFAULT_EXPORT_FILE_NAME = "table-export";

const slugifyExportSegment = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildExportFileName = (baseName, context = {}) => {
  const parts = [slugifyExportSegment(baseName)];

  if (
    context.projectName &&
    context.projectName !== "All Projects"
  ) {
    parts.push(slugifyExportSegment(context.projectName));
  }

  if (context.sectionName) {
    parts.push(slugifyExportSegment(context.sectionName));
  }

  return parts.filter(Boolean).join("-") || "export";
};

export const resolveExportFileName = ({
  exportFileName,
  tableTitle,
  exportContext = {},
} = {}) => {
  if (exportFileName && exportFileName !== DEFAULT_EXPORT_FILE_NAME) {
    return exportFileName;
  }

  if (tableTitle) {
    return buildExportFileName(tableTitle, exportContext);
  }

  return exportFileName || DEFAULT_EXPORT_FILE_NAME;
};

export const getNestedValue = (obj, path) => {
  if (!path || !obj) return "";
  const value = path.split(".").reduce((acc, part) => acc && acc[part], obj);
  if (value === undefined || value === null) return "";
  return value;
};

const isActionColumn = (column) => {
  const header = String(column.headerName || column.header || "").toLowerCase();
  const field = String(column.field || column.accessor || "").toLowerCase();
  return column.exportable === false || header === "action" || field === "action";
};

const formatExportValue = (value) => {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    if (value.name) return value.name;
    if (value.label) return value.label;
    return JSON.stringify(value);
  }
  return value;
};

export const getExportableColumns = (columns = []) =>
  columns.filter((column) => !isActionColumn(column));

export const buildExportRows = (
  data = [],
  columns = [],
  { cellComponents = {}, showNA = false } = {},
) => {
  const exportColumns = getExportableColumns(columns);

  return (data || []).filter(Boolean).map((row) => {
    const exportRow = {};

    exportColumns.forEach((column) => {
      const header = column.headerName || column.header || column.field;
      const field = column.field || column.accessor;

      let value;
      if (column.getExportValue) {
        value = column.getExportValue(row);
      } else if (cellComponents[field]) {
        value = getNestedValue(row, field);
      } else {
        value = getNestedValue(row, field);
      }

      if (showNA && (value === undefined || value === null || value === "")) {
        value = "N/A";
      }

      exportRow[header] = formatExportValue(value);
    });

    return exportRow;
  });
};

export const exportTableToExcel = (
  data = [],
  columns = [],
  fileName = "export",
  options = {},
) => {
  const rows = buildExportRows(data, columns, options);

  if (!rows.length) {
    return { ok: false, message: "No data available to export" };
  }

  const headers = getExportableColumns(columns).map(
    (column) => column.headerName || column.header || column.field,
  );
  const worksheet = buildStyledWorksheet(rows, headers);
  const safeName = String(fileName || "export").replace(/[\\/:*?"<>|]/g, "_");
  writeStyledWorkbookToFile(worksheet, safeName);

  return { ok: true };
};
