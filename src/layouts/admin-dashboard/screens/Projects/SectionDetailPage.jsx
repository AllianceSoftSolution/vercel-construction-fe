import React, { useEffect, useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { useNavigate, useParams } from "react-router-dom";
import AddMemberModal from "../users/modals/AddMemberModal";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import MembersOverviewCard from "../../../../mui/MembersOverviewCard";
import manager from "../../../../../src/assets/construction/manager.png";
import Search from "../../../../../src/assets/construction/Search.png";
import AssignProjectManagerModal from "../../../../components/AssignProjectManagerModal";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";
import AssignMemberModal from "../../../../components/AssignMemberModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  boxShadow: 24,
};

const SectionDetailPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [openPMModal, setOpenPMModal] = useState(false);
  const [openStoreModal, setOpenStoreModal] = useState(false);
  const [openAssignPMModal, setOpenAssignPMModal] = useState(false);
  const [openAssignCMModal, setOpenAssignCMModal] = useState(false);
  const [openAssignStoreInchargeModal, setOpenAssignStoreInchargeModal] =
    useState(false);
  const [selectedPM, setSelectedPM] = useState(null);
  const [selectedStoreHead, setSelectedStoreHead] = useState(null);
  const { id } = useParams();
  const [sectionData, setSectionData] = useState({});
  const CustomActionComponent = ({ data }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail",
          onClick: () =>
            navigate("/project-manager-dashboard/user-management/123"),
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
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

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
      cmId: "2",
      constructionManager: "Ali",
      email: "ali@gmail.com",
      phone: +123455667,
      address: "B2",
      status: "Approved",
      date: "2025-06-16",
      action: "id-here",
    },
  ];

  const columns = [
    { headerName: "CM ID", field: "id" },
    { headerName: "Name", field: "user.name" },
    { headerName: "Email", field: "user.email" },
    // { headerName: "Phone Number", field: "user.phone" },
    // { headerName: "Address", field: "user.address" },
    { headerName: "Created By", field: "user.creator.name" },
    { headerName: "CM Store", field: "cmStore.name" },
    { headerName: "Action", field: "action" },
  ];

  const fetchSectionDetail = async () => {
    try {
      const response = await apiClient.get(`/sections/${id}`);
      if (response.ok) {
        setSectionData(response.data.section);
        setSelectedPM(
          response.data.section.associatedProjectManager?.user || null
        );
        const headStore = response.data.section.associatedHeadStores?.[0];
        setSelectedStoreHead(
          headStore?.storeInchargeAssignments?.[0]?.user || null
        );
      } else {
        toast.error("Failed to fetch Section details.");
      }
    } catch (error) {
      console.error("Error fetching Section details:", error);
      toast.error("Something went wrong while fetching details.");
    }
  };

  useEffect(() => {
    if (id) fetchSectionDetail();
  }, [id]);

  const handleAssignPM = (user) => {
    setSelectedPM(user);
    setOpenPMModal(false);
    fetchSectionDetail();
  };

  const handleAssignStoreHead = (user) => {
    setSelectedStoreHead(user);
    setOpenStoreModal(false);
    fetchSectionDetail();
  };

  const handleAddMember = async (data, type) => {
    try {
      const response = await apiClient.post("/auth/register", data);
      if (response.ok) {
        toast.success("Member added successfully!");
        fetchSectionDetail();
        if (type === "pm") setOpenPMModal(false);
        if (type === "store") setOpenStoreModal(false);
      } else {
        toast.error(response.data?.message || "Failed to add member");
      }
    } catch (error) {
      toast.error(error.message || "Error adding member");
    }
  };

  // Add this helper to get available CMs from sectionData
  const availableCMs = sectionData?.availableConstructionManagers || [];

  // Handler for assigning a Construction Manager
  const handleAssignCM = async (user) => {
    try {
      const response = await apiClient.post(
        `/sections/${id}/assign-construction-manager`,
        { userId: user.id }
      );
      if (response.ok) {
        toast.success("Construction Manager assigned successfully!");
        fetchSectionDetail();
        setShowModal(false);
      } else {
        toast.error(
          response.data?.message || "Failed to assign Construction Manager"
        );
      }
    } catch (error) {
      toast.error(error.message || "Error assigning Construction Manager");
    }
  };

  // Handler for adding a new Construction Manager
  const handleAddCM = async (data) => {
    try {
      const response = await apiClient.post("/auth/register", {
        ...data,
        role: "CONSTRUCTION_MANAGER",
      });
      if (response.ok) {
        toast.success("Construction Manager added successfully!");
        await handleAssignCM(response.data.user);
        setShowModal(false);
        fetchSectionDetail();
      } else {
        toast.error(
          response.data?.message || "Failed to add Construction Manager"
        );
      }
    } catch (error) {
      toast.error(error.message || "Error adding Construction Manager");
    }
  };

  // Project Manager assignment logic
  const fetchPMUsers = async () => {
    try {
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: "PROJECT_MANAGER",
        projectId: sectionData?.project?.id,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const createPMUser = async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: "PROJECT_MANAGER",
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
    }
  };

  const handleAssignPMGeneric = async ({ userId }) => {
    try {
      const response = await apiClient.post(`/assignments/project-manager`, {
        userId,
        projectId: sectionData?.project?.id,
        sectionId: sectionData?.id,
      });
      if (response.ok) {
        toast.success("Project Manager assigned successfully");
        setOpenAssignPMModal(false);
        fetchSectionDetail();
        return true;
      } else {
        toast.error(
          response.data?.message || "Failed to assign Project Manager"
        );
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign Project Manager");
      return false;
    }
  };

  // Construction Manager assignment logic
  const fetchCMUsers = async () => {
    try {
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: "CONSTRUCTION_MANAGER",
        projectId: sectionData?.project?.id,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const createCMUser = async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: "CONSTRUCTION_MANAGER",
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
    }
  };

  const handleAssignCMGeneric = async ({ userId }) => {
    try {
      const response = await apiClient.post(
        `/assignments/construction-manager`,
        { userId, sectionId: id }
      );
      if (response.ok) {
        toast.success("Construction Manager assigned successfully!");
        setOpenAssignCMModal(false);
        fetchSectionDetail();
        return true;
      } else {
        toast.error(
          response.data?.message || "Failed to assign Construction Manager"
        );
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign Construction Manager");
      return false;
    }
  };

  // Store Incharge assignment logic
  const fetchStoreInchargeUsers = async () => {
    try {
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: "STORE_INCHARGE",
        projectId: sectionData?.project?.id,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const createStoreInchargeUser = async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: "STORE_INCHARGE",
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
    }
  };

  const handleAssignStoreInchargeGeneric = async ({ userId }) => {
    try {
      const response = await apiClient.post(`/assignments/store-incharge`, {
        userId,
        storeId: sectionData?.headStore?.id,
      });
      if (response.ok) {
        toast.success("Store Incharge assigned successfully!");
        fetchSectionDetail();
        setOpenAssignStoreInchargeModal(false);
        return true;
      } else {
        toast.error(
          response.data?.message || "Failed to assign Store Incharge"
        );
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign Store Incharge");
      return false;
    }
  };

  return (
    <div className=" sm:p-6 w-full">
      <TopBar
        title="Section Details"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />

      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <InfoItem
            label="Project Name"
            value={sectionData?.project?.name || "-"}
          />
          <InfoItem
            label="Project Code"
            value={sectionData?.project?.code || "-"}
          />
          <InfoItem label="Section" value={sectionData?.name || "-"} />
          <InfoItem
            label="Date"
            value={
              sectionData?.createdAt
                ? new Date(sectionData?.createdAt).toLocaleDateString()
                : "-"
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-4">
          <InfoItem label="Project Location" value="project location" />
          <InfoItem label="Project Status" value="project status" />
          <InfoItem label="Total Amount" value="1200$" />
          <InfoItem label="Paid Amount" value="1500$" />
          <InfoItem label="Remaining Amount" value="1600$" />
        </div>
      </div>

      <div className="mt-10">
        <h4 className="text-[#12141D] font-semibold text-xl mb-4">
          Members Overview
        </h4>

        <div className="flex flex-col lg:flex-row h-full gap-6 w-full">
          {/* Project Manager Card */}
          {selectedPM ? (
            <MemberInfoCard
              title="General information - Project Manager"
              image={manager}
              name={selectedPM.name}
              phone={selectedPM.phone || "-"}
              role={selectedPM.role || "Project Manager"}
              email={selectedPM.email}
              joiningDate={selectedPM.joiningDate || "-"}
              id={selectedPM.id}
              address={selectedPM.address || "-"}
              country={selectedPM.country || "-"}
              linkedStores={selectedPM.linkedStores || []}
            />
          ) : (
            <MembersOverviewCard
              title="General Information"
              subTitle="Project Manager"
              linkText="Assign Project Manager"
              imageSrc={Search}
              imageAlt="Search Illustration"
              onManagerClick={() => setOpenAssignPMModal(true)}
              className=""
            />
          )}

          {/* Head Store Card - Improved Flow */}
          <div className="w-full sm:w-[90%] md:w-[75%] lg:w-[50%] lg:h-80 h-full mt-6">
            {sectionData?.headStore ? (
              <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 h-full flex flex-col justify-between bg-white">
                <div>
                  <h3 className="text-[#BF1017] text-lg sm:text-xl font-semibold mb-2">
                    Head Store
                  </h3>
                  <div className="mb-2">
                    <span className="font-semibold">Name:</span>{" "}
                    {sectionData.headStore.name}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Type:</span>{" "}
                    {sectionData.headStore.type}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">ID:</span>{" "}
                    {sectionData.headStore.id}
                  </div>
                </div>
                {/* Store Incharge Section */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold text-base mb-2">
                    Store Incharge
                  </h4>
                  {sectionData.headStore.storeInchargeAssignments &&
                  sectionData.headStore.storeInchargeAssignments.length > 0 &&
                  sectionData.headStore.storeInchargeAssignments[0].user ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Name:</span>
                        <span>
                          {
                            sectionData.headStore.storeInchargeAssignments[0]
                              .user.name
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Email:</span>
                        <span>
                          {sectionData.headStore.storeInchargeAssignments[0]
                            .user.email || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Phone:</span>
                        <span>
                          {sectionData.headStore.storeInchargeAssignments[0]
                            .user.phone || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Joining Date:</span>
                        <span>
                          {sectionData.headStore.storeInchargeAssignments[0]
                            .user.joiningDate
                            ? new Date(
                                sectionData.headStore.storeInchargeAssignments[0].user.joiningDate
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Role:</span>
                        <span>
                          {sectionData.headStore.storeInchargeAssignments[0]
                            .user.role || "Store Incharge"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[#979797]">
                        No Store Incharge assigned.
                      </span>
                      <button
                        className="mt-2 px-4 py-2 bg-[#BF1017] text-white rounded hover:bg-[#a00e13] transition"
                        onClick={() => setOpenAssignStoreInchargeModal(true)}
                      >
                        Assign Store Incharge
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 h-full flex items-center justify-center bg-white">
                <span className="text-[#979797] text-base">
                  No Head Store assigned to this section.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <TopBar
          title="Construction Managers"
          detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          buttonText="Add CM"
          onButtonClick={() => setOpenAssignCMModal(true)}
        />

        <div className="overflow-x-auto mt-4">
          <SimpleTable
            data={sectionData?.associatedConstructionManagers || []}
            columns={columns}
            cellComponents={{ action: CustomActionComponent }}
          />
        </div>
      </div>

      <AssignMemberModal
        role="Project Manager"
        open={openAssignPMModal}
        onClose={() => setOpenAssignPMModal(false)}
        fetchUsers={fetchPMUsers}
        createUser={createPMUser}
        onAssign={handleAssignPMGeneric}
      />

      <Modal open={openStoreModal} onClose={() => setOpenStoreModal(false)}>
        <Box sx={style}>
          <AssignProjectManagerModal
            onManagerClick={handleAssignStoreHead}
            onCreateClick={() => setShowModal(true)}
          />
        </Box>
      </Modal>

      <AssignMemberModal
        role="Construction Manager"
        open={openAssignCMModal}
        onClose={() => setOpenAssignCMModal(false)}
        fetchUsers={fetchCMUsers}
        createUser={createCMUser}
        onAssign={handleAssignCMGeneric}
      />

      <AssignMemberModal
        role="Store Incharge"
        open={openAssignStoreInchargeModal}
        onClose={() => setOpenAssignStoreInchargeModal(false)}
        fetchUsers={fetchStoreInchargeUsers}
        createUser={createStoreInchargeUser}
        onAssign={handleAssignStoreInchargeGeneric}
      />
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex items-start sm:flex-row gap-1 sm:gap-2">
    <p className="text-[#444444] font-semibold text-base whitespace-nowrap">
      {label}:
    </p>
    <p className="text-[#979797] text-sm break-words flex justify-center items-center">
      {value}
    </p>
  </div>
);

export default SectionDetailPage;
