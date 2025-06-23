import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";

// ************************** ADMIN DASHBOARD *******************************************
import AdminDashboardLayout from "./layouts/admin-dashboard/AdminDashboardLayout";
import AdminDashboard from "./layouts/admin-dashboard/screens/AdminDashboard";

// ************************** LandingPages **************************
import AuthLayout from "./layouts/auth/AuthLayout";
import Login from "./layouts/auth/screens/Login";
import Signup from "./layouts/auth/screens/Signup";
import ForgetPassword from "./layouts/auth/screens/ForgetPassword";
import LandingPageLayout from "./layouts/landing-pages/LandingPageLayout";
import PageNotFound from "@/components/NotFound";
import UserManagement from "./layouts/admin-dashboard/screens/UserManagement";
import ProjectManagement from "./layouts/admin-dashboard/screens/ProjectManagement";
import Demands from "./layouts/admin-dashboard/screens/Demands";
import POs from "./layouts/admin-dashboard/screens/POs";
import Store from "./layouts/admin-dashboard/screens/Store";
import Materials from "./layouts/admin-dashboard/screens/Materials";
import Accounts from "./layouts/admin-dashboard/screens/Payables";
import Vendors from "./layouts/admin-dashboard/screens/Vendors";
import AddUser from "./layouts/admin-dashboard/screens/Forms/AddUser";
import AddProduct from "./layouts/admin-dashboard/screens/Forms/AddProduct";
import AddStore from "./layouts/admin-dashboard/screens/Forms/AddStore";
import AddProject from "./layouts/admin-dashboard/screens/Forms/AddProject";
import ProjectDetailPage from "./layouts/admin-dashboard/screens/Projects/ProjectDetailPage";
import MemberDetailPage from "./layouts/admin-dashboard/screens/Projects/MemberDetailPage";
import DemandDetailPage from "./layouts/admin-dashboard/screens/Projects/DemandDetailPage";
import PurchaseOrderDetailPage from "./layouts/admin-dashboard/screens/Projects/PurchaseOrderDetailPage";
import StoreDetail from "./layouts/admin-dashboard/screens/Projects/StoreDetail";
import AddVendor from "./layouts/admin-dashboard/screens/Forms/AddVendor";
import SectionTab from "./layouts/admin-dashboard/screens/Projects/tabs/SectionTab";
import SectionDetailPage from "./layouts/admin-dashboard/screens/Projects/SectionDetailPage";
import VendorDetailPage from "./layouts/admin-dashboard/screens/Projects/VendorDetailPage";
import Payables from "./layouts/admin-dashboard/screens/Payables";
import PayableDetails from "./layouts/admin-dashboard/screens/Projects/PayableDetail";

const theme = createTheme({
  typography: {
    fontFamily: "'DM Sans', sans-serif",
  },
});

const commonRoutes = [
  { path: "/", element: <LandingPageLayout /> },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "login/admin-dashboard", element: <AdminDashboard /> },
      { path: "signup", element: <Signup /> },
      { path: "forget-password", element: <ForgetPassword /> },
      // { path: "reset-password/:token", element: <ResetPassword /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
];

const adminRoutes = [
  {
    path: "admin-dashboard",
    element: <AdminDashboardLayout />,
    children: [
      { path: "", element: <AdminDashboard /> }, // Default child (Dashboard)
      { path: "user-Management", element: <UserManagement /> },
      { path: "user-Management/addUser", element: <AddUser /> },
      { path: "user-Management/:id", element: <MemberDetailPage /> },
      { path: "project-Management", element: <ProjectManagement /> },
      { path: "project-Management/addProject", element: <AddProject /> },
      { path: "project-Management/:id", element: <ProjectDetailPage /> },
      { path: "sections", element: <SectionTab /> },
      { path: "sections/:id", element: <SectionDetailPage /> },
    
      { path: "demands", element: <Demands /> },
      { path: "demands/:id", element: <DemandDetailPage /> },
      { path: "pOS", element: <POs /> },
      { path: "pOS/:id", element: <PurchaseOrderDetailPage /> },
      { path: "store", element: <Store /> },
      { path: "store/addStore", element: <AddStore /> },
      { path: "store/:id", element: <StoreDetail /> },
      { path: "materials", element: <Materials /> },
      { path: "materials/addProduct", element: <AddProduct /> },
      { path: "payables", element: <Payables /> },
      { path: "payables/details", element: <PayableDetails /> },
      { path: "vendors", element: <Vendors /> },
      { path: "vendors/addVendor", element: <AddVendor /> },
      { path: "vendors/:id", element: <VendorDetailPage /> },
    ],
  },
];

const getRoutesByRole = (role) => {
  switch (role) {
    case "ADM":
      return [...commonRoutes, ...adminRoutes];
    // case "USR":
    //   return [...commonRoutes, ...studentRoutes];
    default:
      // return commonRoutes;
      return [...commonRoutes, ...adminRoutes];
  }
};

const App = () => {
  // alert(role )
  const role = useSelector((state) => state?.auth?.user?.role);

  // const role = 'AD';
  const routes = getRoutesByRole(role || "");
  const router = createBrowserRouter(routes);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
