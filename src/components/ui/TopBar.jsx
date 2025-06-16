import React from "react";
import { CiExport } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiFilter } from "react-icons/fi";

const TopBar = ({
  title = "",
  detail = "",
  buttonText = "",
  onButtonClick,
  showExport = false,
  showFilter = false,
  icon = null, // <-- Optional icon prop
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 h-fit">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl text-[#444444]">{icon}</span>}
          <span className="text-2xl font-bold text-[#444444]">{title}</span>
        </div>
        <div className="flex items-start">
          {/* empty span to align with icon if present */}
          {icon && <span className="w-[1.25rem] mr-2" />}
          <p className="text-base ml-3 text-[#979797]">{detail}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showExport && (
          <div className="flex items-center border-[0.5px] border-[#CDC9C9] rounded-lg p-2 bg-[#FFFFFF] gap-x-2 whitespace-nowrap">
            <CiExport className="text-[#979797]" />
            <p className="text-[#979797]">Export</p>
            <IoMdArrowDropdown className="text-[#979797] border-[0.5px] border-[#979797] rounded-full" />
          </div>
        )}

        {showFilter && (
          <div className="flex items-center border-[0.5px] border-[#CDC9C9] rounded-lg p-2 bg-[#FFFFFF] gap-x-2 whitespace-nowrap">
            <FiFilter className="text-[#979797]" />
            <p className="text-[#979797]">Filter</p>
            <IoMdArrowDropdown className="text-[#979797] border-[0.5px] border-[#979797] rounded-full" />
          </div>
        )}

        {buttonText && (
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg w-fit"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
