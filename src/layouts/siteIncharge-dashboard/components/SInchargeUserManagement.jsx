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
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import ActionModal from "../../admin-dashboard/screens/users/modals/ActionModal";
import SimpleTable from "../../../components/SimpleTable";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import { FaPeopleLine } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IconButton } from "@mui/material";
import DropdownButton from "../../../comments/components/DropdownButton";
import { MdNoAccounts } from "react-icons/md";
import {
  Person,
  Person3,
} from "@mui/icons-material";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";

const SInchargeUserManagement = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ Role: [] });
  const [userAnalytics, setUserAnalytics] = useState({
    totalUsers: 0,
    roleBreakdown: {}
  });

  // Role filter options
  const roleOptions = [
    { label: "Admin", value: "ADMIN" },
    { label: "Site Incharge", value: "SITE_INCHARGE" },
    { label: "Construction Manager", value: "CONSTRUCTION_MANAGER" },
    { label: "Store Incharge", value: "STORE_INCHARGE" },
    { label: "Accountant", value: "ACCOUNTANT" },
    { label: "Project Manager", value: "PROJECT_MANAGER" },
  ];
  const filters = [
    { label: "Role", options: roleOptions.map(o => o.label) },
  ];

  // Fetch users with optional role filter
  const getAllUsers = async () => {
    try {
      setLoading(true);
      let url = "/auth/users";
      if (filter.Role && filter.Role.length > 0) {
        const roleBackend = filter.Role.map(
          label => roleOptions.find(o => o.label === label)?.value
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
        setUsers(data);
        
        // Update analytics with actual data from API
        if (response.data.userAnalytics) {
          setUserAnalytics({
            totalUsers: response.data.userAnalytics.totalUsers || 0,
            roleBreakdown: response.data.userAnalytics.roleBreakdown || {}
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

  const handleFilterChange = (selection) => {
    setFilter(selection);
  };
  const handleFilterClear = () => setFilter({ Role: [] });

  const handleActionClick = () => {
    setShowModal(true);
  };

  const columns = [
    { headerName: "ID", field: "employeeId" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Role", field: "role" },
    // { headerName: "Note", field: "note" },
    { headerName: "Created By", field: "creator.name" },
    {
      headerName: "Action",
      field: "id",
    },
  ];

  // Generate analytics cards based on actual role breakdown
  const generateTeamAnalytics = () => {
    const roleIcons = {
      SITE_INCHARGE: FaPeopleLine,
      PROJECT_MANAGER: Person,
      CONSTRUCTION_MANAGER: Person3,
      STORE_INCHARGE: IoStorefrontSharp,
      ACCOUNTANT: Person,
      ADMIN: Person
    };

    const roleLabels = {
      SITE_INCHARGE: "Site Incharge",
      PROJECT_MANAGER: "Project Manager", 
      CONSTRUCTION_MANAGER: "Construction Manager",
      STORE_INCHARGE: "Store Incharge",
      ACCOUNTANT: "Accountant",
      ADMIN: "Admin"
    };

    return Object.entries(userAnalytics.roleBreakdown).map(([role, count]) => ({
      label: roleLabels[role] || role,
      icon: roleIcons[role] || Person,
      count: count,
      percentage: userAnalytics.totalUsers > 0 ? Math.round((count / userAnalytics.totalUsers) * 100) : 0,
    }));
  };

  // Custom cell renderer for role to display properly formatted
  const RoleCell = ({ value }) => {
    if (!value) return "";
    
    // Convert to title case and replace underscores with spaces
    const formattedRole = value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return (
      <span className="text-sm text-black">
        {formattedRole}
      </span>
    );
  };

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate(`/siteincharge-dashboard/user-management/${id}`),
            icon: <FaEye />,
          },
          // { label: "Edit", onClick: () => alert("Edit"), icon: <FaUserEdit /> },
          // {
          //   label: "Delete ",
          //   onClick: () => alert("Delete"),
          //   icon: <FaTrash />,
          // },
          // {
          //   label: "Ban",
          //   icon: <MdNoAccounts className="w-5 h-5" />,
          // },
          // {
          //   label: "Suspend Account",
          //   icon: <FaBan />,
          // },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const teamAnalytics = generateTeamAnalytics();

  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        title="User Management"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        // buttonText="Create New User"
        // onButtonClick={() =>
        //   navigate("/siteincharge-dashboard/user-management/addUser")
        // }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <h2 className="text-2xl font-semibold text-primary">
        Total Users Overview
      </h2>
      <div className="border border-[#CDC9C9] mt-4 rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {teamAnalytics.map((item, index) => (
          <div
            key={index}
            className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-[#E0E0E0] lg:last:after:hidden"
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
            cellComponents={{ id: CustomActionComponent, role: RoleCell }}
            loading={loading}
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

export default SInchargeUserManagement;
