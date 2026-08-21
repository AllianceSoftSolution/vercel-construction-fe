import {
  ALLOWED_FILE_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "../constants/fileUpload";

export const formatFileSize = (bytes) => {
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

const getExtension = (fileName = "") => {
  const idx = fileName.lastIndexOf(".");
  return idx >= 0 ? fileName.slice(idx).toLowerCase() : "";
};

export const isAllowedFileType = (file) => {
  const mime = (file?.type || "").toLowerCase();
  const ext = getExtension(file?.name || "");
  if (mime && ALLOWED_MIME_TYPES.includes(mime)) return true;
  if (ext && ALLOWED_FILE_EXTENSIONS.includes(ext)) return true;
  return !mime && !ext;
};

export const normalizeSelectedFiles = (fileList) => {
  if (!fileList) return [];
  return Array.from(fileList).filter(Boolean);
};

export const validateFiles = (fileList, { multiple = true } = {}) => {
  const files = normalizeSelectedFiles(fileList);
  if (files.length === 0) {
    return { valid: false, files: [], errors: ["Select at least one file"] };
  }
  if (!multiple && files.length > 1) {
    return {
      valid: false,
      files,
      errors: ["Only one file is allowed"],
    };
  }

  const errors = [];
  for (const file of files) {
    if (file.size <= 0) {
      errors.push(`${file.name} is empty`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(`${file.name} exceeds the 150MB limit`);
      continue;
    }
    if (!isAllowedFileType(file)) {
      errors.push(`${file.name} has an unsupported file type`);
    }
  }

  return {
    valid: errors.length === 0,
    files,
    errors,
  };
};

export const normalizeAttachmentUrls = (input) => {
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
