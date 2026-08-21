export const MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024;
export const MAX_FILE_SIZE_MB = 150;

export const ALLOWED_FILE_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".txt",
];

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

export const UPLOAD_FOLDERS = {
  proofOfExpense: "proofOfExpense",
  document: "document",
  proofOfBill: "proofOfBill",
  proofOfPayment: "proofOfPayment",
  utilityFile: "utilityFile",
};
