const MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024;

const ALLOWED_FILE_EXTENSIONS = [
  ".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".doc", ".docx", ".xls", ".xlsx", ".txt",
];

const ALLOWED_MIME_TYPES = [
  "application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

const getExtension = (fileName = "") => {
  const idx = fileName.lastIndexOf(".");
  return idx >= 0 ? fileName.slice(idx).toLowerCase() : "";
};

const isAllowedFileType = (file) => {
  const mime = (file?.type || "").toLowerCase();
  const ext = getExtension(file?.name || "");
  if (mime && ALLOWED_MIME_TYPES.includes(mime)) return true;
  if (ext && ALLOWED_FILE_EXTENSIONS.includes(ext)) return true;
  return !mime && !ext;
};

const normalizeSelectedFiles = (fileList) => {
  if (!fileList) return [];
  return Array.from(fileList).filter(Boolean);
};

const validateFiles = (fileList, { multiple = true } = {}) => {
  const files = normalizeSelectedFiles(fileList);
  if (files.length === 0) {
    return { valid: false, files: [], errors: ["Select at least one file"] };
  }
  if (!multiple && files.length > 1) {
    return { valid: false, files, errors: ["Only one file is allowed"] };
  }
  const errors = [];
  for (const file of files) {
    if (file.size <= 0) errors.push(`${file.name} is empty`);
    else if (file.size > MAX_FILE_SIZE_BYTES) errors.push(`${file.name} exceeds the 150MB limit`);
    else if (!isAllowedFileType(file)) errors.push(`${file.name} has an unsupported file type`);
  }
  return { valid: errors.length === 0, files, errors };
};

const normalizeAttachmentUrls = (input) => {
  if (input == null) return [];
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        return normalizeAttachmentUrls(JSON.parse(trimmed));
      } catch {
        return [trimmed];
      }
    }
    return [trimmed];
  }
  if (Array.isArray(input)) {
    return input.flatMap((item) => normalizeAttachmentUrls(item)).filter(Boolean);
  }
  return [];
};

const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = value >= 10 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
};

const makeFile = (name, size, type = "application/pdf") => ({ name, size, type });

let passed = 0;
let failed = 0;
const assert = (label, condition) => {
  if (condition) {
    passed += 1;
    console.log(`✓ ${label}`);
  } else {
    failed += 1;
    console.error(`✗ ${label}`);
  }
};

assert("rejects empty selection", validateFiles([]).valid === false);
assert(
  "accepts file under 150MB",
  validateFiles([makeFile("ok.pdf", MAX_FILE_SIZE_BYTES - 1024)]).valid === true
);
assert(
  "rejects file over 150MB",
  validateFiles([makeFile("big.pdf", MAX_FILE_SIZE_BYTES + 1)]).valid === false
);
assert(
  "rejects mixed batch when one file is too large",
  validateFiles([
    makeFile("small.pdf", 1024),
    makeFile("big.pdf", MAX_FILE_SIZE_BYTES + 1),
  ]).valid === false
);
assert(
  "normalize legacy string URL",
  normalizeAttachmentUrls("https://example.com/a.pdf")[0] === "https://example.com/a.pdf"
);
assert(
  "normalize array input",
  normalizeAttachmentUrls(["https://a", "https://b"]).length === 2
);
assert("formatFileSize returns MB label", /MB/.test(formatFileSize(1024 * 1024)));

console.log(`\n${passed}/${passed + failed} checks passed`);
if (failed > 0) process.exit(1);
