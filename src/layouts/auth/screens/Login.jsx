import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "../../../assets/construction/loginLogo.png";
import CustomTextField from "../../../mui/CustomTextField";
import { CiGlobe } from "react-icons/ci";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
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
        case "SUPER_ADMIN":
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "SUB_ADMIN":
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
    <div className="w-full flex flex-col  justify-center items-center">
      <div className="flex flex-col gap-y-1 justify-center items-center">
        <h2 className="text-[30px] lg:text-[40px] font-semibold">
          Welcome Back
        </h2>
        <p className="text-[14px] lg:text-[15px] text-center max-w-[500px]">
          Construction Management System streamlines project planning, resource allocation, 
          material tracking, and team coordination to enhance efficiency and productivity 
          across all construction operations.
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
            <span className="text-[14px] font-medium text-[#BF1017] cursor-pointer" onClick={() => navigate("/auth/reset-password")}>
              Forgot Password?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
