import React, { useState, useEffect } from "react";
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

const PmUserManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [managerStats, setManagerStats] = useState([]);
  const [filter, setFilter] = useState({ Role: [] });

  // Role filter options (label: UI, value: backend)
  const roleOptions = [
    { label: "admin", value: "ADMIN" },
    { label: "site_incharge", value: "SITE_INCHARGE" },
    { label: "construction_manager", value: "CONSTRUCTION_MANAGER" },
    { label: "store_incharge", value: "STORE_INCHARGE" },
    { label: "accountant", value: "ACCOUNTANT" },
    { label: "project_management", value: "PROJECT_MANAGEMENT" },
  ];

  // Add this mapping at the top, after roleOptions
  const roleLabelMap = {
    ADMIN: "Admin",
    SITE_INCHARGE: "Site Incharge",
    CONSTRUCTION_MANAGER: "Construction Manager",
    STORE_INCHARGE: "Store Incharge",
    ACCOUNTANT: "Accountant",
    PROJECT_MANAGEMENT: "Project Management",
    PROJECT_MANAGER: "Project Manager", // If this role exists in your backend
  };

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
        const usersData = response.data.users || [];
        setUsers(usersData);
        
        // Calculate analytics based on actual user data
        const roleCounts = usersData.reduce((acc, user) => {
          const role = user.role;
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {});
        
        // Update analytics with real counts
        setManagerStats([
          {
            label: "Site Manager",
            icon: FaPeopleLine,
            count: roleCounts.SITE_INCHARGE || 0,
            percentage: usersData.length > 0 ? Math.round((roleCounts.SITE_INCHARGE || 0) / usersData.length * 100) : 0,
          },
          {
            label: "Project Manager",
            icon: Person,
            count: roleCounts.PROJECT_MANAGER || 0,
            percentage: usersData.length > 0 ? Math.round((roleCounts.PROJECT_MANAGER || 0) / usersData.length * 100) : 0,
          },
          {
            label: "Construction Manager",
            icon: Person3,
            count: roleCounts.CONSTRUCTION_MANAGER || 0,
            percentage: usersData.length > 0 ? Math.round((roleCounts.CONSTRUCTION_MANAGER || 0) / usersData.length * 100) : 0,
          },
        ]);
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

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, [filter]);

  const handleActionClick = () => {
    setShowModal(true);
  };

  const columns = [
    { headerName: "ID", field: "employeeId" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Role", field: "role" },
    { headerName: "Created By", field: "creator.name" },
    {
      headerName: "Action",
      field: "id",
    },
  ];

  const CustomActionComponent = ({ value : id  }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate(`/project-manager-dashboard/user-management/${id}`),
            icon: <FaEye />,
          },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  // Add RoleCell component after CustomActionComponent
  const RoleCell = ({ value }) => roleLabelMap[value] || value;

  // CustomFilterDropdown config
  const filters = [
    { label: "Role", options: roleOptions.map(o => o.label) },
  ];
  const handleFilterChange = (selection) => {
    setFilter(selection);
  };
  const handleFilterClear = () => setFilter({ Role: [] });

  return (
    <div className="h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      ) : (
        <>
          <TopBar
            title="User Management"
            // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              // showExport={true}
            buttonText="Create New User"
            onButtonClick={() =>
              navigate("/project-manager-dashboard/user-management/addUser")
            }
          />
          <div className="flex justify-end items-center gap-4 mt-2 mb-6">
            <CustomFilterDropdown
              filters={filters}
              selected={filter}
              onChange={handleFilterChange}
              onClear={handleFilterClear}
              placeholder="Filter by role"
            />
          </div>
          <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
          <h2 className="text-2xl font-semibold text-primary">
            Total Users Overview
          </h2>
          <div className="border border-[#CDC9C9] mt-4 rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {managerStats.map((item, index) => (
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
            <SimpleTable
              columns={columns}
              data={users}
              cellComponents={{ id: CustomActionComponent, role: RoleCell }}
              loading={loading}
            />
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
        </>
      )}
    </div>
  );
};

export default PmUserManagement;
