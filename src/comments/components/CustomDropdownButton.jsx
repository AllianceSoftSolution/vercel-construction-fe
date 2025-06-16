import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const CustomDropdownButton = ({ children, actions = [], className }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    action.onClick();
    handleClose();
  };

  return (
    <div className={className}>
      {/* Main Button */}
      <button onClick={handleClick} className="cursor-pointer">
        {children}
      </button>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {actions.map((action, index) => (
          <MenuItem key={index} onClick={() => handleMenuItemClick(action)}>
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default CustomDropdownButton;
