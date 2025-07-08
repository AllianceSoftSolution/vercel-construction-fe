import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import clsx from "clsx";

const CustomTextField = React.forwardRef(
  (
    {
      label,
      labelColor = "text-gray-500",
      classInput,
      placeholder,
      handleChange,
      children,
      sx,
      name,
      field,
      className,
      type = "text",
      rows = "",
      startAdornment,
      endAdornment,
      subLabel,
      error,
      helperText,
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx("flex flex-col gap-y-1 w-full", className)}>
        {label && (
          <p className={`text-sm font-medium ${labelColor}`}>
            {label}
            {subLabel && (
              <span className="block text-sm text-[#130901]/50">
                {subLabel}
              </span>
            )}
          </p>
        )}

        <TextField
          inputRef={ref}
          type={rows === "" ? type : undefined}
          variant="outlined"
          multiline={rows !== ""}
          rows={rows === "" ? undefined : rows}
          size="small"
          name={name}
          className={clsx(" rounded-lg", classInput)}
          placeholder={placeholder}
          error={!!error}
          helperText={error ? helperText : ""}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: startAdornment ? (
              <InputAdornment position="start">{startAdornment}</InputAdornment>
            ) : null,
            endAdornment: endAdornment ? (
              <InputAdornment position="end">{endAdornment}</InputAdornment>
            ) : null,
          }}
          {...(field || {})}
          onChange={(e) => {
            if (handleChange) handleChange(e);
            if (field?.onChange) field.onChange(e);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              padding: "0",
              "& input, & textarea": {
                padding: "12px", // Ensures both input and textarea get padding
              },
              "& fieldset": {
                borderColor: error ? "#f87171" : "#d1d5db",
              },
              "&:hover fieldset": {
                borderColor: error ? "#f87171" : "#d1d5db",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#242E4C",
              },
            },
            "& .MuiInputBase-root": {
              borderRadius: "0.5rem",
              backgroundColor: "#ffffff",
              transition: "box-shadow 0.2s",
              boxShadow: error
                ? "0 0 0 2px rgba(248, 113, 113, 0.5)"
                : "0 0 0 2px rgba(36, 46, 76, 0)",
              "&.Mui-focused": {
                boxShadow: error
                  ? "0 0 0 2px rgba(248, 113, 113, 0.5)"
                  : "0 0 0 2px rgba(36, 46, 76, 0.4)",
              },
            },
            width: "100%",
            ...sx,
          }}
          {...props}
        >
          {children}
        </TextField>
      </div>
    );
  }
);

export default CustomTextField;
