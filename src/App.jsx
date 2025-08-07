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
import ResetPassword from "./layouts/auth/screens/ResetPassword";
import LandingPageLayout from "./layouts/landing-pages/LandingPageLayout";
import PageNotFound from "@/components/NotFound";
// admin dashboard
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
import DemandDetailPage from "./layouts/admin-dashboard/screens/Projects/DemandDetails";
import PurchaseOrderDetailPage from "./layouts/admin-dashboard/screens/Projects/PurchaseOrderDetailPage";
import StoreDetail from "./layouts/admin-dashboard/screens/Projects/StoreDetail";
import AddVendor from "./layouts/admin-dashboard/screens/Forms/AddVendor";
import SectionTab from "./layouts/admin-dashboard/screens/Projects/tabs/SectionTab";
import SectionDetailPage from "./layouts/admin-dashboard/screens/Projects/SectionDetailPage";
import VendorDetailPage from "./layouts/admin-dashboard/screens/Projects/VendorDetailPage";
import Payables from "./layouts/admin-dashboard/screens/Payables";
import PayableDetails from "./layouts/admin-dashboard/screens/Projects/PayableDetail";
// site incharge
import SiteInchargeDashboardLayout from "./layouts/siteIncharge-dashboard/SiteInchargeDashboardLayout";
import SiteInchargeDashbaord from "./layouts/siteIncharge-dashboard/components/SinteInchargeDashbaord";
import SInchargeProjectManagement from "./layouts/siteIncharge-dashboard/components/SInchargeProjectManagement";
import SInchargeUserManagement from "./layouts/siteIncharge-dashboard/components/SInchargeUserManagement";
import SInchargeSectionTab from "./layouts/siteIncharge-dashboard/components/Projects/tabs/SInchargeSectionTab";
import SiAddProject from "./layouts/siteIncharge-dashboard/components/Forms/SiAddProject";
import SinMemberDetailPage from "./layouts/siteIncharge-dashboard/components/Projects/SinMemberDetailPage";
import SiDemands from "./layouts/siteIncharge-dashboard/components/Demands";
// pm dashboard
import PmProjectDetailPage from "./layouts/pm-dashboard/component/Projects/PmProjectDetailPage";
import PmDemandDetails from "./layouts/pm-dashboard/component/Projects/PmDemandDetailPage";
import PmAddUser from "./layouts/pm-dashboard/component/Forms/PmAddUser";
import PmAddStore from "./layouts/pm-dashboard/component/Forms/PmAddStore";
import PmStoreDetail from "./layouts/pm-dashboard/component/Projects/PmStoreDetail";
import PmMaterials from "./layouts/pm-dashboard/component/PmMaterials";
import PmAddProduct from "./layouts/pm-dashboard/component/Forms/PmAddProduct";
import PmUserManagement from "./layouts/pm-dashboard/component/PmUserManagement";
import PmProjectManagement from "./layouts/pm-dashboard/component/PmProjectManagement";
import PmAddProject from "./layouts/pm-dashboard/component/Forms/PmAddProject";
import PmStores from "./layouts/pm-dashboard/component/PmStore";
import PmDashboardLayout from "./layouts/pm-dashboard/PmDashboardLayout";
import PmDashboard from "./layouts/pm-dashboard/component/PmDashboard";
import PmMemberDetailPage from "./layouts/pm-dashboard/component/Projects/PmMemberDetailPage";
import PmDemands from "./layouts/pm-dashboard/component/PmDemands";
// cm dashboard
import CmDashboardLayout from "./layouts/cm-dashboard/CmDashboardLayout";
import CmDashboard from "./layouts/cm-dashboard/components/CmDashboard";
import CmProjectManagement from "./layouts/cm-dashboard/components/CmProjectManagement";
import CmAddProject from "./layouts/cm-dashboard/components/Forms/CmAddProject";
import CmProjectDetailPage from "./layouts/cm-dashboard/components/Projects/CmProjectDetailPage";
import CmUserManagement from "./layouts/cm-dashboard/components/CmUserManagement";
import CmMaterials from "./layouts/cm-dashboard/components/CmMaterials";
import CmAddProduct from "./layouts/cm-dashboard/components/Forms/CmAddProduct";
import CmStoreDetail from "./layouts/cm-dashboard/components/Projects/CmStoreDetail";
import CmAddStore from "./layouts/cm-dashboard/components/Forms/CmAddStore";
import CmStores from "./layouts/cm-dashboard/components/CmStore";
import CmDemands from "./layouts/cm-dashboard/components/CmDemands";
import CmSectionTab from "./layouts/cm-dashboard/components/Projects/tabs/CmSectionTab";
import CmDemandDetails from "./layouts/cm-dashboard/components/Projects/CmDemandDetailPage";
import CmDemandDetailPage from "./layouts/cm-dashboard/components/Projects/CmDemandDetailPage";
import CmMemberDetailPage from "./layouts/cm-dashboard/components/Projects/CmMemberDetailPage";
import CmAddDemand from "./layouts/cm-dashboard/components/Forms/CmAddDemand";
import CmPOs from "./layouts/cm-dashboard/components/CmPOs";
// store Incharge

