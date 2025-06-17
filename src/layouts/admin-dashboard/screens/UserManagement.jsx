import React, { useState } from "react";
import TopBar from "@/components/ui/TopBar";
import CustomCardComponent from "../../../mui/CustomCardComponent";
import { FaBoxesStacked, FaHandHoldingHeart, FaToolbox } from "react-icons/fa6";
import { IoStorefrontSharp } from "react-icons/io5";
import CustomTable from "../../../mui/CustomTable";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import ActionModal from "../../admin-dashboard/screens/users/modals/ActionModal";

const UserManagement = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleActionClick = () => {
    setShowModal(true);
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone Number", accessor: "phoneNumber" },
    { header: "Join date", accessor: "joinDate" },
    { header: "Status", accessor: "status" },
    { header: "Role", accessor: "role" },
    { header: "Note", accessor: "note" },
    {
      header: "Action",
      accessor: "action",
      render: () => (
        <BsThreeDotsVertical
          className="cursor-pointer text-xl"
          onClick={handleActionClick}
        />
      ),
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
      note: "Awaiting document submission",
    },
    {
      id: 2,
      name: "Fatima Khan",
      email: "fa@example.com",
      phoneNumber: "0301-7654321",
      joinDate: "2025-06-14",
      status: "Approved",
      role: "Engineer",
      note: "Joined recently",
    },
    {
      id: 3,
      name: "Hassan Ali",
      email: "ha@example.com",
      phoneNumber: "0321-4567890",
      joinDate: "2025-06-13",
      status: "In Progress",
      role: "Supervisor",
      note: "Assigned to Metro Rail",
    },
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
        Total Users Overview
      </h2>
      <div className="p-4">
        <CustomCardComponent
          icon={FaBoxesStacked}
          label="Site Manager"
          count="04"
          countColor="#FC8908"
          percentage="+5%"
          percentageColor="#00C49F"
        />{" "}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <CustomTable columns={columns} data={data} />
      </div>

      {/* ✅ Your Modal Rendering */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl relative">
            <button
              className="absolute top-2 right-3 text-lg font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <ActionModal />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
