import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import ProjectInfoCard from "../../../../components/ui/ProjectInfoCard";
import SimpleTable from "../../../../components/SimpleTable";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { useNavigate } from "react-router-dom";
import AddMemberModal from "../users/modals/AddMemberModal";

const SectionDetailPage = () => {
  const navigate = useNavigate();
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Store",
            onClick: () => navigate("123"),
            icon: <FaUserEdit />,
          },
          {
            label: "Edit",
            onClick: () => alert("Edit"),
            icon: <FaUserEdit />,
          },
          {
            label: "Delete ",
            onClick: () => alert("Delete"),
            icon: <FaTrash />,
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
  const data = [
    {
      id: 1,
      cmId: "1",
      constructionManager: "Hassan",
      email: "h@gmail.com",
      phone: +123455666,
      address: "A1",
      status: "Pending",
      date: "2025-06-15",
      action: "id-here",
    },
    {
      id: 2,
      cmId: "1",
      constructionManager: "Hassan",
      email: "h@gmail.com",
      phone: +123455666,
      address: "A1",
      status: "Pending",
      date: "2025-06-15",
      action: "id-here",
    },
    {
      id: 3,
      cmId: "1",
      constructionManager: "Hassan",
      email: "h@gmail.com",
      phone: +123455666,
      address: "A1",
      status: "Pending",
      date: "2025-06-15",
      action: "id-here",
    },
  ];
  const columns = [
    { headerName: "CM ID", field: "cmId" },
    { headerName: "Construction Manager", field: "constructionManager" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone" },
    { headerName: "Address", field: "address" },
    { headerName: "Status", field: "status" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];
  const [showModal, setShowModal] = useState(false);
  const handleLinkClick = () => {
    setShowModal(true);
  };
  return (
    <div className="mt-4">
      <TopBar
        title="Section Details"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex justify-between gap-x-4 flex-wrap">
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">
              Project Name:
            </p>
            <p className="text-[#979797]">project name</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">
              Project Code:
            </p>
            <p className="text-[#979797]">project Code</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Section:</p>
            <p className="text-[#979797]">section</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Amount:</p>
            <p className="text-[#979797]">amount</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Date:</p>
            <p className="text-[#979797]">date</p>
          </div>
        </div>

        <div className="flex justify-start gap-x-14 flex-wrap">
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">
              Project Location:
            </p>
            <p className="text-[#979797]">project Location</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">
              Project Status:
            </p>
            <p className="text-[#979797]">project Status</p>
          </div>
        </div>
      </div>
      <TopBar
        title="Construction Managers "
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonText="Add CM"
        onButtonClick={handleLinkClick}
      />
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
      <SimpleTable
        data={data}
        columns={columns}
        cellComponents={{ action: CustomActionComponent }}
      />
    </div>
  );
};

export default SectionDetailPage;
