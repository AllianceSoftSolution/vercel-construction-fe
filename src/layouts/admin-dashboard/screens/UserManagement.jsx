import React from "react";
import TopBar from "@/components/ui/TopBar";
import CustomCardComponent from "../../../mui/CustomCardComponent";
import { FaBoxesStacked, FaHandHoldingHeart, FaToolbox } from "react-icons/fa6";
import { IoStorefrontSharp } from "react-icons/io5";
import CustomTable from "../../../mui/CustomTable";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const cardsData = [
    {
      icon: FaBoxesStacked,
      label: "Site Manager ",
      count: "04",
      countColor: "#FC8908",
    },
    {
      icon: FaHandHoldingHeart,
      label: "Project Manager ",
      count: "06",
      countColor: "#FC8908",
    },
    {
      icon: FaToolbox,
      label: "Store Incharge",
      count: "02",
      countColor: "#FC8908",
    },
    {
      icon: IoStorefrontSharp,
      label: "Accountant",
      count: "08",
      countColor: "#FC8908",
    },
  ];
  const data = [
    {
      id: 1,
      name: "Ahmed Raza",
      email: "aa@example.com",
      phoneNumber: "0300-1234567",
      joinDate: "2025-06-15",
      status: "Pending",
      role: "Project Manager",
      // note: "Awaiting document submission",
    },
    {
      id: 2,
      name: "Fatima Khan",
      email: "fa@example.com",
      phoneNumber: "0301-7654321",
      joinDate: "2025-06-14",
      status: "Approved",
      role: "Engineer",
      // note: "Joined recently",
    },
    {
      id: 3,
      name: "Hassan Ali",
      email: "ha@example.com",
      phoneNumber: "0321-4567890",
      joinDate: "2025-06-13",
      status: "In Progress",
      role: "Supervisor",
      // note: "Assigned to Metro Rail",
    },
  ];

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone Number", accessor: "phoneNumber" },
    { header: "Join date ", accessor: "joinDate" },
    { header: "Status", accessor: "status" },
    { header: "Role", accessor: "role" },
    // { header: "Note", accessor: "note " },
  ];

  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        title="User Management"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
        showFilter={true}
        buttonText="Create New User"
        onButtonClick={() =>
          navigate("/admin-dashboard/user-management/addUser")
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <h2 className="text-2xl font-semibold text-primary">
        {" "}
        Total Users Overview
      </h2>
      <div className="p-4">
        <CustomCardComponent cards={cardsData} />
      </div>
      {/* table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <CustomTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default UserManagement;
