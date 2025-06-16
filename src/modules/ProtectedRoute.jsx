import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ProtectedRoute component
const ProtectedRoute = ({ allowedUserTypes, children }) => {
  const {userType, isLoggedIn} = useSelector((state) => state.auth); 
  console.log(userType, isLoggedIn)

  if ( !isLoggedIn || userType !== "AD") {
    return <Navigate to="/" replace />;
  }

  // if (!allowedUserTypes.includes(userType)) {
  //   // If not authorized, you can redirect to a "Not Authorized" page or another dashboard
  //   return <Navigate to="/not-authorized" replace />;
  // }

  // If authorized, render the child components (the protected route)
  return children;
};

export default ProtectedRoute;
