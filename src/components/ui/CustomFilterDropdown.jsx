import React, { useState, useRef, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

const CustomFilterDropdown = ({
  options = [],
  value = "",
  onChange,
  label = "Select Filter Role",
  placeholder = "Filter",
  dropdownAlign = "right",
}) => {
  const [open, setOpen] = useState(false);
  const filterRef = useRef(null);

  const toggleFilter = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={filterRef}>
      <div
        className="flex items-center border-[0.5px] border-[#CDC9C9] rounded-lg p-2 bg-[#FFFFFF] gap-x-2 whitespace-nowrap cursor-pointer min-w-[120px] w-fit"
        onClick={toggleFilter}
      >
        <FiFilter className="text-[#979797]" />
        <p className="text-[#979797]">{placeholder}</p>
        <IoMdArrowDropdown className="text-[#979797] border-[0.5px] border-[#979797] rounded-full" />
      </div>
      {open && (
        <div
          className={`absolute top-12 ${dropdownAlign === "left" ? "left-0" : "right-0"} bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10 w-80 max-h-[400px] overflow-y-auto`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800">{label}</h3>
            <button onClick={() => setOpen(false)}>
              <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ✕
              </div>
            </button>
          </div>
          <div className="h-[1px] bg-gray-200 mb-4" />
          {options.length === 0 ? (
            <p className="text-sm text-gray-500">No filters available</p>
          ) : (
            options.map((option, index) => {
              const isChecked = value === option;
              return (
                <label
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
                >
                  <span
                    className={`w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center ${
                      isChecked ? "bg-orange-500" : "bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="filterOption"
                      checked={isChecked}
                      onChange={() => onChange(option)}
                      className="opacity-0 w-0 h-0"
                    />
                    {isChecked && (
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {option}
                  </span>
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CustomFilterDropdown; 