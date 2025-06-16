import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Assuming you are using redux for auth

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn ,userType } = useSelector((state) => state.auth); // Get the login status from the redux store
  console.log(isLoggedIn);
  console.log(userType);

  // If the user is not logged in, redirect them to the sign-in page
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // If the user is logged in, render the child components (protected route)
  return children;
};

export default ProtectedRoute;
