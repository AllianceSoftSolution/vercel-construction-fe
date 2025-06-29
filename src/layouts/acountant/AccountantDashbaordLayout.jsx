import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import { MdSpaceDashboard, MdViewSidebar } from "react-icons/md";
import { IoMdNotifications, IoMdSettings } from "react-icons/io";
import { IoStorefrontSharp } from "react-icons/io5";
import { FaBars, FaSearch } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import SideBarItem from "@/components/ui/SideBarItem";
import logo from "../../assets/construction/logo.png";
import { FaSearch } from "react-icons/fa";
import Profile from "../../assets/construction/profile.png";
import { FaBoxesStacked } from "react-icons/fa6";

const AccountantDashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1080);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sideBarItems = [
    {
      label: "Dashboard",
      icon: MdSpaceDashboard,
      path: "/accountant-dashboard",
    },
    {
      label: "Project Management",
      icon: FaBoxesStacked,
      path: "/accountant-dashboard/project-management",
    },
    {
      label: "Payables",
      icon: IoStorefrontSharp,
      path: "/accountant-dashboard/payables",
    },
  ];

  return (
    <div className="flex h-screen bg-[#FFFFFF] overflow-hidden relative">
      {!sidebarOpen && isDesktop && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 bg-white shadow p-2 rounded-full lg:block hidden"
        >
          <FaBars className="text-gray-700" />
        </button>
      )}

      <div
        className={`${
          sidebarOpen ? "w-[250px] lg:w-[250px]" : "w-0"
        } bg-[#F7F7F7] transition-all duration-300 ease-in-out fixed top-0 left-0 z-20 h-screen overflow-hidden`}
      >
        <div className="flex flex-col h-full items-center justify-between">
          <div className="w-full flex justify-end p-3">
            {sidebarOpen && !isDesktop && (
              <Close
                onClick={() => setSidebarOpen(false)}
                className="cursor-pointer text-gray-700"
              />
            )}
          </div>

          {sidebarOpen && (
            <div className="mb-4">
              <img src={logo} alt="Logo" className="w-28 lg:w-32 mx-auto" />
            </div>
          )}

          {sidebarOpen && (
            <div className="flex flex-col h-full w-full">
              <ul className="flex-1 overflow-y-auto space-y-2 px-6 mt-4">
                {sideBarItems.map((item, index) => (
                  <SideBarItem
                    key={index}
                    onClick={() => {
                      navigate(item.path);
                      if (!isDesktop) setSidebarOpen(false);
                    }}
                    iconSrc={<item.icon size={20} />}
                    text={item.label}
                    // isActive={
                    //   item.path === "/accountant-dashboard"
                    //     ? location.pathname === "/accountant-dashboard"
                    //     : location.pathname === item.path
                    // }
                    isActive={
                      item.path === "/accountant-dashboard"
                        ? location.pathname === "/accountant-dashboard"
                        : location.pathname.startsWith(item.path)
                    }
                    bgColor="primary"
                    textColor="black"
                  />
                ))}
              </ul>
              <div className="border-t border-gray-300 px-6 py-6">
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-[#222222] text-white rounded-[10px] py-3"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen && isDesktop ? "ml-[240px]" : "ml-0"
        } flex flex-col overflow-y-auto h-screen`}
      >
        <div className="w-full flex justify-between items-center border-b px-4 md:px-8 py-3 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {!sidebarOpen && !isDesktop && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-700"
              >
                <FaBars className="w-5 h-5" />
              </button>
            )}
            <img src={logo} alt="Logo" className="w-20 h-14 object-contain" />
            <span className="text-[#444444] text-2xl md:text-3xl font-semibold">
              RADC
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2.5 pl-5 pr-12 rounded-full bg-gray-200 text-gray-700 placeholder-gray-400 outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2.5 rounded-full cursor-pointer">
                <FaSearch className="text-sm" />
              </div>
            </div>

            <div className="flex gap-3">
              <IoMdNotifications className="w-9 h-9 rounded-full border border-gray-300 text-gray-400 p-1.5" />
              <IoMdSettings className="w-9 h-9 rounded-full border border-gray-300 text-gray-400 p-1.5" />
            </div>

            <div className="flex flex-col items-end">
              <p className="font-semibold text-black whitespace-nowrap">
                John Doe
              </p>
              <p className="text-[#7A7A7A] text-sm">SITEINCHARGE</p>
            </div>

            <div className="flex items-center">
              <img
                src={Profile}
                alt="Profile Icon"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-xl text-gray-700"
            >
              <FaBars />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden flex flex-col gap-3 px-4 pb-4 border-b bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2.5 pl-5 pr-12 rounded-full bg-gray-200 text-gray-700 placeholder-gray-400 outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full cursor-pointer">
                <FaSearch className="text-sm" />
              </div>
            </div>

            <div className="flex gap-3">
              <IoMdNotifications className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 p-1.5" />
              <IoMdSettings className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 p-1.5" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="font-semibold text-black">John Doe</p>
                <p className="text-[#7A7A7A] text-sm">SITEINCHARGE</p>
              </div>
              <img
                src={Profile}
                alt="Profile Icon"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex-1 w-full overflow-y-auto p-4 md:p-8">
          <div className="p-4 flex flex-col overflow-y-auto overflow-x-hidden h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboardLayout;
