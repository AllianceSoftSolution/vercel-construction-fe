import React, { useState, useRef, useEffect } from "react";
import { FiFilter } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import ExportToExcelButton from "../ExportToExcelButton";

const CustomFilterDropdown = ({
  filters = [],
  selected = {},
  onChange,
  onClear,
  placeholder = "Filter",
  dropdownAlign = "right",
  exportData = [],
  exportColumns = [],
  exportFileName = "export",
  exportCellComponents = {},
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

  // Helper to check if an option is selected
  const isOptionSelected = (group, option) => {
    if (!selected[group]) return false;
    if (typeof option === "string") {
      return selected[group].includes(option);
    } else if (typeof option === "object" && option.label && option.value) {
      return selected[group].some(
        (sel) => sel.label === option.label && sel.value === option.value
      );
    }
    return false;
  };

  // Helper to render options (supports one level of nesting)
  const renderOptions = (group, options) => {
    return options.map((option, idx) => {
      if (typeof option === "string") {
        const checked = isOptionSelected(group, option);
        return (
          <label
            key={option}
            className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
          >
            <span
              className={`w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center ${
                checked ? "bg-orange-500" : "bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  let newSelected = { ...selected };
                  if (!newSelected[group]) newSelected[group] = [];
                  let wasChecked = checked;
                  if (checked) {
                    newSelected[group] = newSelected[group].filter((v) => v !== option);
                  } else {
                    newSelected[group] = [...newSelected[group], option];
                  }
                  onChange && onChange(newSelected);
                  if (!wasChecked) setOpen(false); // Only close if adding
                }}
                className="opacity-0 w-0 h-0"
              />
              {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
            </span>
            <span className="text-sm font-medium text-gray-800">{option}</span>
          </label>
        );
      } else if (typeof option === "object" && option.options) {
        // Nested options
        return (
          <div key={option.label} className="mb-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-600">
              {option.label}
            </div>
            <div className="pl-4">
              {option.options.map((nested, nidx) => {
                const checked = isOptionSelected(group, { label: option.label, value: nested });
                return (
                  <label
                    key={nested}
                    className="flex items-center gap-3 px-4 py-2 mb-1 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
                  >
                    <span
                      className={`w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center ${
                        checked ? "bg-orange-500" : "bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          let newSelected = { ...selected };
                          if (!newSelected[group]) newSelected[group] = [];
                          let wasChecked = checked;
                          if (checked) {
                            newSelected[group] = newSelected[group].filter(
                              (v) =>
                                !(v.label === option.label && v.value === nested)
                            );
                          } else {
                            newSelected[group] = [
                              ...newSelected[group],
                              { label: option.label, value: nested },
                            ];
                          }
                          onChange && onChange(newSelected);
                          if (!wasChecked) setOpen(false); // Only close if adding
                        }}
                        className="opacity-0 w-0 h-0"
                      />
                      {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {nested}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  // Button label logic: show chips for all selected options
  let selectedLabels = [];
  filters.forEach((filter) => {
    const group = filter.label;
    if (selected[group] && selected[group].length > 0) {
      selected[group].forEach((val) => {
        if (typeof val === "string") {
          selectedLabels.push({ group, label: val });
        } else if (typeof val === "object" && val.label && val.value) {
          selectedLabels.push({ group, label: `${val.label} > ${val.value}` });
        }
      });
    }
  });

  return (
    <div className="flex flex-row items-center gap-2 flex-shrink-0">
    <div className="relative" ref={filterRef}>
      <div
        className="flex items-center border-[0.5px] border-[#CDC9C9] rounded-lg p-2 bg-[#FFFFFF] gap-x-2 whitespace-nowrap cursor-pointer min-w-[120px] w-fit"
        onClick={toggleFilter}
      >
        {/* <FiFilter className="text-[#979797]" /> */}
        <div className="flex flex-wrap gap-1 items-center">
          {selectedLabels.length === 0 ? (
            <span className="text-[#979797]">{placeholder}</span>
          ) : (
            selectedLabels.map((item, idx) => (
              <span
                key={item.group + item.label + idx}
                className="bg-orange-100 text-orange-700 rounded px-2 py-0.5 text-xs flex items-center gap-1"
              >
                {item.group}: {item.label}
                <IoMdClose
                  className="ml-1 cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    // Remove this selection only
                    let newSelected = { ...selected };
                    newSelected[item.group] = newSelected[item.group].filter(
                      (v) => {
                        if (typeof v === "string") return v !== item.label;
                        if (typeof v === "object")
                          return `${v.label} > ${v.value}` !== item.label;
                        return true;
                      }
                    );
                    onChange && onChange(newSelected);
                  }}
                  size={14}
                />
              </span>
            ))
          )}
        </div>
        <IoMdArrowDropdown className="text-[#979797] border-[0.5px] border-[#979797] rounded-full ml-2" />
      </div>
      {open && (
        <div
          className={`absolute top-12 ${dropdownAlign === "left" ? "left-0" : "right-0"} bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10 w-80 max-h-[400px] overflow-y-auto`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800">Filters</h3>
            <button onClick={() => setOpen(false)}>
              <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ✕
              </div>
            </button>
          </div>
          <div className="h-[1px] bg-gray-200 mb-4" />
          {filters.length === 0 ? (
            <p className="text-sm text-gray-500">No filters available</p>
          ) : (
            filters.map((filter, idx) => (
              <div key={filter.label} className="mb-4">
                <div className="text-xs font-bold text-gray-700 mb-2 pl-2">
                  {filter.label}
                </div>
                {renderOptions(filter.label, filter.options)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
    {exportColumns.length > 0 && (
      <ExportToExcelButton
        data={exportData}
        columns={exportColumns}
        fileName={exportFileName}
        cellComponents={exportCellComponents}
      />
    )}
    </div>
  );
};

export default CustomFilterDropdown; 