import SiPurchaseOrderDetailPage from "./layouts/storeIncharge-dashboard/components/Projects/SiPurchaseOrderDetailPage";
import SiStore from "./layouts/storeIncharge-dashboard/components/SiStore";
import SiAddStore from "./layouts/storeIncharge-dashboard/components/Forms/SiAddStore";
import SiStoreDetail from "./layouts/storeIncharge-dashboard/components/Projects/SiStoreDetail";
import SiProjectManagement from "./layouts/storeIncharge-dashboard/components/SiProjectManagement";
import StoreInchargeDashboardLayout from "./layouts/storeIncharge-dashboard/StoreInchargeDashboardLayout";
import StoreInchargeDashboard from "./layouts/storeIncharge-dashboard/components/StoreInchargeDashboard";
// accountant
import AcPayables from "./layouts/acountant/components/AcPayables";
import AcPayableDetails from "./layouts/acountant/components/Projects/AcPayableDetail";
import AcProjectDetailPage from "./layouts/acountant/components/Projects/AcProjectDetailPage";
import AcProjectManagement from "./layouts/acountant/components/AcProjectManagement";

import AccountantDashboardLayout from "./layouts/acountant/AccountantDashbaordLayout";
import AccountantDashboard from "./layouts/acountant/components/AccountantDashboard";
import SiteProjectDetailPage from "./layouts/siteIncharge-dashboard/components/Projects/SiteProjectDetailPage";
import CmSectionDetailPage from "./layouts/cm-dashboard/components/Projects/CmSectionDetailPage";
import CmPurchaseOrderDetail from "./layouts/cm-dashboard/components/Projects/CmPurchaseOrderDetailPage";
import PmSectionDetailPage from "./layouts/admin-dashboard/screens/Projects/SectionDetailPage";
import PmPOs from "./layouts/pm-dashboard/component/PmPOs";
import PmPurchaseOrderDetailPage from "./layouts/pm-dashboard/component/Projects/PmPurchaseOrderDetailPage";
import SiSectionDetailPage from "./layouts/siteIncharge-dashboard/components/Projects/SiSectionDetailPage";
import SiDemandDetails from "./layouts/siteIncharge-dashboard/components/Projects/SiDemandDetailPage";
import SiPOs from "./layouts/siteIncharge-dashboard/components/SiPOs";
import SinPurchaseOrderDetailPage from "./layouts/siteIncharge-dashboard/components/Projects/SinPurchaseOrderDetailPage";
import SinStores from "./layouts/siteIncharge-dashboard/components/SinStore";
import SinStoreDetail from "./layouts/siteIncharge-dashboard/components/Projects/SinStoreDetail";
import SinAddStore from "./layouts/siteIncharge-dashboard/components/Forms/SinAddStore";
import CreateSectionProject from "./layouts/admin-dashboard/screens/Forms/CreateSectionProject";
import CreateSection from "./layouts/siteIncharge-dashboard/components/Forms/CreateSection";
import SiPos from "./layouts/storeIncharge-dashboard/components/SiPos";
import DemandDetails from "./layouts/admin-dashboard/screens/Projects/DemandDetails";
import ResetOtp from "./layouts/auth/screens/ResetOtp";
import NewPassword from "./layouts/auth/screens/NewPassword";
import AcDemands from "./layouts/acountant/components/AcDemands";
import AcDemandDetail from "./layouts/acountant/components/Projects/AcDemandDetail";

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
      { path: "reset-password", element: <ResetPassword /> },
      { path: "verify-otp", element: <ResetOtp /> },
      { path: "new-password/:token", element: <NewPassword /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
];

