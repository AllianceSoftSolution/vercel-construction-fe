import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye } from "react-icons/fa";
import { IconButton, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import { formatDateDMY } from '../../../utils';

// Status color mapping
const statusColorMap = {
  APPROVED: "#22c55e",
  REJECTED: "#ef4444",
  PENDING: "#f59e42",
  PARTIALLY_APPROVED: "#eab308",
  PO_CREATED: "#8b5cf6",
  FULFILLED: "#0ea5e9",
  default: "#0252AD",
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

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d)) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} ${month} ${year}, ${time}`;
};

const DateComponent = ({ value }) => {
  return <span className="text-gray-700 font-medium">{formatDate(value)}</span>;
};

const Demands = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [demands, setDemands] = useState([]);
  const [allDemands, setAllDemands] = useState([]);
  const [filter, setFilter] = useState({ Status: [], Project: [] });
  const [activeSection, setActiveSection] = useState("All");

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

  // Derive unique sections from fetched demands
  const sections = React.useMemo(() => {
    const map = new Map();
    allDemands.forEach((demand) => {
      const sectionName = demand.section?.name;
      if (sectionName && !map.has(sectionName)) {
        map.set(sectionName, { name: sectionName, projectName: demand.section?.projectName || "" });
      }
    });
    return Array.from(map.values());
  }, [allDemands]);

  const getSectionCounts = (sectionName) => {
    const sectionDemands = allDemands.filter((d) => d.section?.name === sectionName);
    return {
      total: sectionDemands.length,
      approved: sectionDemands.filter((d) => ["APPROVED", "PARTIALLY_APPROVED"].includes(d.status)).length,
      pending: sectionDemands.filter((d) => ["REQUEST_SENT", "PENDING"].includes(d.status)).length,
      rejected: sectionDemands.filter((d) => d.status === "REJECTED").length,
    };
  };

  const projectOptions = [...new Set(allDemands.map((d) => d.section?.projectName).filter(Boolean))];
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
    { headerName: "Created By", field: "creator.name" },
    { headerName: "Project", field: "section.projectName" },
    { headerName: "Section", field: "section.name" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "demandId" },
  ];

  const applyFilters = (data) => {
    let filteredData = data;
    if (filter.Project && filter.Project.length > 0) {
      filteredData = filteredData.filter((d) => filter.Project.includes(d.section?.projectName));
    }
    if (activeSection !== "All") {
      filteredData = filteredData.filter((d) => d.section?.name === activeSection);
    }
    setDemands(filteredData);
  };

  const fetchDemands = async () => {
    try {
      setLoading(true);
      let url = "/demands";
      if (filter.Status && filter.Status.length > 0) {
        const backendStatus = filter.Status.map(
          label => statusOptions.find(o => o.label === label)?.value
        ).filter(Boolean);
        if (backendStatus.length > 0) {
          url += `?status=${encodeURIComponent(backendStatus.join(","))}`;
        }
      }
      const response = await apiClient.get(url);
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          ...demand,
          demandId: demand.id,
          id: index + 1,
        }));
        setAllDemands(data);
        applyFilters(data);
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
    fetchDemands();
    // eslint-disable-next-line
  }, [filter]);

  useEffect(() => {
    applyFilters(allDemands);
    // eslint-disable-next-line
  }, [activeSection]);

  const handleFilterChange = (newSelected) => setFilter(newSelected);
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
                navigate(`/siteincharge-dashboard/demands/${demandId}`);
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

  const allCounts = {
    total: allDemands.length,
    approved: allDemands.filter((d) => ["APPROVED", "PARTIALLY_APPROVED"].includes(d.status)).length,
    pending: allDemands.filter((d) => ["REQUEST_SENT", "PENDING"].includes(d.status)).length,
    rejected: allDemands.filter((d) => d.status === "REJECTED").length,
  };

  const activeSectionCounts = activeSection === "All" ? allCounts : getSectionCounts(activeSection);

  return (
    <div className="h-full">
      <TopBar title="Demands" />

      {/* Section Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSection("All")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
            activeSection === "All"
              ? "bg-[#FF6B00] text-white border-[#FF6B00]"
              : "bg-white text-gray-600 border-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00]"
          }`}
        >
          All ({allDemands.length})
        </button>
        {sections.map((sec) => {
          const count = allDemands.filter((d) => d.section?.name === sec.name).length;
          return (
            <button
              key={sec.name}
              onClick={() => setActiveSection(sec.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeSection === sec.name
                  ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00]"
              }`}
            >
              {sec.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Section Summary Cards */}
      {!loading && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border rounded-lg p-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-[#0252AD]">{activeSectionCounts.total}</span>
            <span className="text-xs text-gray-500 mt-1">Total</span>
          </div>
          <div className="bg-white border rounded-lg p-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600">{activeSectionCounts.approved}</span>
            <span className="text-xs text-gray-500 mt-1">Approved</span>
          </div>
          <div className="bg-white border rounded-lg p-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-orange-500">{activeSectionCounts.pending}</span>
            <span className="text-xs text-gray-500 mt-1">Pending</span>
          </div>
          <div className="bg-white border rounded-lg p-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-red-500">{activeSectionCounts.rejected}</span>
            <span className="text-xs text-gray-500 mt-1">Rejected</span>
          </div>
        </div>
      )}

      <div className="flex justify-end items-center gap-4 mt-4 mb-2">
        <CustomFilterDropdown
          filters={filters}
          selected={filter}
          onChange={handleFilterChange}
          onClear={handleFilterClear}
          placeholder="Filter by status or project"
        />
      </div>

      <div className="overflow-x-auto mt-2">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={demands}
            cellComponents={{
              demandId: CustomActionComponent,
              status: StatusChip,
              createdAt: DateComponent,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Demands;

