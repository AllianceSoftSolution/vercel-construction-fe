import React from "react";
import { Select, InputAdornment, MenuItem } from "@mui/material";
import clsx from "clsx";

const CustomSelect = React.forwardRef(
  (
    {
      label,
      placeholder,
      handleChange,
      children,
      sx,
      name,
      field,
      className,
      startAdornment,
      endAdornment,
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx("flex flex-col gap-y-1", className)}>
        <p>{label}</p>
        <Select
          inputRef={ref}
          variant="outlined"
          size="small"
          name={name}
          displayEmpty
          startAdornment={
            startAdornment ? (
              <InputAdornment position="start">{startAdornment}</InputAdornment>
            ) : null
          }
          endAdornment={
            endAdornment ? (
              <InputAdornment position="end">{endAdornment}</InputAdornment>
            ) : null
          }
          {...(field || {})}
          onChange={(e) => {
            if (handleChange) {
              handleChange(e);
            }
            if (field?.onChange) {
              field.onChange(e);
            }
          }}
          sx={{
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#c1c5cc", // Normal border color
              },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#c1c5cc", // Normal border color
              },
              "&:hover fieldset": {
                borderColor: "#c1c5cc", // Hover border color
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#c1c5cc", // Focused border color
              },

              "&.Mui-disabled": {
                backgroundColor: "#f5f5f5",
                color: "#a0a0a0",
                "& fieldset": {
                  borderColor: "#e0e0e0", // Disabled border color
                },
              },
            },
            "& .MuiSelect-select": {
              color: "#84919d", // Text color inside the select
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#c1c5cc", // Focused border color
              },
            },

            width: "100%",
            ...sx,
          }}
          {...props}
        >
          {children && children}
        </Select>
      </div>
    );
  }
);

export default CustomSelect;
