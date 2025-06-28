import React, { useState, useRef, useEffect } from "react";
import { CiExport } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Button from "../Button";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

const TopBar = ({
  title = "",
  detail = "",
  buttonText = "",
  onButtonClick,
  showExport = false,
  showFilter = false,
  filterOptions = [],
  showIcon = false, // ✅ Back Icon toggle
}) => {
  const navigate = useNavigate(); // ✅ Create navigate instance
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState("");
  const filterRef = useRef(null);

  const toggleFilter = () => setFilterOpen((prev) => !prev);

  const handleCheckboxChange = (option) => {
    setSelectedFilters(option);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 h-fit">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {/* ✅ Back icon with click handler */}
          {showIcon && (
            <IoArrowBackCircleOutline
              className="text-2xl text-[#444444] cursor-pointer"
              onClick={() => navigate(-1)} // ✅ Go back
            />
          )}
          <span className="text-2xl font-bold text-[#444444]">{title}</span>
        </div>
        <div className="flex items-start">
          <p className="text-base  text-[#979797]">{detail}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        {showExport && (
          <div className="flex items-center border-[0.5px] border-[#CDC9C9] rounded-lg p-2 bg-[#FFFFFF] gap-x-2 whitespace-nowrap">
            <CiExport className="text-[#979797]" />
            <p className="text-[#979797]">Export</p>
            <IoMdArrowDropdown className="text-[#979797] border-[0.5px] border-[#979797] rounded-full" />
          </div>
        )}

        {showFilter && (
          <div className="relative" ref={filterRef}>
            <div
              className="flex items-center border-[0.5px] border-[#CDC9C9] rounded-lg p-2 bg-[#FFFFFF] gap-x-2 whitespace-nowrap cursor-pointer"
              onClick={toggleFilter}
            >
              <FiFilter className="text-[#979797]" />
              <p className="text-[#979797]">Filter</p>
              <IoMdArrowDropdown className="text-[#979797] border-[0.5px] border-[#979797] rounded-full" />
            </div>

            {filterOpen && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10 w-80 max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-800">
                    Select Filter Role
                  </h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      ✕
                    </div>
                  </button>
                </div>
                <div className="h-[1px] bg-gray-200 mb-4" />

                {filterOptions.length === 0 ? (
                  <p className="text-sm text-gray-500">No filters available</p>
                ) : (
                  filterOptions.map((option, index) => {
                    const isChecked = selectedFilters === option;

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
                            onChange={() => handleCheckboxChange(option)}
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
        )}

        {buttonText && (
          <Button buttonText={buttonText} onClick={onButtonClick} />
        )}
      </div>
    </div>
  );
};

export default TopBar;
