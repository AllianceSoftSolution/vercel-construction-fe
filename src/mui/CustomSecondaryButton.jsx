import { Button } from "@mui/material";
import React from "react";

const CustomSecondaryButton = ({ children, ...props }) => {
  return (
    <button
      className="border border-[#A2A2A2] px-8 py-2 rounded-lg text-[#747474]"
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomSecondaryButton;
