import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "../../../assets/construction/loginLogo.png";
import CustomTextField from "../../../mui/CustomTextField";
import { CiGlobe } from "react-icons/ci";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
// import { MenuItem } from "@mui/material";  // Not used now
// import CustomSelect from "../../../mui/CustomSelect"; // Not used now
import { useDispatch } from "react-redux";
import { login } from "../../../redux/authSlice";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import usePushNotification from "../../../hooks/usePushNotification";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const {
    token: fcmToken,
    permission,
    error: pushError,
  } = usePushNotification(); // Uses env VAPID key

  const handleLogin = async () => {
    const loadingToast = toast.loading("Logging in...");

    try {
      const result = await apiClient.post(`/auth/login`, { email, password });

      if (!result.ok) {
        throw new Error("Invalid credentials or server error");
      }

      const { token, user } = result.data;

      dispatch(
        login({
          token,
          isLoggedIn: true,
          user,
        })
      );

      // Register device token with backend if available
      if (fcmToken && permission === "granted") {
        try {
          await apiClient.post("/auth/device-token", {
            token: fcmToken,
            platform: "web",
          });
        } catch (err) {
          // Optionally show a warning toast
          toast.error("Failed to register device for notifications");
        }
      }

      toast.success("Logged In Successfully", { id: loadingToast });

      const role = user?.role?.toUpperCase();

      switch (role) {
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "PROJECT_MANAGER":
          navigate("/project-manager-dashboard");
          break;
        case "SITE_INCHARGE":
          navigate("/siteincharge-dashboard");
          break;
        case "CONSTRUCTION_MANAGER":
          navigate("/construction-manager-dashboard");
          break;
        case "STORE_INCHARGE":
          navigate("/store-incharge-dashboard");
          break;
        case "ACCOUNTANT":
          navigate("/accountant-dashboard");
          break;
        default:
          navigate("/default-path");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row justify-center items-center overflow-hidden max-h-full">
        {/* Left Section - Logo */}
        <div className="w-full lg:w-1/2 h-[300px] lg:h-full flex bg-primary justify-center items-center rounded-tr-[100px] lg:rounded-tr-[200px]">
          <img
            src={loginLogo}
            alt="loginLogo"
            className="w-40 h-40 lg:w-80 lg:h-80"
          />
        </div>

        {/* Right Section - Form */}
        <div className="text-black w-full lg:w-1/2 h-full flex flex-col gap-y-4 justify-center items-center px-4 py-6">
          <div className="flex flex-col gap-y-1 justify-center items-center">
            <h2 className="text-[30px] lg:text-[40px] mt-12 font-semibold">
              Welcome Back
            </h2>
            <p className="text-[14px] lg:text-[15px] text-center max-w-[500px]">
              Construction Management System The system will automate the
              process of managing all Businesses, bookings, and
              check-ins/check-outs across multiple booking channels such as
              businesses needs.
            </p>
          </div>

          <div className="rounded-xl w-full max-w-[500px] flex flex-col gap-y-4 p-4">
            <CustomTextField
              label={
                <span className="flex items-center gap-1">Enter Email</span>
              }
              fullWidth
              name="email"
              placeholder="Enter Your Work Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CustomTextField
              label={
                <span className="flex items-center gap-1">Enter Password</span>
              }
              fullWidth
              name="password"
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* DROPDOWN REMOVED AS PER YOUR INSTRUCTIONS */}

            <div className="bg-primary text-white flex justify-center items-center font-semibold text-[16px] rounded-xl">
              <button className="py-2 px-4" onClick={handleLogin}>
                Login
              </button>
            </div>

            <div className="flex justify-between flex-wrap gap-y-2">
              <div className="flex items-center gap-x-2">
                <input type="checkbox" />
                <span className="text-[14px] font-medium">
                  Log in automatically
                </span>
              </div>
              <div>
                <span className="text-[14px] font-medium text-[#BF1017]">
                  Forgot Password?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-primary p-4 flex flex-col lg:flex-row justify-center items-center gap-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-[1100px] px-4">
          <div className="flex text-black font-light gap-x-4 text-[13px] text-center flex-wrap justify-center lg:justify-start">
            <p>© 2025 Design and Develope by Construction</p>
            <p>Terms of Service</p>
            <p>Privacy and Cookies Policy</p>
          </div>
          <div className="flex gap-x-3 mt-2 lg:mt-0">
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
