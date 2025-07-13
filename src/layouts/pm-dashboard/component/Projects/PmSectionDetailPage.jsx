import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import ProjectInfoCard from "../../../../components/ui/ProjectInfoCard";
import SimpleTable from "../../../../components/SimpleTable";
import Loader from "../../../../components/ui/Loader";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { useNavigate, useParams } from "react-router-dom";
import AddMemberModal from "../users/modals/AddMemberModal";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import MemebersOverviewCard from "../../../../mui/MembersOverviewCard";
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

const PmSectionDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [sectionData, setSectionData] = useState({});
  const [selectedPM, setSelectedPM] = useState(null);
  const [selectedStoreHead, setSelectedStoreHead] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const CustomActionComponent = ({ data }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail",
          onClick: () => navigate("/admin-dashboard/user-Management/123"),
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) fetchSectionDetail();
  }, [id]);

  return (
    <div className="p-2 sm:p-4">
      {loading ? (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader/>
        </div>
      ) : (
        <>
          <TopBar
            title="Section Details"
            detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />

          {/* Project Info Box */}
          <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 gap-4">
            <div className="flex flex-wrap justify-between gap-4">
              <InfoItem label="Project Name" value={sectionData?.project?.name || "-"} />
              <InfoItem label="Project Code" value={sectionData?.project?.code || "-"} />
              <InfoItem label="Section" value={sectionData?.name || "-"} />
              <InfoItem label="Amount" value={sectionData?.amount || "-"} />
              <InfoItem label="Date" value={sectionData?.createdAt ? new Date(sectionData?.createdAt).toLocaleDateString() : "-"} />
            </div>
            <div className="flex flex-wrap gap-10 mt-2">
              <InfoItem label="Project Location" value={sectionData?.project?.location || "-"} />
              <InfoItem label="Project Status" value={sectionData?.project?.status || "-"} />
            </div>
          </div>

          {/* Member Overview */}
          <div className="mt-10">
            <h4 className="text-[#12141D] font-semibold text-xl mb-4">
              Members Overview
            </h4>
            <div className="flex flex-col lg:flex-row gap-6">
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
                <MemebersOverviewCard
                  title="General Information"
                  subTitle="Project Manager"
                  linkText="Assign Project Manager"
                  imageSrc={Search}
                  imageAlt="Search Illustration"
                  onManagerClick={() => setShowModal(true)}
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
                <MemebersOverviewCard
                  title="General Information"
                  subTitle="Store Head"
                  linkText="Assign Store Head"
                  imageSrc={Search}
                  imageAlt="Search Illustration"
                  onManagerClick={() => setShowModal(true)}
                />
              )}
            </div>
          </div>

          {/* Construction Manager Table */}
          <div className="mt-10">
            <TopBar
              title="Construction Managers"
              detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              buttonText="Add CM"
              onButtonClick={handleOpen}
            />

            {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}

            {/* Modal */}
            <Modal open={open} onClose={handleClose}>
              <Box sx={style}>
                <AssignProjectManagerModal
                  onCreateClick={(bool) => {
                    setShowModal(bool);
                    setOpen(false);
                  }}
                />
              </Box>
            </Modal>

            <div className="overflow-x-auto mt-4">
              <SimpleTable
                data={sectionData?.associatedConstructionManagers || []}
                columns={columns}
                cellComponents={{ action: CustomActionComponent }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <p className="text-[#444444] font-semibold text-base whitespace-nowrap">
      {label}:
    </p>
    <p className="text-[#979797] text-sm">{value}</p>
  </div>
);

export default PmSectionDetailPage;
