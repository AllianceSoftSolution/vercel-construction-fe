import { useRef, useState } from "react";
import { formatFileSize, validateFiles } from "../../utils/fileUpload";

const FileUploadField = ({
  label,
  files = [],
  onChange,
  multiple = true,
  required = false,
  disabled = false,
  accept,
  helperText,
  error,
}) => {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState("");

  const handleFiles = (fileList) => {
    const nextFiles = multiple
      ? [...files, ...Array.from(fileList || [])]
      : Array.from(fileList || []).slice(0, 1);
    const validation = validateFiles(nextFiles, { multiple });
    if (!validation.valid) {
      setLocalError(validation.errors[0] || "Invalid file selection");
      return;
    }
    setLocalError("");
    onChange?.(validation.files);
  };

  const removeFile = (index) => {
    const next = files.filter((_, i) => i !== index);
    onChange?.(next);
    setLocalError("");
  };

  const displayError = error || localError;

  return (
    <div className="w-full">
      {label ? (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required ? <span className="text-red-500 ml-0.5">*</span> : null}
        </label>
      ) : null}

      <div
        className={`rounded-lg border-2 border-dashed px-4 py-5 transition-colors ${
          disabled
            ? "border-gray-200 bg-gray-50 opacity-70"
            : "border-orange-300 bg-orange-50/40 hover:border-orange-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="rounded-md bg-[#1e3a8a] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {multiple ? "Choose files" : "Choose file"}
          </button>
          <p className="text-xs text-gray-600">
            Up to 150MB per file{multiple ? " · multiple files allowed" : ""}
          </p>
          {helperText ? (
            <p className="text-xs text-gray-500">{helperText}</p>
          ) : null}
        </div>
      </div>

      {files.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <div className="min-w-0 pr-3">
                <p className="truncate font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeFile(index)}
                className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {displayError ? (
        <p className="mt-2 text-sm text-red-600">{displayError}</p>
      ) : null}
    </div>
  );
};

export default FileUploadField;
