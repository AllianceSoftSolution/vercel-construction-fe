import React, { useState } from "react";
import { Link } from "react-router-dom";
import navLogo from "@/assets/nursing/nav-logo.png";
import { ArrowDropDownSharp, Menu, Close } from "@mui/icons-material";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const menuItems = [
        {
            text: "Nursing",
            type: "drop-down",
            options: [
                { text: "NCLEX Prep", link: "/nursing/nclex" },
                { text: "Study Guides", link: "/nursing/guides" },
            ],
        },
        {
            text: "USMILE",
            type: "drop-down",
            options: [
                { text: "Courses", link: "/usmile/courses" },
                { text: "Resources", link: "/usmile/resources" },
            ],
        },
        {
            text: "For Educators",
            type: "drop-down",
            options: [
                { text: "Teaching Materials", link: "/educators/materials" },
                { text: "Workshops", link: "/educators/workshops" },
            ],
        },
        { text: "Social Learning", type: "simple-btn", link: "/social-learning" },
        { text: "Testimonials", type: "simple-btn", link: "/testimonials" },
        { text: "Blogs", type: "simple-btn", link: "/blogs" },
        { text: "Contact Us", type: "simple-btn", link: "/contact" },
    ];

    return (
        <header className="w-full px-6 py-4 bg-white ">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img src={navLogo} alt="Logo" className="w-10 h-10" />
                    <div className="text-center">
                        <p className="font-bold text-lg sm:text-xl">NURSE INSIGHTS</p>
                        <p className="text-[10px] text-gray-500 -mt-1">WHERE SUCCESS BEGINS</p>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex space-x-6 relative">
                    {menuItems.map((el, index) => (
                        <div key={index} className="relative">
                            {el.type === "drop-down" ? (
                                <div
                                    className="flex items-center text-gray-800 cursor-pointer hover:text-blue-600"
                                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                                >
                                    <span>{el.text}</span>
                                    <ArrowDropDownSharp />
                                </div>
                            ) : (
                                <Link to={el.link} className="text-gray-800 hover:text-blue-600">
                                    {el.text}
                                </Link>
                            )}

                            {/* Dropdown Menu */}
                            {el.type === "drop-down" && openDropdown === index && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md">
                                    {el.options.map((option, i) => (
                                        <Link
                                            key={i}
                                            to={option.link}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            {option.text}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Mobile Menu Toggle Button */}
                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <Close fontSize="large" /> : <Menu fontSize="large" />}
                </button>

                {/* Desktop Buttons */}
                <div className="hidden lg:flex gap-x-3">
                    <Link to="/auth/login">
                        <button className="px-6 py-2 bg-[#031957] text-white rounded-3xl hover:bg-[#021244]">
                            Login
                        </button>
                    </Link>
                    <Link to="/auth/signup">
                        <button className="px-5 py-2 bg-[#FF6C12] text-white rounded-3xl hover:bg-[#D95910]">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="lg:hidden mt-4 bg-white shadow-lg rounded-lg p-4">
                    {menuItems.map((el, index) => (
                        <div key={index} className="py-2 border-b">
                            {el.type === "drop-down" ? (
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                                >
                                    <span>{el.text}</span>
                                    <ArrowDropDownSharp />
                                </div>
                            ) : (
                                <Link to={el.link} className="block text-gray-800 hover:text-blue-600">
                                    {el.text}
                                </Link>
                            )}
                            {el.type === "drop-down" && openDropdown === index && (
                                <div className="mt-2 pl-4">
                                    {el.options.map((option, i) => (
                                        <Link key={i} to={option.link} className="block text-gray-700 py-1 hover:text-blue-600">
                                            {option.text}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="mt-4 flex flex-col gap-y-2">
                        <Link to="/auth/login">
                            <button className="w-full py-2 bg-[#031957] text-white rounded-2xl  hover:bg-[#021244]">
                                Login
                            </button>
                        </Link>
                        <Link to="/auth/signup">
                            <button className="w-full py-2 bg-[#FF6C12] text-white rounded-2xl hover:bg-[#D95910]">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
