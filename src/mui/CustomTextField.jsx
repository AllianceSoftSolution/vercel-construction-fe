import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import clsx from "clsx";

const CustomTextField = React.forwardRef(
  (
    {
      label,
      labelColor = "text-gray-700",
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
        <TextField
          inputRef={ref}
          type={rows === "" ? type : undefined}
          variant="outlined"
          multiline={rows !== ""}
          rows={rows === "" ? undefined : rows}
          size="small"
          name={name}
          className={clsx("rounded-lg", classInput)}
          placeholder="" // we’ll add custom placeholder manually
          error={!!error}
          helperText={error ? helperText : subLabel || ""}
          InputProps={{
            startAdornment: startAdornment ? (
              <InputAdornment position="start">{startAdornment}</InputAdornment>
            ) : null,
            endAdornment: endAdornment ? (
              <InputAdornment position="end">{endAdornment}</InputAdornment>
            ) : null,
            inputComponent: ({ inputRef, ...inputProps }) => (
              <div className="w-full h-full px-3 pt-3 pb-2 flex flex-col justify-start">
                <label className="text-sm text-gray-500 font-medium">
                  {label}{" "}
                  {props.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  ref={inputRef}
                  {...inputProps}
                  className="outline-none border-none text-gray-800 placeholder-gray-400 text-base bg-transparent mt-1"
                  placeholder={placeholder}
                />
              </div>
            ),
          }}
          {...(field || {})}
          onChange={(e) => {
            if (handleChange) handleChange(e);
            if (field?.onChange) field.onChange(e);
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              padding: 0,
              alignItems: "flex-start",
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
        />
      </div>
    );
  }
);

export default CustomTextField;