const adminRoutes = [
  {
    path: "admin-dashboard",
    element: <AdminDashboardLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "user-Management", element: <UserManagement /> },
      { path: "user-Management/addUser", element: <AddUser /> },
      { path: "user-Management/:id", element: <MemberDetailPage /> },
      { path: "project-management", element: <ProjectManagement /> },
      { path: "project-management/addProject", element: <AddProject /> },
      {
        path: "project-management/createProject",
        element: <CreateSectionProject />,
      },
      { path: "project-management/:id", element: <ProjectDetailPage /> },
      { path: "project-management/sections", element: <SectionTab /> },
      {
        path: "project-management/sections/:id",
        element: <SectionDetailPage />,
      },

      { path: "demands", element: <Demands /> },
      { path: "demands/:id", element: <DemandDetails /> },
      { path: "pOS", element: <POs /> },
      { path: "pOS/:id", element: <PurchaseOrderDetailPage /> },
      { path: "store", element: <Store /> },
      { path: "store/addStore", element: <AddStore /> },
      { path: "store/:id", element: <StoreDetail /> },
      { path: "materials", element: <Materials /> },
      { path: "materials/addProduct", element: <AddProduct /> },
      { path: "payables", element: <Payables /> },
      { path: "payables/details/:id", element: <PayableDetails /> },
      { path: "vendors", element: <Vendors /> },
      { path: "vendors/addVendor", element: <AddVendor /> },
      { path: "vendors/:id", element: <VendorDetailPage /> },
    ],
  },
];

const siteInchargeRoutes = [
  {
    path: "siteincharge-dashboard",
    element: <SiteInchargeDashboardLayout />,
    children: [
      { path: "", element: <SiteInchargeDashbaord /> },
      { path: "user-Management", element: <SInchargeUserManagement /> },
      { path: "user-Management/addUser", element: <AddUser /> },
      { path: "user-Management/:id", element: <SinMemberDetailPage /> },
      { path: "project-Management", element: <SInchargeProjectManagement /> },
      { path: "project-Management/addProject", element: <SiAddProject /> },
      { path: "project-Management/createSection", element: <CreateSection /> },
      { path: "project-Management/:id", element: <SiteProjectDetailPage /> },
      { path: "project-management/sections", element: <SInchargeSectionTab /> },
      {
        path: "project-management/sections/:id",
        element: <SiSectionDetailPage />,
      },

      { path: "demands", element: <SiDemands /> },
      { path: "demands/:id", element: <SiDemandDetails /> },
      { path: "pOS", element: <SiPOs /> },
      { path: "pOS/:id", element: <SinPurchaseOrderDetailPage /> },
      { path: "store", element: <SinStores /> },
      { path: "store/addStore", element: <SinAddStore /> },
      { path: "store/:id", element: <SinStoreDetail /> },
    ],
  },
];

