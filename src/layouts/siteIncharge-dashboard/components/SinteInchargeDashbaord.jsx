import React, { useEffect, useState } from "react";
// import { FaBoxesStacked, FaHandHoldingHeart } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import PieGraph from "../../../components/ui/Graphs/PieGraph";
import VertcleBarChart from "../../../components/ui/Graphs/VerticleBarChart";
import HorixontalBarchartGraph from "../../../components/ui/Graphs/HorixontalBarchartGraph";
import BasicBarChart from "../../../components/ui/Graphs/BasicBarChart";
import SimpleTable from "../../../components/SimpleTable";
import Loader from "../../../components/ui/Loader";
import { FaBoxesStacked, FaHandHoldingHeart } from "react-icons/fa6";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import { IconButton, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDateDMY, formatToK } from '../../../utils';
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";

// Status color mapping for demands and POs
const statusColorMap = {
  APPROVED: "#22c55e", // green
  REJECTED: "#ef4444", // red
  PENDING: "#f59e42", // orange
  PARTIALLY_APPROVED: "#eab308", // yellow
  PO_CREATED: "#8b5cf6", // purple
  FULFILLED: "#0ea5e9", // blue
  COMPLETED: "#22c55e", // green
  PARTIAL: "#eab308", // yellow
  CONFIRMED: "#44085c", // purple 
  REQUEST_SENT: "#707782", // gray
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

const ProofOfBillComponent = ({ value }) => {
  if (!value || value === "-") {
    return <span>-</span>;
  }
  
  // Check if the value is a valid URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (isValidUrl(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-primary underline cursor-pointer"
      >
        View Proof
      </a>
    );
  }
  
  return <span>{value}</span>;
};

