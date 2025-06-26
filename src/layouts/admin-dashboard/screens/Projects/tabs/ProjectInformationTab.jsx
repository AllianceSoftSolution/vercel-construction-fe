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
import { useNavigate, useSearchParams } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};
const ProjectInformationTab = () => {
  const navigate = useNavigate();
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
            onClick: () => navigate("/admin-dashboard/user-Management/123"),
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
        amount="$12333"
        date="12/04/2025"
        projectLocation="United Kingdom 11 street Real Estate London"
        projectStatus="IN-PROGRESS"
      />
      <ProjectDescriptionCard
        title="Project Description"
        description={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...`}
        onEdit={() => console.log("edit description")}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold mb-4 mt-4">Site Incharge</h2>
        <Button buttonText={"Create Site Incharge"} onClick={handleLinkClick} />
        {showModal && (
          <AddMemberModal
            onAddUserClick={setOpen}
            onClose={closeAddUserFormModal}
          />
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AssignSectionModal
              handleSubmit={() => {
                handleSubmit();
                closeAddUserFormModal();
              }}
              handleCancel={() => {
                handleClose();
                closeAddUserFormModal();
              }}
            />
          </Box>
        </Modal>
      </div>
      <SimpleTable
        columns={columns}
        data={data}
        cellComponents={{ action: CustomActionComponent }}
      />{" "}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold mb-4 mt-4">Accountant</h2>
        <Button buttonText={"Create An Accountant"} onClick={handleLinkClick} />
      </div>
      <SimpleTable
        columns={columns}
        data={data}
        cellComponents={{ action: CustomActionComponent }}
      />
    </>
  );
};

export default ProjectInformationTab;
