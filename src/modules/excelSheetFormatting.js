import * as XLSX from "xlsx-js-style";

const MIN_COLUMN_WIDTH = 18;
const COLUMN_PADDING = 6;

export const buildStyledWorksheet = (rows = [], headers = []) => {
  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = headers.map((header) => {
    const headerLength = String(header).length;
    const maxDataLength = rows.reduce((max, row) => {
      const cellValue = String(row[header] ?? "");
      return Math.max(max, cellValue.length);
    }, 0);

    const width = Math.max(headerLength, maxDataLength) + COLUMN_PADDING;

    return {
      wch: Math.min(Math.max(width, MIN_COLUMN_WIDTH), 60),
    };
  });

  headers.forEach((_, columnIndex) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: columnIndex });
    if (!worksheet[cellRef]) return;

    worksheet[cellRef].s = {
      font: { bold: true },
      alignment: { vertical: "center", horizontal: "left" },
    };
  });

  return worksheet;
};

export const writeStyledWorkbookToFile = (worksheet, fileName) => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const safeName = String(fileName || "export").replace(/[\\/:*?"<>|]/g, "_");
  XLSX.writeFile(workbook, `${safeName}.xlsx`);
};

export const writeStyledWorkbookToBase64 = (worksheet) => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  return XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
};
