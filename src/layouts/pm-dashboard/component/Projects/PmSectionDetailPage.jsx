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
import AssignCAPModal from "../../../../components/AssignCAPModal";
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

const capColumns = [
  { headerName: "Material Name", field: "materialName" },
  { headerName: "CAP Quantity", field: "capQuantity" },
  { headerName: "Unit", field: "capUnit" },
  { headerName: "Demand Quantity", field: "totalDemandQuantity" },
  { headerName: "PO Quantity", field: "totalPurchaseOrderQuantity" },
  { headerName: "Status", field: "status" },
  // { headerName: "Action", field: "materialId" },
];

const CapQuantityComponent = ({ value, row }) => {
  if (!row) {
    return <span>{value}</span>;
  }
  
  const capQuantity = row.capQuantity || 0;
  const demandQuantity = row.totalDemandQuantity || 0;
  const poQuantity = row.totalPurchaseOrderQuantity || 0;
  
  // Check if demand quantity exceeds cap quantity
  const isDemandExceeded = demandQuantity > capQuantity;
  // Check if PO quantity exceeds cap quantity
  const isPOExceeded = poQuantity > capQuantity;
  
  let textColor = 'text-green-600 font-semibold'; // Default green
  
  if (isDemandExceeded || isPOExceeded) {
    textColor = 'text-red-600 font-semibold'; // Red if either exceeds
  }
  
  return (
    <span className={textColor}>
      {value}
    </span>
  );
};

// Custom cell renderer for status with chips
const StatusComponent = ({ value, row }) => {
  // If row is undefined, we'll work with just the value
  const getStatusInfo = (status) => {
    // Map status strings to display info
    switch (status) {
      case "WITHIN_LIMIT":
        return { text: "Within Limit", color: "bg-green-100 text-green-800" };
      case "DEMAND_EXCEEDED":
        return { text: "Demand Exceeded", color: "bg-orange-100 text-orange-800" };
      case "PO_EXCEEDED":
        return { text: "PO Exceeded", color: "bg-yellow-100 text-yellow-800" };
      case "BOTH_EXCEEDED":
        return { text: "Both Exceeded", color: "bg-red-100 text-red-800" };
      case "PENDING":
        return { text: "Pending", color: "bg-gray-100 text-gray-800" };
      case "INACTIVE":
        return { text: "Inactive", color: "bg-gray-100 text-gray-600" };
      default:
        return { text: status || "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusInfo = getStatusInfo(value);

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.text}
    </span>
  );
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
  const [openAssignCAPModal, setOpenAssignCAPModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [capData, setCapData] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // CAP submission handler
  const handleCAPSubmit = async (capItems) => {
    try {
      setModalLoading(true);
      
      // Transform the data to match the API structure
      const transformedItems = capItems.map((item) => ({
        materialId: item.materialId,
        quantity: parseInt(item.qty) || 0,
        unit: item.unit,
      }));

      console.log("Original CAP items:", capItems);
      console.log("Transformed items:", transformedItems);

      // Call the new API endpoint
      console.log("Sending CAP data:", { caps: transformedItems });
      const response = await apiClient.post(`/material-caps/section/${id}`, {
        caps: transformedItems
      });
      
      console.log("API Response:", response);
      
      if (response.ok) {
        toast.success("CAP items added successfully!");
        setOpenAssignCAPModal(false);
        // Refresh section data to get updated materialCapAnalytics
        fetchSectionDetail();
      } else {
        console.error("API Error:", response.data);
        toast.error(response.data?.message || "Failed to add CAP items");
      }
    } catch (error) {
      console.error("Error adding CAP items:", error);
      toast.error("Failed to add CAP items");
    } finally {
      setModalLoading(false);
    }
  };

  // Fetch CAP data for the section
  const fetchCAPData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/material-caps/section/${id}`);
      if (response.ok) {
        const caps = response.data.caps || [];
        // Transform data to include formatted dates
        const transformedCaps = caps.map(cap => ({
          ...cap,
          createdAt: new Date(cap.createdAt).toLocaleDateString()
        }));
        setCapData(transformedCaps);
      } else {
        toast.error("Failed to fetch CAP data");
      }
    } catch (error) {
      console.error("Error fetching CAP data:", error);
      toast.error("Error fetching CAP data");
    } finally {
      setLoading(false);
    }
  };

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

  const columnsAcc = [
    { headerName: "Name", field: "user.name" },
    { headerName: "Email", field: "user.email" },
    {headerName : "Role" , field : "user.role"},
  
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
    if (id) {
      fetchSectionDetail();
    }
  }, [id]);

  // Update CAP data when section data changes
  React.useEffect(() => {
    if (sectionData?.materialCapAnalytics) {
      console.log("Material CAP Analytics:", sectionData.materialCapAnalytics);
      setCapData(sectionData.materialCapAnalytics);
    } else if (id) {
      // Fetch CAP data if not available in sectionData
      fetchCAPData();
    }
  }, [sectionData, id]);

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
            showIcon={true}
            // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
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
              title="Accountant "
            
            />

            <div className="overflow-x-auto mt-4 relative">
              {loading ? (
                <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <SimpleTable
                data={sectionData?.associatedAccountants || []}
                columns={columnsAcc}
                  cellComponents={{}}
                />
              )}
            </div>
            <TopBar
              title="Construction Managers"
              // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
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

          {/* CAP Table and Modal */}
          <div className="mt-10">
            <TopBar
              title="Material CAP"
              buttonText="Add Material Cap"
              onButtonClick={() => setOpenAssignCAPModal(true)}
            />
            <div className="overflow-x-auto mt-4 relative">
              <SimpleTable
                data={capData}
                columns={capColumns}
                cellComponents={{ 
                  id: CustomActionComponent,
                  capQuantity: CapQuantityComponent,
                  status: StatusComponent
                }}
              />
            </div>
            <AssignCAPModal
              open={openAssignCAPModal}
              onClose={() => setOpenAssignCAPModal(false)}
              onSubmit={handleCAPSubmit}
              loading={modalLoading}
              sectionId={id}
              onCapDeleted={fetchCAPData}
            />
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
