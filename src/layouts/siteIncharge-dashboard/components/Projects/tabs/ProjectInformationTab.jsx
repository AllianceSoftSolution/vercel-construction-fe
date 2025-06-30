import React, { useState } from "react";
import ProjectInfoCard from "../../../../../components/ui/ProjectInfoCard";
import ProjectDescriptionCard from "../../../../../components/ui/ProjectDescriptionCard";
import { Box, IconButton, Modal } from "@mui/material";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import SimpleTable from "../../../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../../../../components/Button";
import AddMemberModal from "../../users/modals/AddMemberModal";
import AssignSectionModal from "../../../../../components/ui/modals/AssignSectionsModal";
import { useSearchParams } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};
const ProjectInformationTab = () => {
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
    const [showModal, setShowModal] = useState(false);

    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () =>
              navigate("/siteincharge-dashboard/user-management/123"),
            icon: <FaEye />,
          },
          { label: "Edit", onClick: () => alert("Edit"), icon: <FaUserEdit /> },
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

  const [searchParams, setSearchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(
    searchParams?.get("isLinkOpen") == "true" ? true : false
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLinkClick = () => {
    setShowModal(true);
    setSearchParams({ isLinkOpen: true });
  };
  const handleSubmit = () => {
    handleClose();
    setShowModal(false);
  };

  const closeAddUserFormModal = () => {
    setShowModal(false);

    setSearchParams({
      isLinkOpen: "false",
    });
  };
  return (
    <>
      <ProjectInfoCard
        title="Project Information"
        status="IN-PROGRESS"
        onDelete={() => console.log("delete")}
        onEdit={() => console.log("edit")}
        projectName="Project Name Here"
        projectCode="123"
        section="4"
        totalAmount="1000"
        paidAmount="500"
        remainingAmount="500"
        date="12/04/2025"
        projectLocation="United Kingdom 11 street Real Estate London"
        projectStatus="IN-PROGRESS"
      />
      <ProjectDescriptionCard
        title="Project Description"
        description={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...`}
        onEdit={() => console.log("edit description")}
      />
    
    </>
  );
};

export default ProjectInformationTab;
