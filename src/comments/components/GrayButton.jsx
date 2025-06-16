import React from "react";
import { cn } from "../utils/tailwindCN";

const GrayButton = ({ onClick, children, className }) => {
  return (
    <button
      className={cn(
        "inline-flex justify-between rounded-md border bg-[#BDBDBD80] border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:ring-indigo-500 ",
        className
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default GrayButton;
