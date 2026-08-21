import { useCallback, useState } from "react";
import apiClient from "../api/apiClient";
import { validateFiles } from "../utils/fileUpload";

export const useS3MultiUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFiles = useCallback(async (fileList, folder, options = {}) => {
    const { multiple = true } = options;
    const validation = validateFiles(fileList, { multiple });
    if (!validation.valid) {
      const message = validation.errors.join(". ");
      setError(message);
      throw new Error(message);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const files = validation.files;
      const presignRes = await apiClient.post("/files/presign", {
        folder,
        files: files.map((file) => ({
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
        })),
      });

      if (!presignRes.ok) {
        throw new Error(
          presignRes.data?.message || "Failed to prepare file upload"
        );
      }

      const uploads = presignRes.data?.data?.uploads || [];
      const publicUrls = [];

      for (let index = 0; index < uploads.length; index += 1) {
        const uploadInfo = uploads[index];
        const file = files[index];
        const putRes = await fetch(uploadInfo.url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        });
        if (!putRes.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        publicUrls.push(uploadInfo.publicUrl);
        setProgress(Math.round(((index + 1) / uploads.length) * 100));
      }

      return publicUrls;
    } catch (err) {
      const message = err?.message || "Upload failed";
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const resetUploadState = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploadFiles,
    uploading,
    progress,
    error,
    resetUploadState,
  };
};

export default useS3MultiUpload;
