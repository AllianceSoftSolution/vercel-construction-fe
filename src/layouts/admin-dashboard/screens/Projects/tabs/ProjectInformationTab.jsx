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
import { useNavigate } from "react-router-dom";
import AssignProjectManagerModal from "../../../../../components/AssignProjectManagerModal";
import AssignMemberModal from "../../../../../components/AssignMemberModal";
import apiClient from "../../../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../../../components/ui/Loader";
import { formatDateDMY } from '../../../../../utils';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};

const ProjectInformationTab = ({ data, onAssignmentSuccess }) => {
  const navigate = useNavigate();

  const [openPM, setOpenPM] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openSection, setOpenSection] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [assignRole, setAssignRole] = useState("");
  
  // Loading states for different operations
  const [siteInchargeLoading, setSiteInchargeLoading] = useState(false);
  const [accountantLoading, setAccountantLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [pmModalLoading, setPmModalLoading] = useState(false);
  const [addUserModalLoading, setAddUserModalLoading] = useState(false);
  const [sectionModalLoading, setSectionModalLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(false);
  
  const handleOpenPM = () => setOpenPM(true);
  const handlePMCreate = () => {
    setOpenPM(false);
    setOpenAddUser(true);
  };
  const handleAddUserDone = () => {
    setOpenAddUser(false);
    setOpenSection(true);
  };
  const handleSectionDone = () => setOpenSection(false);

  // Handle opening assign modal with loading state
  const handleOpenAssignModal = async (role) => {
    setAssignRole(role);
    setInitialDataLoading(true);
    setOpenAssignModal(true);
    
    try {
      // Pre-fetch users for the selected role
      let apiRole = null;
      if (role === "Site Incharge") apiRole = "SITE_INCHARGE";
      if (role === "Accountant") apiRole = "ACCOUNTANT";
      
      if (apiRole) {
        const response = await apiClient.get(`/assignments/users-by-role`, {
          role: apiRole,
          projectId: data.id,
        });
        if (!response.ok) {
          toast.error("Failed to fetch users");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch initial data");
    } finally {
      setInitialDataLoading(false);
    }
  };

  // API-integrated functions for Site Incharge and Accountant assignment
  const fetchUsers = async (role) => {
    let apiRole = null;
    if (role === "Site Incharge") apiRole = "SITE_INCHARGE";
    if (role === "Accountant") apiRole = "ACCOUNTANT";
    if (!apiRole) return [];
    try {
      setModalLoading(true);
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: apiRole,
        projectId: data.id,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    } finally {
      setModalLoading(false);
    }
  };

  const fetchSectionsSiteIncharge = async (userId) => {
    try {
      setModalLoading(true);
      const response = await apiClient.get(
        `/assignments/site-incharge/sections-with-status`,
        {
          projectId: data.id,
          userId,
        }
      );
      if (response.ok && response.data?.sections) {
        return response.data.sections;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch sections");
      return [];
    } finally {
      setModalLoading(false);
    }
  };

  const fetchSectionsAccountant = async (userId) => {
    try {
      setModalLoading(true);
      const response = await apiClient.get(
        `/assignments/accountant/sections-with-status`,
        {
          projectId: data.id,
          userId,
        }
      );
      if (response.ok && response.data?.sections) {
        return response.data.sections;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch sections");
      return [];
    } finally {
      setModalLoading(false);
    }
  };

  const createUser = async (userData, role) => {
    let apiRole = null;
    if (role === "Site Incharge") apiRole = "SITE_INCHARGE";
    if (role === "Accountant") apiRole = "ACCOUNTANT";
    if (!apiRole) return null;
    try {
      setModalLoading(true);
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: apiRole,
      });
      if (response.ok && response.data?.user) {
        toast.success("User created successfully");
        return response.data.user;
      }
      toast.error(response.data?.message || "Failed to create user");
      return null;
    } catch (e) {
      toast.error("Failed to create user");
      return null;
    } finally {
      setModalLoading(false);
    }
  };

  const handleAssign = async ({ userId, sectionIds }) => {
    let endpoint = null;
    if (assignRole === "Site Incharge") {
      endpoint = "/assignments/site-incharge";
      setSiteInchargeLoading(true);
    }
    if (assignRole === "Accountant") {
      endpoint = "/assignments/accountant";
      setAccountantLoading(true);
    }
    if (!endpoint) return false;
    try {
      const response = await apiClient.post(endpoint, {
        userId,
        projectId: data.id,
        sectionIds,
      });
      if (response.ok) {
        toast.success("Sections assigned successfully");
        if (typeof onAssignmentSuccess === "function") {
          onAssignmentSuccess();
        }
        return true;
      } else {
        toast.error(response.data?.message || "Failed to assign sections");
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign sections");
      return false;
    } finally {
      if (assignRole === "Site Incharge") {
        setSiteInchargeLoading(false);
      }
      if (assignRole === "Accountant") {
        setAccountantLoading(false);
      }
    }
  };

  // Mock functions for other modals (these would be replaced with actual API calls)
  const handlePMModalAction = async (action) => {
    try {
      setPmModalLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (action === 'create') {
        handlePMCreate();
      }
    } catch (error) {
      toast.error("Failed to process action");
    } finally {
      setPmModalLoading(false);
    }
  };

  const handleAddUserModalAction = async (userData) => {
    try {
      setAddUserModalLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleAddUserDone();
    } catch (error) {
      toast.error("Failed to add user");
    } finally {
      setAddUserModalLoading(false);
    }
  };

  const handleSectionModalAction = async () => {
    try {
      setSectionModalLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleSectionDone();
    } catch (error) {
      toast.error("Failed to assign sections");
    } finally {
      setSectionModalLoading(false);
    }
  };

 

  const columns = [
    // { headerName: "ID", field: "id" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Sections", field: "noOfSection" },
    // { headerName: "Role", field: "role" },
    // { headerName: "Status", field: "status" },
    // { headerName: "Note", field: "note" },
    // { headerName: "Date", field: "date" },
    // { headerName: "Action", field: "action" },
  ];

  const CustomActionComponent = () => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail",
          onClick: () => navigate("/admin-dashboard/user-management/123"),
          icon: <FaEye />,
        },
        // { label: "Edit", onClick: () => alert("Edit"), icon: <FaUserEdit /> },
        { label: "Delete ", onClick: () => alert("Delete"), icon: <FaTrash /> },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  return (
    <>
      <ProjectInfoCard
        title="Project Information"
        status={data?.status || "IN-PROGRESS"}
        onDelete={() => console.log("delete")}
        onEdit={() => console.log("edit")}
        projectName={data?.name || "N/A"}
        projectCode={data?.code || "N/A"}
        sections={data?.sections.length || "0"}
        totalAmountSpent={data?.totalAmountSpent || "0"}
        // remainingAmount={data?.remainingAmount || "0"}
        // paidAmount={data?.paidAmount || "0"}
        startDate={data?.startDate ? formatDateDMY(data.startDate) : "N/A"}
        endDate={data?.endDate ? formatDateDMY(data.endDate) : "N/A"}
        // projectLocation={data?.location || "Not specified"}
        // projectStatus={data?.status || "N/A"}
      />

      <ProjectDescriptionCard
        title="Project Description"
        description={data?.description || "No description available."}
        // onEdit={() => console.log("edit description")}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold mb-4 mt-4">Site Incharge</h2>
        <Button
          buttonText={initialDataLoading && assignRole === "Site Incharge" ? "Loading..." : "Create Site Incharge"}
          onClick={() => handleOpenAssignModal("Site Incharge")}
          disabled={initialDataLoading}
        />
      </div>

      {siteInchargeLoading ? (
        <Loader />
      ) : (
        <SimpleTable
          columns={columns}
          data={
            data?.assignedSiteIncharges?.map((i) => ({
              ...i,
              noOfSection: i.sections.length,
            })) || []
          }
          cellComponents={{ action: CustomActionComponent }}
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold mb-4 mt-4">Accountant</h2>
        <Button
          buttonText={initialDataLoading && assignRole === "Accountant" ? "Loading..." : "Create An Accountant"}
          onClick={() => handleOpenAssignModal("Accountant")}
          disabled={initialDataLoading}
        />
      </div>
      {accountantLoading ? (
        <Loader />
      ) : (
        <SimpleTable
          columns={columns}
          data={
            data?.assignedAccountants?.map((i) => ({
              ...i,
              noOfSection: i.sections.length,
            })) || []
          }
          cellComponents={{ action: CustomActionComponent }}
        />
      )}

      <AssignMemberModal
        role={assignRole}
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        fetchUsers={fetchUsers}
        createUser={createUser}
        fetchSections={
          assignRole === "Site Incharge"
            ? (userId) => fetchSectionsSiteIncharge(userId)
            : assignRole === "Accountant"
            ? (userId) => fetchSectionsAccountant(userId)
            : undefined
        }
        onAssign={handleAssign}
        loading={modalLoading || initialDataLoading}
      />

      <Modal open={openPM} onClose={() => setOpenPM(false)}>
        <Box sx={style} className="bg-white p-4">
          {pmModalLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          ) : (
            <AssignProjectManagerModal 
              onCreateClick={() => handlePMModalAction('create')}
              onManagerClick={(id) => handlePMModalAction('select')}
              loading={pmModalLoading}
            />
          )}
        </Box>
      </Modal>

      <Modal open={openAddUser} onClose={() => setOpenAddUser(false)}>
        <Box sx={style} className="bg-white p-4">
          {addUserModalLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          ) : (
            <AddMemberModal 
              onAddUserClick={handleAddUserModalAction}
              onClose={() => setOpenAddUser(false)}
              loading={addUserModalLoading}
            />
          )}
        </Box>
      </Modal>

      <Modal open={openSection} onClose={handleSectionDone}>
        <Box sx={style} className="bg-white p-4">
          {sectionModalLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          ) : (
            <AssignSectionModal
              handleSubmit={handleSectionModalAction}
              handleCancel={handleSectionDone}
              loading={sectionModalLoading}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ProjectInformationTab;