const projectManagerRoutes = [
  {
    path: "project-manager-dashboard",
    element: <PmDashboardLayout />,
    children: [
      { path: "", element: <PmDashboard /> },
      { path: "user-Management", element: <PmUserManagement /> },
      { path: "user-Management/addUser", element: <PmAddUser /> },
      { path: "user-Management/:id", element: <PmMemberDetailPage /> },
      { path: "project-Management", element: <PmProjectManagement /> },
      { path: "project-Management/addProject", element: <PmAddProject /> },
      { path: "project-Management/:id", element: <PmProjectDetailPage /> },
      { path: "project-management/sections", element: <SectionTab /> },
      {
        path: "project-management/sections/:id",
        element: <PmSectionDetailPage />,
      },

      { path: "demands", element: <PmDemands /> },
      { path: "demands/:id", element: <PmDemandDetails /> },
      { path: "pOS", element: <PmPOs /> },
      { path: "pOS/:id", element: <PmPurchaseOrderDetailPage /> },
      { path: "store", element: <PmStores /> },
      { path: "store/addStore", element: <PmAddStore /> },
      { path: "store/:id", element: <PmStoreDetail /> },
    ],
  },
];
const constructionManagerRoutes = [
  {
    path: "construction-manager-dashboard",
    element: <CmDashboardLayout />,
    children: [
      { path: "", element: <CmDashboard /> },
      { path: "user-Management", element: <CmUserManagement /> },
      { path: "user-Management/addUser", element: <AddUser /> },
      { path: "user-Management/:id", element: <CmMemberDetailPage /> },
      { path: "project-Management", element: <CmProjectManagement /> },
      { path: "project-Management/addProject", element: <CmAddProject /> },
      { path: "project-Management/:id", element: <CmProjectDetailPage /> },
      { path: "sections", element: <CmSectionTab /> },
      { path: "sections/:id", element: <CmSectionDetailPage /> },

      { path: "demands", element: <CmDemands /> },
      { path: "demands/addDemand", element: <CmAddDemand /> },
      { path: "demands/:id", element: <CmDemandDetailPage /> },
      { path: "pOS", element: <CmPOs /> },
      { path: "pOS/:id", element: <CmPurchaseOrderDetail /> },
      { path: "store", element: <CmStores /> },
      { path: "store/addStore", element: <CmAddStore /> },
      { path: "store/:id", element: <CmStoreDetail /> },
    ],
  },
];
const storeInchargeRoutes = [
  {
    path: "store-incharge-dashboard",
    element: <StoreInchargeDashboardLayout />,
    children: [
      { path: "", element: <StoreInchargeDashboard /> },
      { path: "pOS", element: <SiPos /> },
      { path: "pOS/:id", element: <SiPurchaseOrderDetailPage /> },
      { path: "store", element: <SiStore /> },
      { path: "store/addStore", element: <SiAddStore /> },
      { path: "store/:id", element: <SiStoreDetail /> },
    ],
  },
];
const accountantRoutes = [
  {
    path: "accountant-dashboard",
    element: <AccountantDashboardLayout />,
    children: [
      { path: "", element: <AccountantDashboard /> },
      { path: "project-Management", element: <AcProjectManagement /> },
      { path: "project-Management/addProject", element: <SiAddProject /> },
      { path: "project-Management/:id", element: <AcProjectDetailPage /> },
      { path: "sections", element: <SectionTab /> },
      { path: "sections/:id", element: <SectionDetailPage /> },
      { path: "payables", element: <AcPayables /> },
      { path: "payables/details/:id", element: <AcPayableDetails /> },
      { path: "demands", element: <AcDemands /> },
      { path: "demands/:id", element: <AcDemandDetail /> },
    ],
  },
];
const getRoutesByRole = (role) => {
  switch (role) {
    case "ADMIN":
      return [...commonRoutes, ...adminRoutes];
    case "PROJECT_MANAGER":
      return [...commonRoutes, ...projectManagerRoutes];
    case "SITE_INCHARGE":
      return [...commonRoutes, ...siteInchargeRoutes];
    case "CONSTRUCTION_MANAGER":
      return [...commonRoutes, ...constructionManagerRoutes];
    case "ACCOUNTANT":
      return [...commonRoutes, ...accountantRoutes];
    case "STORE_INCHARGE":
      return [...commonRoutes, ...storeInchargeRoutes];
    default:
      // return commonRoutes;
      return [...commonRoutes];
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
