import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { IconButton, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { date } from "zod";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import DeleteModal from "../../../mui/DeleteModal";
import { formatDateDMY } from '../../../utils';

// Status color mapping
const statusColorMap = {
  APPROVED: "#22c55e", // green
  REJECTED: "#ef4444", // red
  PENDING: "#f59e42", // orange
  PARTIALLY_APPROVED: "#eab308", // yellow
  PO_CREATED: "#8b5cf6", // purple
  FULFILLED: "#0ea5e9", // blue
  default: "#0252AD", // fallback blue
};

const StatusChip = ({ value }) => {
  const status = (value || "PENDING").toUpperCase();
  const color = statusColorMap[status] || statusColorMap.default;
  return (
    <Chip
      label={status.replace(/_/g, " ")}
      size="small"
      sx={{ bgcolor: color, color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}
    />
  );
};

// Date and time formatting function
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d)) return "-";
  
  // Format as "DD MMM YYYY, HH:MM AM/PM" (e.g., "15 Jan 2024, 02:33 PM")
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  return `${day} ${month} ${year}, ${time}`;
};

// Date component for table
const DateComponent = ({ value }) => {
  return <span className="text-gray-700 font-medium">{formatDate(value)}</span>;
};

const Demands = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [demands, setDemands] = useState([]);
  const [allDemands, setAllDemands] = useState([]); // Store all demands for filter options
  const [filter, setFilter] = useState({ Status: [], Project: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDemandId, setSelectedDemandId] = useState(null);

  // Status options
  const statusOptions = [
    { label: "Request Sent", value: "REQUEST_SENT" },
    { label: "Partially Approved", value: "PARTIALLY_APPROVED" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Fulfilled From Store", value: "FULFILLED_FROM_STORE" },
    { label: "PO In Progress", value: "PO_IN_PROGRESS" },
    { label: "PO Created", value: "PO_CREATED" },
    { label: "Order Placed", value: "ORDER_PLACED" },
    { label: "In Store", value: "IN_STORE" },
    { label: "Completed", value: "COMPLETED" },
  ];
  // Get unique project names from all demands (not filtered)
  const projectOptions = [...new Set(allDemands.map(demand => demand.section?.projectName).filter(Boolean))];
  
  const filters = [
    { label: "Status", options: statusOptions.map(o => o.label) },
    { label: "Project", options: projectOptions },
  ];

  const columns = [
    { headerName: "Id", field: "referenceNumber" },
    { headerName: "Material", field: "material.name" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Qty", field: "quantity" },
    { headerName: "Date", field: "createdAt" },
    // { headerName: "Fulfilled", field: "fulfilled" },
    { headerName: "Created By", field: "creator.name" },
    { headerName: "Project", field: "section.projectName" },
    { headerName: "Section", field: "section.name" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "demandId" },
  ];

  // Fetch all demands for filter options
  const fetchAllDemands = async () => {
    try {
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          ...demand,
          demandId: demand.id,
          id: index + 1,
        }));
        setAllDemands(data);
      }
    } catch (error) {
      console.error("Error fetching all demands:", error);
    }
  };

  // Fetch all demands and apply filters on frontend
  const fetchDemands = async () => {
    try {
      setLoading(true);
      let url = "/demands";
      const queryParams = [];
      
      if (filter.Status && filter.Status.length > 0) {
        const backendStatus = filter.Status.map(
          label => statusOptions.find(o => o.label === label)?.value
        ).filter(Boolean);
        if (backendStatus.length > 0) {
          queryParams.push(`status=${encodeURIComponent(backendStatus.join(","))}`);
        }
      }
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }
      
      const response = await apiClient.get(url);
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          ...demand,
          demandId: demand.id,
          id: index + 1,
        }));
        
        // Apply project filter on frontend
        let filteredData = data;
        if (filter.Project && filter.Project.length > 0) {
          filteredData = data.filter(demand => 
            filter.Project.includes(demand.section?.projectName)
          );
        }
        
        setDemands(filteredData);
      } else {
        toast.error("Failed to fetch Demands");
      }
    } catch (error) {
      console.error("Error fetching demands:", error);
      toast.error("Error fetching demands");
    } finally {   
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDemands();
  }, []);

  useEffect(() => {
    fetchDemands();
    // eslint-disable-next-line
  }, [filter]);

  const deleteDemand = async () => {
    try {
      const response = await apiClient.delete(`/demands/${selectedDemandId}`);
      if (response.ok) {
        fetchDemands();
        setShowDeleteModal(false);
        toast.success("Demand deleted successfully");
      } else {
        toast.error(response.data?.message || "Failed to delete demand");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Status: [], Project: [] });

  const CustomActionComponent = ({ value: demandId }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => {
              if (demandId) {
                navigate(`/admin-dashboard/demands/${demandId}`);
              } else {
                console.error("Demand ID is undefined.");
              }
            },
            icon: <FaEye />,
          },
         
        
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  return (
    <div className=" h-full ">
      <TopBar
        title="Demands"
      />
      <div className="flex justify-end items-center gap-4 mt-2 mb-6">
        <CustomFilterDropdown
          filters={filters}
          selected={filter}
          onChange={handleFilterChange}
          onClear={handleFilterClear}
          placeholder="Filter by status or project"
        />
      </div>
      {/* <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div> */}
      {/* table */}
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={demands}
            cellComponents={{ 
              demandId: CustomActionComponent, 
              status: StatusChip,
              createdAt: DateComponent 
            }}
          />
        )}
      </div>
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteDemand}
        />
      )}
    </div>
  );
};

export default Demands;

