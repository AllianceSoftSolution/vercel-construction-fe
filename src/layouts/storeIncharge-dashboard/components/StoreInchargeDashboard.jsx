import React from "react";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiExport } from "react-icons/ci";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaToolbox } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import CustomCardComponent from "../../../mui/CustomCardComponent";
import CustomTable from "../../../mui/CustomTable";
import SimpleTable from "../../../components/SimpleTable";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import BasicBarChart from "../../../components/ui/Graphs/BasicBarChart";
import Loader from "../../../components/ui/Loader";
import { useEffect } from "react";
import { useState } from "react";
import  apiClient  from "../../../api/apiClient";
import toast from "react-hot-toast";
import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatToK } from '../../../utils';
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";

const statusColorMap = {
  APPROVED: "#22c55e", // green
  REJECTED: "#ef4444", // red
  PENDING: "#f59e42", // orange
  PARTIALLY_APPROVED: "#eab308", // yellow
  PO_CREATED: "#8b5cf6", // purple
  FULFILLED: "#0ea5e9", // blue
  COMPLETED: "#22c55e", // green
  PARTIAL: "#eab308", // yellow
  CONFIRMED: "#7a0b4a",
  default: "#0252AD", // fallback blue
};

const statusOptions = Object.keys(statusColorMap).filter((key) => key !== "default");

function StoreInchargeDashboard() {
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [demandsFilter, setDemandsFilter] = useState({ Status: [], Project: [], Section: [] });

  // Analytics data state
  const [projectStats, setProjectStats] = useState([
    { label: "Total Stores", icon: IoStorefrontSharp, count: 0, percentage: 0 },
    { label: "Total Materials", icon: FaToolbox, count: 0, percentage: 0 },
    { label: "Total Stock", icon: FaBoxesStacked, count: 0, percentage: 0 },
    { label: "Total Reserved", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Assigned Sections", icon: IoStorefrontSharp, count: 0, percentage: 0 },
  ]);

  const columns = [
    { headerName: "Ref No", field: "refNo" },
    { headerName: "Projects", field: "project" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Status", field: "status" },
    { headerName: "CM Name", field: "cmName" },
    { headerName: "Date", field: "date" },
  ];

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get("/analytics/store-incharge/dashboard");
      if (response.ok && response.data?.data?.summary) {
        const summary = response.data.data.summary;
        setProjectStats([
          { label: "Total Stores", icon: IoStorefrontSharp, count: formatToK(summary.totalStores || 0), percentage: 0 , onClick: () => navigate("/store-incharge-dashboard/store")},
          { label: "Total Materials", icon: FaToolbox, count: formatToK(summary.totalMaterials || 0), percentage: 0 },
          { label: "Total Stock", icon: FaBoxesStacked, count: formatToK(summary.totalStock || 0), percentage: 0 },
          { label: "Total Reserved", icon: FaHandHoldingHeart, count: formatToK(summary.totalReserved || 0), percentage: 0 },
          { label: "Assigned Sections", icon: IoStorefrontSharp, count: formatToK(summary.assignedSections || 0), percentage: 0 },
        ]);
      } else {
        toast.error("Failed to fetch analytics data");
      }
    } catch (error) {
      toast.error("Error fetching analytics data");
      console.error(error);
    }
  };

  const StatusChip = ({ value }) => {
    const status = (value || "PENDING").toUpperCase();
    const color = statusColorMap[status] || statusColorMap.default;
    return <Chip label={status.replace(/_/g, " ")} sx={{ backgroundColor: color, color: "white" }} />;
  };

  // Helper function to format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchDemands = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          refNo: demand.referenceNumber || "-",
          project: demand.section?.projectName || "-",
          material: demand.material?.name || "-",
          section: demand.section?.name || "-",
          qty: demand.quantity || "-",
          status: demand.status || "-",
          cmName: demand.creator?.name || "-",
          date: formatDate(demand.createdAt),
        }));
        setDemands(data);
      } else {
        toast.error("Failed to fetch Demands");
      }
    } catch (error) {
      console.error("Error fetching demands:", error);
      toast.error("Error fetching demands");
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchDemands();
  }, []);

  const demandProjectOptions = [...new Set(demands.map((d) => d.project).filter((project) => project && project !== "-"))];
  const demandSectionOptions = [...new Set(demands.map((d) => d.section).filter((section) => section && section !== "-"))];
  const demandStatusOptions = statusOptions.map((status) => status.replace(/_/g, " "));

  const filters = [
    { label: "Status", options: demandStatusOptions },
    { label: "Project", options: demandProjectOptions },
    { label: "Section", options: demandSectionOptions },
  ];

  const normalizedSelectedStatuses =
    demandsFilter.Status?.map((status) => status?.toUpperCase().replace(/\s+/g, "_")) || [];

  const filteredDemands = demands.filter((demand) => {
    const projectMatch =
      !demandsFilter.Project ||
      demandsFilter.Project.length === 0 ||
      demandsFilter.Project.includes(demand.project);
    const sectionMatch =
      !demandsFilter.Section ||
      demandsFilter.Section.length === 0 ||
      demandsFilter.Section.includes(demand.section);
    const demandStatusKey = (demand.status || "").toUpperCase().replace(/\s+/g, "_");
    const statusMatch =
      normalizedSelectedStatuses.length === 0 ||
      normalizedSelectedStatuses.includes(demandStatusKey);
    return projectMatch && sectionMatch && statusMatch;
  });

  const handleDemandFilterChange = (newSelected) => {
    setDemandsFilter(newSelected);
  };

  const handleDemandFilterClear = () => {
    setDemandsFilter({ Status: [], Project: [], Section: [] });
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <TopBar
        title="Store-Incharge Dashboard"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <h2 className="text-2xl font-semibold text-primary ">Overview</h2>

      <div className="border rounded-xl p-4 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projectStats.map((item, index) => {
          return (
            <div
              key={index}
              className={`relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-[#E0E0E0] `}
            >
              <AnalyticsCard
                label={item.label}
                icon={item.icon}
                count={item.count}
                percentage={item.percentage}
                onClick={item.onClick}
              />
            </div>
          );
        })}
      </div>
      {/* <BasicBarChart /> */}

      {/* table */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 mt-4">Recent Demands</h2>
        <SimpleTable
          columns={columns}
          data={filteredDemands}
          tableFilters={filters}
          filterSelected={demandsFilter}
          onFilterChange={handleDemandFilterChange}
          onFilterClear={handleDemandFilterClear}
          filterPlaceholder="Filter by status, project or section"
          filterDropdownAlign="right"
          exportFileName="demands"
          cellComponents={{ status: StatusChip }}
        />
      </div>
      {/* <div>
        <h2 className="text-xl font-bold mb-4">Recent POs</h2>
        <CustomTable columns={columns} data={data} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Invoices Awaiting Payment</h2>
        <CustomTable columns={columns} data={data} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Store Updates</h2>
        <CustomTable columns={columns} data={data} />
      </div> */}
    </div>
  );
}

export default StoreInchargeDashboard;