function SinteInchargeDashbaord() {
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingDemands, setLoadingDemands] = useState(false);
  const [loadingPurchaseOrders, setLoadingPurchaseOrders] = useState(false);
  const [demandsFilter, setDemandsFilter] = useState({ Project: [], Section: [] });
  const [poFilter, setPoFilter] = useState({ Project: [], Section: [] });

  // Analytics and chart data states
  const [dashboardStats, setDashboardStats] = useState([
    { label: "Total Projects", icon: FaBoxesStacked, count: 0, percentage: 0 },
    { label: "Total Demands", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Total POs Created", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Assigned Sections", icon: IoStorefrontSharp, count: 0, percentage: 0 },
  ]);
  const [demandBreakdown, setDemandBreakdown] = useState([]);
  const [poDistributionByVendor, setPoDistributionByVendor] = useState([]);
  const [amountByVendor, setAmountByVendor] = useState([]);

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

  const columns2 = [
    { headerName: "Demand ID", field: "demandId" },
    { headerName: "Project Name", field: "project" },
    { headerName: "Materials", field: "material" },
    { headerName: "Vendor Name", field: "vendorName" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Amount(PKR)", field: "amount" },
    { headerName: "Proof of Bill", field: "proofOfBill" },
    { headerName: "Status", field: "status" },
  ];


  const fetchDemands = async () => {
    try {
      setLoadingDemands(true);
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand) => ({
          id: demand.id,
          refNo: demand.referenceNumber,
          project: demand.section?.projectName || "-",
          material: demand.material?.name || "-",
          section: demand.section?.name || "-",
          qty: demand.quantity,
          status: demand.status,
          cmName: demand.creator?.name || "-",
          date: formatDateDMY(demand.createdAt),
        }));
        setDemands(data);
      } else {
        toast.error("Failed to fetch Demands");
      }
    } catch (error) {
      console.error("Error fetching demands:", error);
      toast.error("Error fetching demands");
    } finally {
      setLoadingDemands(false);
    }
  };

  // Fetch recent purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      setLoadingPurchaseOrders(true);
      const response = await apiClient.get("/purchase-orders");
      if (response.ok) {
        // Map the API response to match the columns
        const data = response.data.data.map((po) => ({
          id: po.id,
          demandId: po.demand?.referenceNumber || "-",
          project: po.demand?.section?.project?.name || "-",
          demandName: po.demand?.referenceNumber || "-",
          material: po.material?.name || "-",
          vendorName: po.vendor?.name || po.vendorName || "-",
          section: po.demand?.section?.name || "-",
          qty: po.demand?.quantity || "-",
          unit: po.demand?.unit || "-",
          poQty: po.quantity || "-",
          amount: po.totalAmount ? `${po.totalAmount}` : "-",
          status: po.status || "-",
          assingedVendors: po.vendorId || "-",
          proofOfBill: po.proofOfBill || "-",
        }));
        setPurchaseOrders(data);
      } else {
        toast.error("Failed to fetch Purchase Orders");
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      toast.error("Error fetching purchase orders");
    } finally {
      setLoadingPurchaseOrders(false);
    }
  };

  // Fetch dashboard analytics and chart data
  const fetchDashboardAnalytics = async () => {
    try {
      const response = await apiClient.get("/analytics/site-incharge/dashboard");
      if (response.ok && response.data?.data?.summary) {
        const summary = response.data.data.summary;
        const charts = response.data.data.charts || {};
        setDashboardStats([
          { label: "Total Projects", icon: FaBoxesStacked, count: formatToK(summary.totalProjects || 0), percentage: 0 , onClick: () => navigate("/siteincharge-dashboard/project-management") },
          { label: "Total Demands", icon: FaHandHoldingHeart, count: formatToK(summary.totalDemands || 0), percentage: 0 , onClick: () => navigate("/siteincharge-dashboard/demands")},
          { label: "Total POs Created", icon: FaHandHoldingHeart, count: formatToK(summary.totalPOsCreated || 0), percentage: 0 , onClick: () => navigate("/siteincharge-dashboard/pOS")},
          { label: "Assigned Sections", icon: IoStorefrontSharp, count: formatToK(summary.assignedSections || 0), percentage: 0 },
        ]);
        setDemandBreakdown((charts.demandBreakdown || []).map((item) => ({ label: item.status, value: item.count })));
        setPoDistributionByVendor(charts.poDistributionByVendor || []);
        setAmountByVendor(charts.amountByVendor || []);
      } else {
        toast.error("Failed to fetch dashboard analytics");
      }
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      toast.error("Error fetching dashboard analytics");
    }
  };

  useEffect(() => {
    fetchDashboardAnalytics();
    fetchDemands();
    fetchPurchaseOrders();
  }, []);

  const demandProjectOptions = [...new Set(demands.map((d) => d.project).filter(Boolean))];
  const demandSectionOptions = [...new Set(demands.map((d) => d.section).filter(Boolean))];
  const poProjectOptions = [...new Set(purchaseOrders.map((po) => po.project).filter(Boolean))];
  const poSectionOptions = [...new Set(purchaseOrders.map((po) => po.section).filter(Boolean))];

  const demandFilters = [
    { label: "Project", options: demandProjectOptions },
    { label: "Section", options: demandSectionOptions },
  ];

  const poFilters = [
    { label: "Project", options: poProjectOptions },
    { label: "Section", options: poSectionOptions },
  ];

  const filteredDemands = demands.filter((demand) => {
    const projectMatch =
      !demandsFilter.Project ||
      demandsFilter.Project.length === 0 ||
      demandsFilter.Project.includes(demand.project);
    const sectionMatch =
      !demandsFilter.Section ||
      demandsFilter.Section.length === 0 ||
      demandsFilter.Section.includes(demand.section);
    return projectMatch && sectionMatch;
  });

  const filteredPOs = purchaseOrders.filter((po) => {
    const projectMatch =
      !poFilter.Project ||
      poFilter.Project.length === 0 ||
      poFilter.Project.includes(po.project);
    const sectionMatch =
      !poFilter.Section ||
      poFilter.Section.length === 0 ||
      poFilter.Section.includes(po.section);
    return projectMatch && sectionMatch;
  });

  const handleDemandFilterChange = (newSelected) => {
    setDemandsFilter(newSelected);
  };

  const handleDemandFilterClear = () => {
    setDemandsFilter({ Project: [], Section: [] });
  };

  const handlePOFilterChange = (newSelected) => {
    setPoFilter(newSelected);
  };

  const handlePOFilterClear = () => {
    setPoFilter({ Project: [], Section: [] });
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 w-full">
      <TopBar
        title="Site-Incharge Dashboard"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <h2 className="text-2xl font-semibold text-primary">Overview</h2>
      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {dashboardStats.map((item, index) => (
          <div
            key={index}
            className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 lg:last:after:hidden"
          >
            <AnalyticsCard
              label={item.label}  
              icon={item.icon}
              count={item.count}
              percentage={item.percentage}
              onClick={item.onClick}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PieGraph pieTitle={"Demand Status"} data={demandBreakdown} />
        <HorixontalBarchartGraph
          title={"PO Distribution by Vendor"}
          dataset={poDistributionByVendor}
          series={[{ dataKey: "poCount", label: "PO Count" }]}
        />
        <VertcleBarChart
          verTitle={"Amount by Vendor"}
          dataset={amountByVendor}
          series={[{ dataKey: "totalAmount", label: "Total Amount" }]}
        />
      </div>

      {/* <div className="mt-8">
        <BasicBarChart />
      </div> */}

      <div className="overflow-x-auto mt-8">  
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <div className="my-4 flex justify-end">
          <CustomFilterDropdown
            filters={demandFilters}
            selected={demandsFilter}
            onChange={handleDemandFilterChange}
            onClear={handleDemandFilterClear}
            placeholder="Filter by project or section"
            dropdownAlign="right"
          />
        </div>
        {loadingDemands ? (
          <Loader />
        ) : (
          <SimpleTable columns={columns} data={filteredDemands} cellComponents={{ status: StatusChip }} />
        )}
      </div>
      <div className="overflow-x-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Recent POs</h2>
        <div className="my-4 flex justify-end">
          <CustomFilterDropdown
            filters={poFilters}
            selected={poFilter}
            onChange={handlePOFilterChange}
            onClear={handlePOFilterClear}
            placeholder="Filter by project or section"
            dropdownAlign="right"
          />
        </div>

        {loadingPurchaseOrders ? (
          <Loader />
        ) : (
          <SimpleTable 
            columns={columns2} 
            data={filteredPOs} 
            cellComponents={{ 
              status: StatusChip, 
              proofOfBill: ProofOfBillComponent 
            }} 
          />
        )}
      </div>
    </div>
  );
}

export default SinteInchargeDashbaord;
