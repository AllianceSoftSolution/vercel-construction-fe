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

const UserManagement = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/auth/users");
      if (response.ok) {
        // Adjust mapping as needed based on API response structure
        const data =
          response.data.users?.map((user, index) => ({
            ...user,
            iD: user.id || index + 1,
          })) || [];
        setUsers(data);
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
  }, []);

  const handleActionClick = () => {
    setShowModal(true);
  };

  const columns = [
    { headerName: "ID", field: "employeeId" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    // { headerName: "Phone Number", field: "phone" },
    { headerName: "Role", field: "role" },
    // { headerName: "Status", field: "status" },
    // { headerName: "Note", field: "note" },
    { headerName: "Created By", field: "creator.name" },
    {
      headerName: "Action",
      field: "action",
    },
  ];

  const managerAnalytics = [
    {
      label: "Site Manager",
      icon: FaPeopleLine,
      count: 10,
      percentage: 10,
    },
    {
      label: "Project Manager",
      icon: Person,
      count: 10,
      percentage: 10,
    },
    {
      label: "Construction Manager",
      icon: Person3,
      count: 10,
      percentage: 10,
    },
  ];

  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate("123"),
            icon: <FaEye />,
          },
          { label: "Edit", onClick: () => alert("Edit"), icon: <FaUserEdit /> },
          {
            label: "Delete ",
            onClick: () => alert("Delete"),
            icon: <FaTrash />,
          },
          {
            label: "Ban",
            // onClick: () => alert("Delete"),
            icon: <MdOutlineNoAccounts className="w-5 h-5" />,
          },
          {
            label: "Suspend Account",
            // onClick: () => alert("Delete"),
            icon: <FaBan />,
          },
        ]}
        // onClick={handleActionClick}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };
  return (
    <div className=" h-full ">
      <TopBar
        title="User Management"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
        showFilter={true}
        filterOptions={[
          "Project Manager",
          "Const Manager",
          "Site Manager",
          "Store-INCHARGE",
          "Accountant",
        ]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
        buttonText="Create New User"
        onButtonClick={() =>
          navigate("/admin-dashboard/user-management/addUser")
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <h2 className="text-2xl font-semibold text-primary">
        Total Users Overview
      </h2>
      <div className="border border-[#CDC9C9] mt-4 rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {managerAnalytics.map((item, index) => (
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
          cellComponents={{ action: CustomActionComponent }}
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
    </div>
  );
};

export default UserManagement;
