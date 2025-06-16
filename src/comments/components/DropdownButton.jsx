import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";

const DropdownButton = ({ children, items }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        disableElevation
        className="bg-[#0074BD] px-8 py-2 text-white"
        sx={{ borderRadius: "999px" }}
      >
        {children}
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          p: 0,
          "& .MuiMenu-list": {
            p: 0,
          },
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
            sx={{
              bgcolor: "#f5f5f5",
            }}
          >
            {typeof item.label === "string" ? item.label : item.label()}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownButton;
