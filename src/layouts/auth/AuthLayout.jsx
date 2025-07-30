import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Login from "./screens/Login";
import loginLogo from "../../assets/construction/loginLogo.png";
import { CiGlobe } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function AuthLayout() {
  const location = useLocation();
  //   const isSignup = location.pathname === "/auth/signup";

  return (
    <div className="h-screen w-full bg-white flex flex-col max-h-[1026px]">
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Section - Fixed Logo */}
        <div className="w-full lg:w-1/2 h-[120px] sm:h-[140px] lg:h-full flex bg-primary justify-center items-center rounded-tr-[40px] sm:rounded-tr-[60px] lg:rounded-tr-[200px] lg:fixed lg:left-0 lg:top-0 lg:bottom-0">
          <img
            src={loginLogo}
            alt="loginLogo"
            className="w-16 h-16 sm:w-24 sm:h-24 lg:w-80 lg:h-80"
          />
        </div>

        {/* Right Section - Flexible Outlet */}
        <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col justify-center items-center px-2 sm:px-3 lg:px-8 py-1 sm:py-2 lg:py-8 min-h-0 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer - Fixed */}
      <footer className="w-full bg-primary p-1 sm:p-1.5 lg:p-4 flex flex-col lg:flex-row justify-center items-center gap-y-1 lg:gap-y-0 lg:fixed lg:bottom-0 lg:left-0 lg:right-0">
        <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-[1100px] px-2 lg:px-4">
          <div className="flex text-black font-light gap-x-1 sm:gap-x-2 lg:gap-x-4 text-[8px] sm:text-[10px] lg:text-[13px] text-center flex-wrap justify-center lg:justify-start">
            <p>© 2025 Designed and developed by alliance software solutions</p>
            <p>Terms of Service</p>
            <p>Privacy and Cookies Policy</p>
          </div>
          <div className="flex gap-x-1 sm:gap-x-1.5 lg:gap-x-3 mt-0.5 lg:mt-0">
            <CiGlobe className="bg-white w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-6 lg:h-6 p-0.5 lg:p-1 rounded-lg" />
            <FaFacebookF className="bg-white w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-6 lg:h-6 p-0.5 lg:p-1 rounded-lg" />
            <FaLinkedinIn className="bg-white w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-6 lg:h-6 p-0.5 lg:p-1 rounded-lg" />
            <FaXTwitter className="bg-white w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-6 lg:h-6 p-0.5 lg:p-1 rounded-lg" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
