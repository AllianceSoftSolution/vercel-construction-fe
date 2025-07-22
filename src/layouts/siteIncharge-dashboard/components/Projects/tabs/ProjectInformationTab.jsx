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
import { formatDateDMY } from '../../../../../utils';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};

const ProjectInformationTab = ({ data, loading }) => {
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

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return formatDateDMY(dateString);
  };

  // Get project status
  const getProjectStatus = () => {
    if (!data) return "Unknown";
    if (data.isActive) return "ACTIVE";
    return "INACTIVE";
  };

  // Get total sections count
  const getTotalSections = () => {
    if (!data?.sections) return "0";
    return data.sections.length.toString();
  };

  // Get total assigned members
  const getTotalMembers = () => {
    if (!data?.associatedMembers) return "0";
    return data.associatedMembers.length.toString();
  };

  return (
    <>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading ...</p>
        </div>
      ) : (
        <>
          <ProjectInfoCard
            title="Project Information"
            status={getProjectStatus()}
            onDelete={() => console.log("delete")}
            onEdit={() => console.log("edit")}
            projectName={data?.name || "Project Name Not Available"}
            projectCode={data?.code || "N/A"}
            section={getTotalSections()}
            totalAmount={data?.totalAmount || "0"}
            paidAmount={data?.paidAmount || "0"}
            remainingAmount={data?.remainingAmount || "0"}
            date={formatDate(data?.createdAt)}
            projectLocation="Location not available " // This would come from API if available
            projectStatus={getProjectStatus()}
          />
          
          <ProjectDescriptionCard
            title="Project Description"
            description={data?.description || "No description available for this project."}
            onEdit={() => console.log("edit description")}
          />

        
        </>
      )}      
    </>
  );
};

export default ProjectInformationTab;
