import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, Close } from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import SideBarItem from "@/components/ui/SideBarItem";
import { MdSpaceDashboard } from "react-icons/md";
import { IoStorefrontSharp } from "react-icons/io5";
import logo from "../../assets/construction/logo.png";
import { FaSearch, FaBoxesStacked } from "react-icons/fa";
import Profile from "../../assets/construction/profile.png";
import { IoMdNotifications, IoMdSettings } from "react-icons/io";
import { FaBoxesStacked } from "react-icons/fa6";

const AccountantDashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [isDesktop]);

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
    <div className="flex h-screen bg-[#FFFFFF] overflow-hidden">
      <div
        className={`${
          sidebarOpen || isDesktop ? "w-[200px] lg:w-[240px] h-screen" : "w-0"
        } bg-[#F7F7F7] transition-all duration-300 ease-in-out fixed top-0 left-0 z-10`}
      >
        <div className="flex flex-col h-full md:items-center md:justify-between">
          {/* Logo and toggle */}
          <div
            className={`flex ${
              sidebarOpen ? "justify-end" : "justify-center"
            } items-end`}
          >
            {sidebarOpen ? (
              <li
                onClick={() => setSidebarOpen(false)}
                className="text-black text-right py-3 flex items-center justify-center"
              >
                <Close className="mr-2" />
              </li>
            ) : (
              <li
                onClick={() => setSidebarOpen(true)}
                className="text-white text-center py-4 flex items-center justify-center"
              ></li>
            )}
          </div>

          <div className="w-[50%]">
            <div className="flex-col items-center justify-center">
              <div className="w-full flex items-center justify-center gap-x-4">
                <img src={logo} alt="Logo" className="w-32 lg:w-40" />
              </div>
            </div>
          </div>

          
          <div className="flex flex-col h-full w-full">
            {/* Scrollable menu */}
            <ul className="flex-1 overflow-y-auto space-y-2 px-6 mt-4">
              {sideBarItems.map((item, index) => (
                <SideBarItem
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  iconSrc={<item.icon size={20} />}
                  text={item.label}
                  isActive={
                    item.path === "/accountant-dashboard"
                      ? location.pathname === "/accountant-dashboard"
                      : location.pathname === item.path
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-[240px] flex flex-col overflow-y-auto h-screen">
        <div className="w-full flex justify-between items-center border-b px-8 py-3">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-24 h-16" />
            <span className="text-[#444444] text-3xl font-semibold">RADC</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-3 pl-6 pr-12 rounded-full bg-gray-200 text-gray-700 placeholder-gray-400 outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full cursor-pointer">
                <FaSearch className="text-sm" />
              </div>
            </div>
            <div className="flex gap-x-3">
              <IoMdNotifications className="w-10 h-10 rounded-full border-[0.5px] border-gray-300 text-gray-300 p-1" />
              <IoMdSettings className="w-10 h-10 rounded-full border-[0.5px] border-gray-300 text-gray-300 p-1" />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-black whitespace-nowrap">
                John Doe
              </p>
              <p className="text-[#7A7A7A] text-sm text-right">SITEINCHARGE</p>
            </div>
            <div className="flex items-center">
              <img src={Profile} alt="Profile Icon" className="w-28" />
            </div>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 w-full overflow-y-auto p-8">
          <div className="p-4 flex flex-col overflow-y-auto overflow-x-hidden h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboardLayout;
