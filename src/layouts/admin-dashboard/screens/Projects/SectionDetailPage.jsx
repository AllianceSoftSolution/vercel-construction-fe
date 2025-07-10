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
    { headerName: "CM ID", field: "cmId" },
    { headerName: "Construction Manager", field: "constructionManager" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone" },
    { headerName: "Address", field: "address" },
    { headerName: "Status", field: "status" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];

  const fetchSectionDetail = async () => {
    try {
      const response = await apiClient.get(`/sections/${id}`);
      if (response.ok) {
        setSectionData(response.data.section);
        setSelectedPM(response.data.section.associatedProjectManager?.user || null);
        const headStore = response.data.section.associatedHeadStores?.[0];
        setSelectedStoreHead(headStore?.storeInchargeAssignments?.[0]?.user || null);
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
      const response = await apiClient.post(`/sections/${id}/assign-construction-manager`, { userId: user.id });
      if (response.ok) {
        toast.success("Construction Manager assigned successfully!");
        fetchSectionDetail();
        setShowModal(false);
      } else {
        toast.error(response.data?.message || "Failed to assign Construction Manager");
      }
    } catch (error) {
      toast.error(error.message || "Error assigning Construction Manager");
    }
  };

  // Handler for adding a new Construction Manager
  const handleAddCM = async (data) => {
    try {
      const response = await apiClient.post("/auth/register", { ...data, role: "CONSTRUCTION_MANAGER" });
      if (response.ok) {
        toast.success("Construction Manager added successfully!");
        await handleAssignCM(response.data.user);
        setShowModal(false);
        fetchSectionDetail();
      } else {
        toast.error(response.data?.message || "Failed to add Construction Manager");
      }
    } catch (error) {
      toast.error(error.message || "Error adding Construction Manager");
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
            value={sectionData?.createdAt ? new Date(sectionData?.createdAt).toLocaleDateString() : "-"}
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
              onManagerClick={handleAssignPM}
              className=""
            />
          )}

          {selectedStoreHead ? (
            <MemberInfoCard
              title="General information - Store Head"
              image={manager}
              name={selectedStoreHead.name}
              phone={selectedStoreHead.phone || "-"}
              role={selectedStoreHead.role || "Store Head"}
              email={selectedStoreHead.email}
              joiningDate={selectedStoreHead.joiningDate || "-"}
              id={selectedStoreHead.id}
              address={selectedStoreHead.address || "-"}
              country={selectedStoreHead.country || "-"}
              linkedStores={selectedStoreHead.linkedStores || []}
            />
          ) : (
            <MembersOverviewCard
              title="General Information"
              subTitle="Store Head"
              linkText="Assign Store Head"
              imageSrc={Search}
              imageAlt="Search Illustration"
              onManagerClick={handleAssignStoreHead}
              className=""
            />
          )}
        </div>
      </div>

      <div className="mt-10">
        <TopBar
          title="Construction Managers"
          detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          buttonText="Add CM" 
          onButtonClick={() => setShowModal(true)}
        />

        <div className="overflow-x-auto mt-4">
          <SimpleTable
            data={sectionData?.associatedConstructionManagers || []}
            columns={columns}
            cellComponents={{ action: CustomActionComponent }}
          />
        </div>
      </div>

      <Modal open={openPMModal} onClose={() => setOpenPMModal(false)}>
        <Box sx={style}>
          <AssignProjectManagerModal
            onManagerClick={handleAssignPM}
            onCreateClick={() => setShowModal(true)}
          />
        </Box>
      </Modal>

      <Modal open={openStoreModal} onClose={() => setOpenStoreModal(false)}>
        <Box sx={style}>
          <AssignProjectManagerModal
            onManagerClick={handleAssignStoreHead}
            onCreateClick={() => setShowModal(true)}
          />
        </Box>
      </Modal>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-[450px] max-h-[90vh] border-[0.5px] border-[#CDC9C9] rounded-2xl p-0 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#CDCDCD]">
              <TopBar
                title="Add Construction Manager"
                detail="Assign or Add a Construction Manager to this Section"
              />
            </div>
            <div className="flex-1 overflow-auto p-4 flex flex-col gap-y-4">
              {availableCMs.length > 0 ? (
                <>
                  <div className="mb-2 font-semibold">Select from existing Construction Managers:</div>
                  {availableCMs.map((cm) => (
                    <div
                      key={cm.id}
                      className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm transition-all border-2 border-transparent cursor-pointer hover:border-2 hover:border-[#fc8908] mb-2"
                      onClick={() => handleAssignCM(cm)}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f7f7f8] flex-shrink-0">
                        <img src={cm.avatar || manager} alt="CM avatar" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[#043b6a] font-medium text-base">{cm.name}</span>
                    </div>
                  ))}
                  <div className="mt-4 text-center text-sm text-gray-500">Or add a new Construction Manager below:</div>
                  <AddMemberModal
                    onClose={() => setShowModal(false)}
                    onAddUserClick={handleAddCM}
                  />
                </>
              ) : (
                <AddMemberModal
                  onClose={() => setShowModal(false)}
                  onAddUserClick={handleAddCM}
                />
              )}
            </div>
          </div>
        </div>
      )}
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
