import React, { useState, isValidElement, cloneElement } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import clsx from "clsx";

const DropdownButton = ({
  children,
  items = [],
  className = "",
  buttonProps = {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isCustomElement = isValidElement(children);

  return (
    <div>
      {isCustomElement ? (
        cloneElement(children, {
          onClick: handleClick,
          ...buttonProps,
        })
      ) : (
        <button
          onClick={handleClick}
          className={clsx(
            "px-6 py-2 rounded-full transition-all text-white bg-black hover:bg-gray-800",
            className
          )}
          {...buttonProps}
        >
          {children}
        </button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          disablePadding: true,
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            mt: 1,
            overflow: "hidden",
            minWidth: "200px",
            bgcolor: "#fff",
          },
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick?.(item.label);
              handleClose();
            }}
            sx={{
              px: 1.5,
              py: 1.2,
              borderBottom:
                index < items.length - 1 ? "1px solid #eee" : "none",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ color: "#333" }}>{item.icon}</ListItemIcon>
            )}
            <ListItemText
              primary={
                typeof item.label === "function" ? item.label() : item.label
              }
              primaryTypographyProps={{
                fontSize: 15,
                fontWeight: 500,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownButton;
