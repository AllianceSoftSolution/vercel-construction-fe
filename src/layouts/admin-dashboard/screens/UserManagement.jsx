import React, { useState } from "react";
import TopBar from "@/components/ui/TopBar";
import CustomCardComponent from "../../../mui/CustomCardComponent";
import {
  FaBan,
  FaBoxesStacked,
  FaEye,
  FaHandHoldingHeart,
  FaToolbox,
  FaTrash,
} from "react-icons/fa6";
import { IoPersonCircle, IoStorefrontSharp } from "react-icons/io5";
import CustomTable from "../../../mui/CustomTable";
import { useNavigate, useParams } from "react-router-dom";
import { BsProjector, BsThreeDotsVertical } from "react-icons/bs";
import ActionModal from "../../admin-dashboard/screens/users/modals/ActionModal";
import SimpleTable from "../../../components/SimpleTable";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import { FaPeopleLine } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IconButton } from "@mui/material";
import { MdOutlineNoAccounts } from "react-icons/md";
import DropdownButton from "../../../comments/components/DropdownButton";
import {
  ManageSearchRounded,
  Person,
  Person2,
  Person2Outlined,
  Person3,
} from "@mui/icons-material";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import { useReadOnly } from "../../../context/ReadOnlyContext";
import { useSelector } from "react-redux";
import {
  filterHiddenPrivilegedUsers,
  getCreatorDisplayName,
  isPrivilegedSuperAdmin,
  isPrivilegedSuperAdminEmail,
} from "../../../utils/privilegedAdmin";

const UserManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isReadOnly = useReadOnly();
  const authUser = useSelector((state) => state.auth?.user);
  const isPrivileged = isPrivilegedSuperAdmin(authUser);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState({
    totalUsers: 0,
    roleBreakdown: {},
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ Role: [] });

  // Role filter options
  const roleOptions = [
    { label: "Admin", value: "ADMIN" },
    { label: "Site Incharge", value: "SITE_INCHARGE" },
    { label: "Construction Manager", value: "CONSTRUCTION_MANAGER" },
    { label: "Store Incharge", value: "STORE_INCHARGE" },
    { label: "Accountant", value: "ACCOUNTANT" },
    { label: "Project Manager", value: "PROJECT_MANAGER" },
  ];

  // Fetch users with optional role filter
  const getAllUsers = async () => {
    try {
      setLoading(true);
      let url = "/auth/users";
      if (filter.Role && filter.Role.length > 0) {
        const roleBackend = filter.Role.map(
          (label) => roleOptions.find((o) => o.label === label)?.value
        ).filter(Boolean);
        if (roleBackend.length > 0) {
          url += `?role=${encodeURIComponent(roleBackend.join(","))}`;
        }
      }
      const response = await apiClient.get(url);
      if (response.ok) {
        // Adjust mapping as needed based on API response structure
        const data =
          response.data.users?.map((user, index) => ({
            ...user,
            iD: user.id || index + 1,
          })) || [];
        setUsers(filterHiddenPrivilegedUsers(data, authUser));

        // Set analytics data from API response
        if (response.data.userAnalytics) {
          setUserAnalytics({
            totalUsers: response.data.userAnalytics.totalUsers || 0,
            roleBreakdown: response.data.userAnalytics.roleBreakdown || {},
          });
        }
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, [filter]);

  // CustomFilterDropdown config
  const filters = [{ label: "Role", options: roleOptions.map((o) => o.label) }];
  const handleFilterChange = (selection) => {
    setFilter(selection);
  };
  const handleFilterClear = () => setFilter({ Role: [] });
  let selected = null;
  if (filter.Role && filter.Role.length > 0) {
    selected = { group: "Role", value: filter.Role.join(", ") };
  }

  const handleActionClick = () => {
    setShowModal(true);
  };

  // Handle opening role edit modal
  const handleOpenRoleEdit = (user) => {
    // Navigate to AddUser form with user data as query params
    const userData = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        note: user.note,
        isHead: user.isHead || false,
        isEdit: true,
      })
    );
    navigate(`/admin-dashboard/user-management/addUser?userData=${userData}`);
  };

  const handleOpenFullEdit = (user) => {
    const userData = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        note: user.note || user.notes,
        isHead: user.isHead || false,
        isEdit: true,
        isFullEdit: true,
      }),
    );
    navigate(`/admin-dashboard/user-management/addUser?userData=${userData}`);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name || "this user"}? This cannot be undone.`)) {
      return;
    }
    try {
      const response = await apiClient.delete(`/auth/users/${user.id}`);
      if (response.ok) {
        toast.success("User deleted successfully");
        getAllUsers();
      } else {
        toast.error(response.data?.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to delete user");
    }
  };

  const columns = [
    { headerName: "ID", field: "employeeId" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Role", field: "role" },
    { headerName: "Status", field: "isActive" },
    { headerName: "Created By", field: "creator.name" },
    {
      headerName: "Action",
      field: "id",
    },
  ];

  // Generate analytics cards based on role breakdown data
  const managerAnalytics = [
    {
      label: "Site Incharge",
      icon: FaPeopleLine,
      count: userAnalytics.roleBreakdown.SITE_INCHARGE || 0,
      percentage:
        userAnalytics.totalUsers > 0
          ? Math.round(
              ((userAnalytics.roleBreakdown.SITE_INCHARGE || 0) /
                userAnalytics.totalUsers) *
                100
            )
          : 0,
    },
    {
      label: "Project Manager",
      icon: Person,
      count: userAnalytics.roleBreakdown.PROJECT_MANAGER || 0,
      percentage:
        userAnalytics.totalUsers > 0
          ? Math.round(
              ((userAnalytics.roleBreakdown.PROJECT_MANAGER || 0) /
                userAnalytics.totalUsers) *
                100
            )
          : 0,
    },
    {
      label: "Construction Manager",
      icon: Person3,
      count: userAnalytics.roleBreakdown.CONSTRUCTION_MANAGER || 0,
      percentage:
        userAnalytics.totalUsers > 0
          ? Math.round(
              ((userAnalytics.roleBreakdown.CONSTRUCTION_MANAGER || 0) /
                userAnalytics.totalUsers) *
                100
            )
          : 0,
    },
    {
      label: "Store Incharge",
      icon: IoStorefrontSharp,
      count: userAnalytics.roleBreakdown.STORE_INCHARGE || 0,
      percentage:
        userAnalytics.totalUsers > 0
          ? Math.round(
              ((userAnalytics.roleBreakdown.STORE_INCHARGE || 0) /
                userAnalytics.totalUsers) *
                100
            )
          : 0,
    },
    {
      label: "Accountant",
      icon: Person2,
      count: userAnalytics.roleBreakdown.ACCOUNTANT || 0,
      percentage:
        userAnalytics.totalUsers > 0
          ? Math.round(
              ((userAnalytics.roleBreakdown.ACCOUNTANT || 0) /
                userAnalytics.totalUsers) *
                100
            )
          : 0,
    },
    {
      label: "Admin",
      icon: Person2Outlined,
      count: userAnalytics.roleBreakdown.ADMIN || 0,
      percentage:
        userAnalytics.totalUsers > 0
          ? Math.round(
              ((userAnalytics.roleBreakdown.ADMIN || 0) /
                userAnalytics.totalUsers) *
                100
            )
          : 0,
    },
  ];

  // Function to handle account activation/deactivation
  const handleAccountToggle = async (userId, isActive) => {
    try {
      const endpoint = isActive
        ? `/auth/users/${userId}/deactivate`
        : `/auth/users/${userId}/activate`;
      const response = await apiClient.patch(endpoint);

      if (response.ok) {
        const action = isActive ? "deactivated" : "activated";
        toast.success(`Account ${action} successfully`);
        // Refresh the users list to get updated data
        getAllUsers();
      } else {
        const action = isActive ? "deactivate" : "activate";
        toast.error(`Failed to ${action} account`);
      }
    } catch (error) {
      console.error("Error toggling account status:", error);
      const action = isActive ? "deactivate" : "activate";
      toast.error(`Error trying to ${action} account`);
    }
  };

  const CustomActionComponent = ({ value: id }) => {
    // Find the user data to check their active status
    const user = users.find((u) => u.id === id);
    const isActive = user?.isActive;

    // Hide all actions for the privileged System Admin from other admins
    if (
      user &&
      isPrivilegedSuperAdminEmail(user.email) &&
      !isPrivileged
    ) {
      return <span className="text-xs text-gray-400">—</span>;
    }

    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate(`/admin-dashboard/user-management/${id}`),
            icon: <FaEye />,
          },
          ...(!isReadOnly && isPrivileged
            ? [
                {
                  label: "Edit User",
                  onClick: () => handleOpenFullEdit(user),
                  icon: <FaUserEdit />,
                },
              ]
            : []),
          ...(!isReadOnly ? [
            {
              label: "Change User Role",
              onClick: () => handleOpenRoleEdit(user),
              icon: <FaUserEdit />,
            },
            {
              label: isActive ? "Deactivate Account" : "Activate Account",
              onClick: () => handleAccountToggle(id, isActive),
              icon: isActive ? <FaBan /> : <MdOutlineNoAccounts />,
            },
          ] : []),
          ...(!isReadOnly && isPrivileged
            ? [
                {
                  label: "Delete User",
                  onClick: () => handleDeleteUser(user),
                  icon: <RiDeleteBin5Fill />,
                },
              ]
            : []),
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  // Custom cell renderer for role to display properly formatted
  const RoleCell = ({ value }) => {
    if (!value) return "";

    // Convert to title case and replace underscores with spaces
    const formattedRole = value
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return <span className="text-sm text-black">{formattedRole}</span>;
  };

  const CreatorCell = ({ row }) => (
    <span className="text-sm text-black">
      {getCreatorDisplayName(row?.creator)}
    </span>
  );

  // Custom cell renderer for status to display Active/Inactive
  const StatusCell = ({ value }) => {
    return (
      <span
        className={`text-sm px-2 py-1 rounded-full ${
          value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {value ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className=" h-full ">
      <TopBar
        title="User Management"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        {...(!isReadOnly && {
          buttonText: "Create New User",
          onButtonClick: () => navigate("/admin-dashboard/user-management/addUser"),
        })}
      />
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-2xl font-semibold text-primary">
          Total Users Overview
        </h2>
        <div className="text-lg font-medium text-gray-600">
          Total: {userAnalytics.totalUsers} Users
        </div>
      </div>
      {loading ? (
        <div className="border border-[#CDC9C9] mt-4 rounded-2xl p-2 flex items-center justify-center min-h-[200px]">
          <Loader />
        </div>
      ) : (
        <div className="border border-[#CDC9C9] mt-4 rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {managerAnalytics.map((item, index) => (
            <div
              key={index}
              className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-[#E0E0E0] last:after:hidden "
            >
              <AnalyticsCard
                label={item.label}
                icon={item.icon}
                count={item.count}
                percentage={item.percentage}
              />
            </div>
          ))}
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold mb-4 mt-4">Users</h2>
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={users}
            tableFilters={filters}
            filterSelected={filter}
            onFilterChange={handleFilterChange}
            onFilterClear={handleFilterClear}
            filterPlaceholder="Filter by role"
            exportFileName="users"
            cellComponents={{
              id: CustomActionComponent,
              role: RoleCell,
              isActive: StatusCell,
              "creator.name": CreatorCell,
            }}
          />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl relative">
            <button
              className="absolute top-2 right-3 text-lg font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <ActionModal
              user={{ name: "Jane Doe" }}
              showProfile={true}
              buttonText="Add Note"
              actions={[
                {
                  type: "edit",
                  icon: <FaUserEdit />,
                  label: "Edit",
                  onClick: () => console.log("Edit clicked"),
                },
                {
                  type: "delete",
                  icon: <RiDeleteBin5Fill />,
                  label: "Delete",
                  onClick: () => console.log("Delete clicked"),
                },

                {
                  type: "ban",
                  icon: <IoPersonCircle />,
                  label: "Ban",
                  onClick: () => console.log("Ban clicked"),
                },
                {
                  type: "suspend",
                  icon: <FaBan />,
                  label: "Suspend Account",
                  onClick: () => console.log("Suspend clicked"),
                },
                {
                  type: "note",
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
