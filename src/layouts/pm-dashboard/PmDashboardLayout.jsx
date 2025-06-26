import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, Close } from "@mui/icons-material"; // MUI icons
import { useMediaQuery, useTheme } from "@mui/material";
import SideBarItem from "@/components/ui/SideBarItem";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaToolbox } from "react-icons/fa";
import { IoStorefrontSharp, IoPeopleSharp } from "react-icons/io5";
import { FaDiceD6 } from "react-icons/fa";
import logo from "../../assets/construction/logo.png";
import { FaSearch } from "react-icons/fa";
import Profile from "../../assets/construction/profile.png";
import { IoMdNotifications, IoMdSettings } from "react-icons/io";

const PmDashboardLayout = ({ role }) => {
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
      path: "/project-manager-dashboard",
    },
    {
      label: "User Management",
      icon: FaUserTie,
      path: "/project-manager-dashboard/user-management",
    },
    {
      label: "Project Management",
      icon: FaBoxesStacked,
      path: "/project-manager-dashboard/project-management",
    },
    {
      label: "Demands",
      icon: FaHandHoldingHeart,
      path: "/project-manager-dashboard/demands",
    },
    {
      label: "POs",
      icon: FaToolbox,
      path: "/project-manager-dashboard/pos",
    },
    {
      label: "Store",
      icon: IoStorefrontSharp,
      path: "/project-manager-dashboard/store",
    },
    {
      label: "Materials",
      icon: FaDiceD6,
      path: "/project-manager-dashboard/materials",
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
          <div
            className={`flex $${
              sidebarOpen ? "justify-end" : "justify-center"
            } justify-end items-end`}
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
              <div
                className={`${
                  !sidebarOpen ? "hidden" : ""
                } flex flex-col items-center`}
              ></div>
            </div>
          </div>

          <div className="flex-grow w-full mt-4 overflow-y-auto max-h-[calc(100vh-150px)]">
            <ul className="space-y-2 px-6">
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
                    item.path === "/project-manager-dashboard"
                      ? location.pathname === "/project-manager-dashboard"
                      : location.pathname === item.path
                  }
                  bgColor="primary"
                  textColor="black"
                />
              ))}
            </ul>
            <div className="mt-6 border-t border-gray-300"></div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => navigate("/")}
                className="text-white bg-[#222222] rounded-[10px] mt-10 px-5 py-3 flex items-center justify-center w-[80%]"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 ml-0 lg:ml-[240px] flex flex-col overflow-y-auto h-screen">
        <div className="w-full flex justify-between items-center border-b px-8 py-3 ">
          <div className="flex items-center ">
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

        <div className="flex-1 w-full overflow-y-auto p-8">
          <div className="p-4 flex flex-col overflow-y-auto overflow-x-hidden h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PmDashboardLayout;
