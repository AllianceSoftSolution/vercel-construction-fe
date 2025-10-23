import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { useMediaQuery, useTheme, Avatar } from "@mui/material";
import { MdSpaceDashboard, MdViewSidebar } from "react-icons/md";
import { IoMdNotifications, IoMdSettings } from "react-icons/io";
import { IoStorefrontSharp } from "react-icons/io5";
import {
  FaBars,
  FaDiceD6,
  FaHandHoldingHeart,
  FaSearch,
  FaToolbox,
  FaUserTie,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import SideBarItem from "@/components/ui/SideBarItem";
import logo from "../../assets/construction/logo.png";
import Profile from "../../assets/construction/profile.png";
import LogOutModal from "../../mui/LogOutModal";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../redux/authSlice";
import usePushNotification from "../../hooks/usePushNotification";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";
import NotificationsModal from "../../components/ui/modals/NotificationsModal";
import Button from "../../components/Button";
import {
  getNotifications,
  addNotification,
  markAllAsRead,
  markAsRead,
  syncNotificationsFromIndexedDB,
} from "../../utils/notificationStorage";

const ProfileModal = ({
  open,
  onClose,
  anchorEl,
  showChangePasswordModal,
  setShowChangePasswordModal,
  username,
  userType,
}) => {
  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
    onClose(); // Close the profile modal when opening change password modal
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile</h2>

          {/* Profile Image */}
          <div className="mb-3">
            <Avatar sx={{ width: 64, height: 64, bgcolor: "#bdbdbd" }}>
              {username ? username[0] : ""}
            </Avatar>
          </div>

          {/* User Info */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {username || "-"}
            </h3>
            <p className="text-gray-600 text-sm">{userType || "-"}</p>
          </div>

          {/* Change Password Button */}
          <div className="w-full">
            <Button
              buttonText="Change Password"
              onClick={handleChangePassword}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const PmDashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const authToken = useSelector(selectAuthToken);
  const { token: fcmToken } = usePushNotification(); // Uses env VAPID key
  const [notifications, setNotifications] = useState([]);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const username = useSelector((state) => state.auth.username);
  const userType = useSelector((state) => state.auth.userType);

  // Load notifications from localStorage and IndexedDB on mount
  useEffect(() => {
    (async () => {
      const merged = await syncNotificationsFromIndexedDB();
      setNotifications(merged);
    })();
  }, []);

  // Listen for new FCM notifications (foreground)
  const { onMessageListener } = usePushNotification();
  useEffect(() => {
    const unsubscribe = onMessageListener((payload) => {
      const { title, body } = payload.notification || {};
      const id = payload.messageId || Date.now();
      const time = new Date().toISOString();
      const notif = { id, title, body, time, read: false };
      addNotification(notif);
      setNotifications(getNotifications());
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onMessageListener]);

  // Show badge if there are unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Open modal and mark all as read
  const handleOpenNotifModal = () => {
    setNotifModalOpen(true);
    markAllAsRead();
    setNotifications(getNotifications());
  };

  // Mark single notification as read
  const handleMarkRead = (notif) => {
    markAsRead(notif.id);
    setNotifications(getNotifications());
  };

  // Handle password change
  const handlePasswordSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        "/auth/change-password",
        passwordData
      );

      if (response.ok) {
        toast.success("Password changed successfully!");
        setShowChangePasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "" });
      } else {
        toast.error(response.data?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler (not needed for localStorage, but placeholder)
  const handleNotifScroll = () => {};

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      label: "Purchase Orders",
      icon: FaToolbox,
      path: "/project-manager-dashboard/pos",
    },
    {
      label: "Store",
      icon: IoStorefrontSharp,
      path: "/project-manager-dashboard/store",
    },
  ];

  return (
    <div className="flex h-screen bg-[#FFFFFF] overflow-hidden relative">
      {!sidebarOpen && isDesktop && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 bg-white shadow p-2 rounded-full lg:block hidden"
        >
          <FaBars className="text-gray-700" />
        </button>
      )}

      <div
        className={`${
          sidebarOpen ? "w-[250px] lg:w-[250px]" : "w-0"
        } bg-[#F7F7F7] transition-all duration-300 ease-in-out fixed top-0 left-0 z-20 h-screen overflow-hidden`}
      >
        <div className="flex flex-col h-full items-center justify-between">
          <div className="w-full flex justify-end p-3">
            {sidebarOpen && !isDesktop && (
              <Close
                onClick={() => setSidebarOpen(false)}
                className="cursor-pointer text-gray-700"
              />
            )}
          </div>

          {sidebarOpen && (
            <div className="mb-4">
              <img src={logo} alt="Logo" className="w-28 lg:w-32 mx-auto" />
            </div>
          )}

          {sidebarOpen && (
            <div className="flex flex-col h-full w-full">
              <ul className="flex-1 overflow-y-auto space-y-2 px-6 mt-4">
                {sideBarItems.map((item, index) => (
                  <SideBarItem
                    key={index}
                    onClick={() => {
                      navigate(item.path);
                      if (!isDesktop) setSidebarOpen(false);
                    }}
                    iconSrc={<item.icon size={20} />}
                    text={item.label}
                    isActive={
                      item.path === "/project-manager-dashboard"
                        ? location.pathname === "/project-manager-dashboard"
                        : location.pathname.startsWith(item.path)
                    }
                    bgColor="primary"
                    textColor="black"
                  />
                ))}
              </ul>
              <div className="border-t border-gray-300 px-6 py-6">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full bg-[#222222] text-white rounded-[10px] py-3"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen && isDesktop ? "ml-[240px]" : "ml-0"
        } flex flex-col overflow-y-auto h-screen`}
      >
        <div className="w-full flex justify-between items-center border-b px-4 md:px-8 py-3 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {!sidebarOpen && !isDesktop && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-700"
              >
                <FaBars className="w-5 h-5" />
              </button>
            )}
            <img src={logo} alt="Logo" className="w-20 h-14 object-contain" />
            <span className="text-[#444444] text-2xl md:text-3xl font-semibold">
              RADC
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-5">
            {/* <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2.5 pl-5 pr-12 rounded-full bg-gray-200 text-gray-700 placeholder-gray-400 outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2.5 rounded-full cursor-pointer">
                <FaSearch className="text-sm" />
              </div>
            </div> */}

            <div className="flex gap-3">
              <div style={{ position: "relative" }}>
                <IoMdNotifications
                  className="w-9 h-9 rounded-full border border-gray-300 text-gray-400 p-1.5 cursor-pointer"
                  onClick={handleOpenNotifModal}
                />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "#d32f2f",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              {/* <IoMdSettings className="w-9 h-9 rounded-full border border-gray-300 text-gray-400 p-1.5" /> */}
            </div>

            <div className="flex flex-col items-end">
              <p className="font-semibold text-black whitespace-nowrap">
                {username || "-"}
              </p>
              <p className="text-[#7A7A7A] text-sm">{userType || "-"}</p>
            </div>

            <div className="flex items-center">
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  cursor: "pointer",
                  bgcolor: "#bdbdbd",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileModal(!showProfileModal);
                }}
              >
                {username ? username[0] : ""}
              </Avatar>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-xl text-gray-700"
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* {isMenuOpen && (
          <div className="lg:hidden flex flex-col gap-3 px-4 pb-4 border-b bg-white">
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2.5 pl-5 pr-12 rounded-full bg-gray-200 text-gray-700 placeholder-gray-400 outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full cursor-pointer">
                <FaSearch className="text-sm" />
              </div>
            </div> */}

            <div className="flex gap-3">
              <IoMdNotifications className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 p-1.5" />
              {/* <IoMdSettings className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 p-1.5" /> */}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="font-semibold text-black">John Doe</p>
                <p className="text-[#7A7A7A] text-sm">PM</p>
              </div>
              <img
                src={Profile}
                alt="Profile Icon"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          </div>
        )} */}

        <div className="flex-1 w-full overflow-y-auto p-4 md:p-8">
          <div className="p-4 flex flex-col overflow-y-auto overflow-x-hidden h-full">
            <Outlet />
          </div>
        </div>
      </div>

      <LogOutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          // Remove device token from backend if available
          if (fcmToken && authToken) {
            try {
              await apiClient.delete("/auth/device-token", {
                data: { token: fcmToken },
              });
            } catch (err) {
              toast.error("Failed to remove device from notifications");
            }
          }
          localStorage.clear();
          navigate("/");
        }}
      />
      <NotificationsModal
        open={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        notifications={notifications}
        loading={notifLoading}
        onScroll={handleNotifScroll}
        onMarkRead={handleMarkRead}
      />
      <ProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        showChangePasswordModal={showChangePasswordModal}
        setShowChangePasswordModal={setShowChangePasswordModal}
        username={username}
        userType={userType}
      />

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={loading}
                  >
                    {showCurrentPassword ? (
                      <FaEyeSlash size={16} />
                    ) : (
                      <FaEye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={loading}
                  >
                    {showNewPassword ? (
                      <FaEyeSlash size={16} />
                    ) : (
                      <FaEye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "" });
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                buttonText={loading ? "Changing..." : "Change Password"}
                onClick={handlePasswordSubmit}
                className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmDashboardLayout;
