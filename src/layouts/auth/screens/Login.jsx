import React from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "../../../assets/construction/loginLogo.png";
import CustomTextField from "../../../mui/CustomTextField";
import { CiGlobe } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();
  return (
    // main div
    <div className="h-screen w-full bg-white flex flex-col">
      {/* content */}
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        {/* image */}
        <div className="h-full w-[50%] flex bg-primary justify-center items-center rounded-tr-[200px]">
          <img src={loginLogo} alt="loginLogo" className="w-80 h-80" />
        </div>
        {/* form */}
        <div className="text-black w-[50%] h-full flex flex-col gap-y-4 justify-center items-center overflow-y-auto">
          {/* heading */}
          <div className="flex flex-col gap-y-1 justify-center items-center px-4">
            <h2 className="text-[40px] font-semibold">Welcome Back </h2>
            <p className="text-[15px] w-[70%] text-center">
              Construction Management System The system will automate the
              process of managing all Businesses, bookings, and
              check-ins/check-outs across multiple booking channels such as
              businesses needs.
            </p>
          </div>
          {/* form */}
          <div className="rounded-xl w-[80%] flex flex-col gap-y-4 p-6">
            <CustomTextField
              label={
                <span className="flex items-center gap-1">Enter Email</span>
              }
              fullWidth
              name="Email"
              placeholder="Enter Your Work Email"
            />
            <CustomTextField
              label={
                <span className="flex items-center gap-1">Enter Password</span>
              }
              fullWidth
              name="Password"
              placeholder="Enter Your Password"
            />
            {/* button */}
            <div className="bg-primary text-white flex justify-center items-center font-semibold text-[16px] rounded-xl">
              <button
                className="py-2 px-4"
                onClick={() => {
                  navigate("/admin-dashboard");
                }}
              >
                Login
              </button>
            </div>
            {/* forget password */}
            <div className="flex justify-between">
              <div className="flex items-center gap-x-2">
                <input type="checkbox" />
                <span className="text-[15px] font-medium">
                  Log in automatically{" "}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-[15px] font-medium text-[#BF1017]">
                  Forgot Password?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer div */}
      <footer className="w-full bg-primary p-4 flex justify-center items-center">
        <div className="flex w-[80%] justify-between items-center">
          {/* content */}
          <div className="flex text-black font-light gap-x-6 text-[13px]">
            <p>© 2025 Design and Develope by Construction</p>
            <p>Terms of Service</p>
            <p>Privacy and Cookies Policy</p>
          </div>
          {/* links */}
          <div className="flex gap-x-4">
            <CiGlobe className="bg-white w-6 h-6 p-1 rounded-lg" />
            <FaFacebookF className="bg-white w-6 h-6 p-1 rounded-lg" />
            <FaLinkedinIn className="bg-white w-6 h-6 p-1 rounded-lg" />
            <FaSquareXTwitter className="bg-white w-6 h-6 p-1 rounded-lg" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
