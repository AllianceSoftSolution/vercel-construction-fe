import { useState, useEffect, useRef } from "react";

const GrayDropdownButton = ({ mainButtonText, dropdownItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (onClick) => {
    setIsOpen(false);
    if (onClick) onClick(); // Call the provided onClick function
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div>
        <button
          className="inline-flex justify-between w-full rounded-md border bg-[#BDBDBD80] border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:ring-indigo-500"
          type="button"
          onClick={toggleDropdown}
        >
          <span className="font-bold">{mainButtonText}</span>

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
        <div className="absolute right-0 z-10 mt-2 w-[100%] rounded-md shadow-lg bg-[#BDBDBD80] ring-1 ring-black ring-opacity-5">
          <ul
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {dropdownItems.map((item, index) => (
              <li key={index}>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                  onClick={() => handleOptionClick(item.onClick)}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GrayDropdownButton;
