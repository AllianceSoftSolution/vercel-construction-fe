import { ArrowDropDown } from '@mui/icons-material';
import React, { useState } from 'react';

function SideBarDropdown({ icon, name, children, onClick, subListTitle }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleToggle = () => {
        setDropdownOpen(!isDropdownOpen);
        if (onClick) {
            onClick();  // Call the custom onClick handler if provided
        }
    };

    return (
        <div className="relative">
            <div
                className="bg-[#0E4171]  rounded-lg cursor-pointer"
                onClick={handleToggle}
                aria-expanded={isDropdownOpen}
                aria-controls="dropdown-menu"
            >
                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={icon} alt={name} className="h-6 w-6" />
                        <span className="text-white ml-3 font-semibold">{name}</span>
                    </div>
                    <ArrowDropDown
                        className={`text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                </div>
                <div
                    className={`transition-all  duration-300 ease-in-out bg-[#0E4171] p-0 rounded-b-lg ${isDropdownOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}
                    style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
                >
                    <div className='my-2 ml-8'>
                        <ul className='list-disc'>
                            <li className='text-white text-sm font-semibold'>{subListTitle}</li>
                        </ul>
                    </div>
                    <div className="text-white ml-4">

                        <div className="ml-4 border-l-2 border-[#1C588C]">



                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SubListItemOfSidebarDropdown({ label, onClick }) {
    const handleClick = (event) => {
        event.stopPropagation(); // Prevent the click from propagating to the parent dropdown
        if (onClick) {
            onClick(); // Call the custom onClick handler if provided
        }
    };

    return (
        <div
            className="ml-2 mb-3 flex gap-x-2 mr-3 rounded-md py-2 items-center group hover:bg-[#1C588C] transition-colors duration-300"
            onClick={handleClick} // Attach the handleClick function here
        >
            <div className="bg-[#1C588C] relative w-7 border-[#1C588C] border-t-[0.3px] transition-all duration-300 group-hover:bg-white group-hover:border-white">
                <div className="absolute w-2 h-2 bg-[#1C588C] rounded-full right-0 transform -translate-y-1/2 transition-all duration-300 group-hover:bg-white"></div>
            </div>
            <span className="text-sm  text-white/60">{label}</span>
        </div>
    );
}

export default SideBarDropdown;
