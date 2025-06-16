import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the default styles
import clsx from "clsx"; // For conditional class handling
import { useMediaQuery } from "@mui/material";

const RichTextEditor = ({
  editorContent,
  handleChange,
  preview,
  rows = 5,
  label, // Add label prop
  subLabel, // Add subLabel prop (optional)
  className,
  readOnly = false,
}) => {
  const handleEditorChange = (content) => {
    handleChange(content); // Update state when the editor content changes
  };

  // Convert rows to height (one row is approximately 24px in height by default)
  const editorHeight = `${rows * 2}rem`;
  const isGreaterThan900px = useMediaQuery("(min-width:900px)");
  return (
    <div className={clsx("flex  flex-col gap-y-1", className)}>
      {/* Label and optional subLabel */}
      {label && (
        <p className="flex flex-col">
          {label}
          {subLabel && (
            <span className="text-sm  text-[#130901]/50">{subLabel}</span>
          )}
        </p>
      )}

      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        readOnly={readOnly}
        theme="snow"
        placeholder="Write something amazing..."
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link"],
            ["clean"], // Remove formatting button
          ],
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
        ]}
        className="custom-quill "
        style={{ height: editorHeight, paddingBottom: 40 }} // Set height based on rows
      />

      {/* Uncomment the following to enable preview */}
      {/* {preview && (
        <div style={{ marginTop: "20px" }}>
          <h4>Preview:</h4>
          <div
            dangerouslySetInnerHTML={{ __html: editorContent }}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "4px",
              minHeight: "fit-content",
            }}
          />
        </div>
      )} */}
    </div>
  );
};

export default RichTextEditor;
