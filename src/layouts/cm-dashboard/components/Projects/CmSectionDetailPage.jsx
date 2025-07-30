import React, { useState, useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
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
import Loader from "../../../../components/ui/Loader";

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
  // { headerName: "Action", field: "id" },
];

const CmSectionDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAssignCAPModal, setOpenAssignCAPModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [capData, setCapData] = useState([]);

  // Generic function to format text for display (roles, types, etc.)
  const formatText = (text) => {
    if (!text) return "-";
    
    // Convert text to title case and replace underscores with spaces
    return text
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

  const CapActionComponent = ({ value: capId }) => {
    const handleDeleteCap = async () => {
      try {
        setModalLoading(true);
        const response = await apiClient.patch(`/material-caps/section/${id}`, {
          capId: capId,
          action: "delete"
        });
        
        if (response.ok) {
          toast.success("CAP deleted successfully!");
          fetchCAPData(); // Refresh the CAP table
        } else {
          toast.error("Failed to delete CAP");
        }
      } catch (error) {
        console.error("Error deleting CAP:", error);
        toast.error("Error deleting CAP");
      } finally {
        setModalLoading(false);
      }
    };

    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "Delete",
            onClick: handleDeleteCap,
            icon: <FaTrash />,
          },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  // Fetch CAP data for this section
  const fetchCAPData = async (setLoadingState = true) => {
    try {
      if (setLoadingState) setLoading(true);
      const response = await apiClient.get(`/material-caps/section/${id}`);
      if (response.ok) {
        const caps = response.data.caps || [];
        console.log("Raw CAP data from API:", caps); // Debug log
        
        // Transform data to include formatted dates
        const transformedCaps = caps.map(cap => ({
          ...cap,
          createdAt: new Date(cap.createdAt).toLocaleDateString()
        }));
        console.log("Transformed CAP data:", transformedCaps); // Debug log
        setCapData(transformedCaps);
      } else {
        toast.error("Failed to fetch CAP data");
      }
    } catch (error) {
      console.error("Error fetching CAP data:", error);
      toast.error("Error fetching CAP data");
    } finally {
      if (setLoadingState) setLoading(false);
    }
  };

  useEffect(() => {
    // Simulate fetch section by id (replace with real API call if needed)
    const fetchSection = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/sections/${id}`);
        if (response.ok) {
          setSectionData(response.data.section);
          
          // Check if sectionData has materialCapAnalytics
          if (response.data.section?.materialCapAnalytics) {
            console.log("Material CAP Analytics:", response.data.section.materialCapAnalytics);
            setCapData(response.data.section.materialCapAnalytics);
          } else {
            // Fetch CAP data separately if not available in sectionData
            fetchCAPData(false);
          }
        } else {
          toast.error("Failed to fetch section details.");
        }
      } catch (error) {
        toast.error("Error fetching section details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchSection();
    }
  }, [id]);

  // Info fields fallback
  const info = [
    ["Project Name", sectionData?.project?.name || "-"],
    ["Project Code", sectionData?.project?.code || "-"],
    ["Section", sectionData?.name || "-"],
    // ["Amount", sectionData?.amount || "-"],
    // ["Date", sectionData?.createdAt ? new Date(sectionData.createdAt).toLocaleDateString() : "-"],
    // ["Project Location", sectionData?.project?.location || "-"],
    // ["Project Status", sectionData?.project?.status || "-"],
  ];

  return (
    <div className="mt-4 px-4 w-full">
      <TopBar
        title="Section Details"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />

      {/* Project Info */}
      <div className="bg-[#F7F7F7] rounded-md mt-4 p-4 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-4">
          {info.map(([label, value], index) => (
            <div key={index} className="flex items-center gap-2 w-full sm:w-[45%]">
              <p className="text-[#444444] font-semibold text-sm sm:text-base">
                {label}:
              </p>
              <p className="text-[#979797] text-sm sm:text-base">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CAP Table and Modal */}
      <div className="mt-10">
        <TopBar
          title="Material CAP"
          // buttonText="Add Material Cap"
          // onButtonClick={() => setOpenAssignCAPModal(true)}
        />
        <div className="overflow-x-auto mt-4 relative">
          {loading ? (
            <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
              <Loader />
            </div>
          ) : (
            <>
              {console.log("capData being passed to table:", capData)}
              {capData.length === 0 ? (
                <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
                  <p className="text-gray-500">No CAP data available</p>
                </div>
              ) : (
                <SimpleTable
                  data={capData}
                  columns={capColumns}
                  cellComponents={{ 
                    capQuantity: CapQuantityComponent,
                    id: CapActionComponent 
                  }}
                />
              )}
            </>
          )}
        </div>
       
      </div>

      <AssignCAPModal
        open={openAssignCAPModal}
        onClose={() => setOpenAssignCAPModal(false)}
        onSubmit={async (capItems) => {
          try {
            setModalLoading(true);
            
            const transformedItems = capItems.map((item) => ({
              materialId: item.materialId,
              quantity: parseInt(item.qty) || 0,
              unit: item.unit,
            }));

            const response = await apiClient.post(`/material-caps/section/${id}`, {
              caps: transformedItems
            });
            
            if (response.ok) {
              toast.success("CAP items added successfully!");
              setOpenAssignCAPModal(false);
              // Refresh section data to get updated materialCapAnalytics
              const sectionResponse = await apiClient.get(`/sections/${id}`);
              if (sectionResponse.ok) {
                setSectionData(sectionResponse.data.section);
                if (sectionResponse.data.section?.materialCapAnalytics) {
                  setCapData(sectionResponse.data.section.materialCapAnalytics);
                }
              }
            } else {
              toast.error(response.data?.message || "Failed to add CAP items");
            }
          } catch (error) {
            console.error("Error adding CAP items:", error);
            toast.error("Failed to add CAP items");
          } finally {
            setModalLoading(false);
          }
        }}
        loading={modalLoading}
        sectionId={id}
        onCapDeleted={fetchCAPData}
      />
    </div>
  );
};

export default CmSectionDetailPage;
