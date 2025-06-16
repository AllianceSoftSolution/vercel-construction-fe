import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Login from "./screens/Login";

function AuthLayout() {
  const location = useLocation();
  //   const isSignup = location.pathname === "/auth/signup";

  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      <Login />
    </div>
  );
}

export default AuthLayout;
