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

const CmUserManagement = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleActionClick = () => {
    setShowModal(true);
  };

  const data = [
    {
      id: 1,
      iD: "01",
      name: "Ahmed Raza",
      email: "c@gmail.com",
      phone: 123456789,
      role: "Project Manager",
      status: "Pending",
      note: "Ahmed Raza",
      date: "2025-06-15",
    },
    {
      id: 2,
      iD: "02",
      name: "Ahmed Raza",
      email: "c@gmail.com",
      phone: 123456789,
      role: "Construction Manager",
      status: "Approved",
      note: "Fatima Khan",
      date: "2025-06-14",
    },
    {
      id: 3,
      iD: "03",
      name: "Ahmed Raza",
      email: "c@gmail.com",
      phone: 123456789,
      role: "Site Manager",
      status: "In Progress",
      note: "Hassan Ali",
      date: "2025-06-13",
    },
  ];
  const columns = [
    { headerName: "ID", field: "iD" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone" },
    { headerName: "Role", field: "role" },
    { headerName: "Status", field: "status" },
    { headerName: "Note", field: "note" },
    { headerName: "Date", field: "date" },
    {
      headerName: "Action",
      field: "action",
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
            icon: <IoPersonCircle />,
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
    <div className="md:px-2 mx-2 h-full md:mx-0">
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
          navigate("/construction-manager-dashboard/user-management/addUser")
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <h2 className="text-2xl font-semibold text-primary">
        Total Users Overview
      </h2>
      <div className="border-[0.5px] mt-4 border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnalyticsCard
          label={"Site Manager"}
          icon={FaPeopleLine}
          count={10}
          percentage={10}
        />{" "}
        <AnalyticsCard
          label={"Project Manager"}
          icon={FaPeopleLine}
          count={10}
          percentage={10}
        />
        <AnalyticsCard
          label={"Construction Manager"}
          icon={FaPeopleLine}
          count={10}
          percentage={10}
        />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 mt-4">Recent Demands</h2>
        <SimpleTable
          columns={columns}
          data={data}
          cellComponents={{ action: CustomActionComponent }}
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

export default CmUserManagement;
 