import React, { useState } from 'react';

const Dropdown = ({
  options,
  defaultLabel = "Status",
  onSelect,
  renderOption,
  buttonClassName = "",
  dropdownClassName = "",
  optionClassName = "",
  buttonText,
  btnColor='#BDBDBD80',
  dropdownStyle = {},
  buttonStyle = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultLabel);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(renderOption ? renderOption(option) : String(option));
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          className={`inline-flex justify-between w-full rounded-md border bg-[${btnColor}] bg-blue-400 border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:ring-indigo-500 ${buttonClassName}`}
          style={buttonStyle}
          type="button"
          onClick={toggleDropdown}
        >
          <span className="font-bold">{buttonText || selectedOption}</span>
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06 0L10 10.64l3.71-3.43a.75.75 0 111.04 1.08l-4.25 3.9a.75.75 0 01-1.04 0l-4.25-3.9a.75.75 0 010-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className={`absolute right-0 z-10 mt-2 w-full rounded-md shadow-lg bg-[white] ring-1 ring-black ring-opacity-5 ${dropdownClassName}`}
          style={dropdownStyle}
        >
          <ul
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option, index) => (
              <li key={index}>
                <button
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${optionClassName}`}
                  role="menuitem"
                  onClick={() => handleOptionClick(option)}
                >
                  {renderOption ? renderOption(option) : String(option)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
