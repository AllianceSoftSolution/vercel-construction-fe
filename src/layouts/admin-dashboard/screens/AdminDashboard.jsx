import React, { useEffect, useState } from "react";
import { FaBoxesStacked, FaHandHoldingHeart } from "react-icons/fa6";
import { IoTabletLandscape } from "react-icons/io5";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import PieGraph from "../../../components/ui/Graphs/PieGraph";
import HorixontalBarchartGraph from "../../../components/ui/Graphs/HorixontalBarchartGraph";
import VertcleBarChart from "../../../components/ui/Graphs/VerticleBarChart";
import BasicBarChart from "../../../components/ui/Graphs/BasicBarChart";
import SimpleTable from "../../../components/SimpleTable";
import {
  Balance,
  CachedSharp,
  DoNotDisturbOnTotalSilenceSharp,
  NewReleasesOutlined,
  NewspaperOutlined,
  NewspaperSharp,
  PeopleSharp,
} from "@mui/icons-material";
import Divider from "../../../components/Divider";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";
import Loader from "../../../components/ui/Loader";
import { IconButton, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatToK } from '../../../utils';
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
  CONFIRMED: "#7a0b4a",
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

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
};

const DateCell = ({ value }) => (
  <span className="whitespace-nowrap">{formatDate(value)}</span>
);

function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  const [demands, setDemands] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [demandsFilter, setDemandsFilter] = useState({
    Project: [],
    Section: [],
  });
  const [purchaseOrdersFilter, setPurchaseOrdersFilter] = useState({
    Project: [],
    Section: [],
  });
  const [analyticsData, setAnalyticsData] = useState([
    // Initial empty state to avoid undefined errors
    { label: "Total Projects", icon: FaBoxesStacked, count: 0, percentage: 0 },
    { label: "Total Demands", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Total POs Created", icon: NewReleasesOutlined, count: 0, percentage: 0 },
    { label: "Total Amount Paid", icon: NewspaperOutlined, count: 0, percentage: 0 },
    { label: "Balance Amount", icon: CachedSharp, count: 0, percentage: 0 },
  ]);
  // Chart data states
  const [demandBreakdown, setDemandBreakdown] = useState([]);
  const [poDistributionByVendor, setPoDistributionByVendor] = useState([]);
  const [amountByVendor, setAmountByVendor] = useState([]);
  const [financialProgress, setFinancialProgress] = useState([]);
  const [usersByRole, setUsersByRole] = useState([]);

  const demandsColumns = [
    // { headerName: "Id", field: "id" },
    { headerName: "Material", field: "material.name" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Qty", field: "quantity" },
    { headerName: "Date", field: "createdAt" },
    { headerName: "Fulfilled", field: "fulfilled" },
    { headerName: "Created By", field: "creator.name" },
    { headerName: "Project", field: "section.projectName" },
    { headerName: "Section", field: "section.name" },
    { headerName: "Status", field: "status" },
    // { headerName: "Action", field: "demandId" },
  ];
  const purchaseOrdersColumns = [
    // { headerName: "Demand ID", field: "demandId" },
    { headerName: "Project Name", field: "project" },
    { headerName: "Demand", field: "demandName" },
    { headerName: "Materials", field: "material" },
    { headerName: "Vendor Name", field: "vendorName" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Status", field: "status" },
    // { headerName: "Assigned Vendors", field: "assingedVendors" },
    // { headerName: "Action", field: "id" },
  ];
  const fetchDemands = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          ...demand,
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
    }
  };

  // Fetch recent purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/purchase-orders");
      if (response.ok) {
        // Map the API response to match the columns
        const data = response.data.data.map((po, index) => ({
          id: po.id,
          // demandId: po.demand?.referenceNumber || "-", 
          project: po.demand?.section?.project?.name || "-",
          demandName: po.demand?.referenceNumber || "-",
          material: po.material?.name || "-",
          section: po.demand?.section?.name || "-",
          vendorName: po.vendor?.name || po.vendorName || "-",
          qty: po.demand?.quantity || "-",
          unit: po.demand?.unit || "-",
          poQty: po.quantity || "-",
          amount: po.totalAmount ? `${po.totalAmount} PKR` : "-",
          status: po.status || "-",
          // assingedVendors: po.vendorId || "-",
        }));
        setPurchaseOrders(data);
      } else {
        toast.error("Failed to fetch Purchase Orders");
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      toast.error("Error fetching purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const demandProjectOptions = [...new Set(demands.map((demand) => demand.section?.projectName).filter(Boolean))];
  const demandSectionOptions = [...new Set(demands.map((demand) => demand.section?.name).filter(Boolean))];
  const demandFiltersConfig = [
    { label: "Project", options: demandProjectOptions },
    { label: "Section", options: demandSectionOptions },
  ];

  const poProjectOptions = [...new Set(purchaseOrders.map((po) => po.project).filter(Boolean))];
  const poSectionOptions = [...new Set(purchaseOrders.map((po) => po.section).filter(Boolean))];
  const poFiltersConfig = [
    { label: "Project", options: poProjectOptions },
    { label: "Section", options: poSectionOptions },
  ];

  const filteredDemands = demands.filter((demand) => {
    const projectName = demand.section?.projectName || "-";
    const sectionName = demand.section?.name || "-";
    const projectMatch =
      !demandsFilter.Project ||
      demandsFilter.Project.length === 0 ||
      demandsFilter.Project.includes(projectName);
    const sectionMatch =
      !demandsFilter.Section ||
      demandsFilter.Section.length === 0 ||
      demandsFilter.Section.includes(sectionName);
    return projectMatch && sectionMatch;
  });

  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    const projectName = po.project || "-";
    const sectionName = po.section || "-";
    const projectMatch =
      !purchaseOrdersFilter.Project ||
      purchaseOrdersFilter.Project.length === 0 ||
      purchaseOrdersFilter.Project.includes(projectName);
    const sectionMatch =
      !purchaseOrdersFilter.Section ||
      purchaseOrdersFilter.Section.length === 0 ||
      purchaseOrdersFilter.Section.includes(sectionName);
    return projectMatch && sectionMatch;
  });

  const handleDemandsFilterChange = (newSelected) => {
    setDemandsFilter(newSelected);
  };

  const handleDemandsFilterClear = () => {
    setDemandsFilter({ Project: [], Section: [] });
  };

  const handlePOFilterChange = (newSelected) => {
    setPurchaseOrdersFilter(newSelected);
  };

  const handlePOFilterClear = () => {
    setPurchaseOrdersFilter({ Project: [], Section: [] });
  };

  // Fetch analytics data for dashboard
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/analytics/admin/dashboard");
      if (response.ok && response.data?.data?.summary) {
        const summary = response.data.data.summary;
        const charts = response.data.data.charts || {};
        setAnalyticsData([
          {
            label: "Total Projects",
            icon: FaBoxesStacked,
            count: formatToK(summary.totalProjects || 0),
            percentage: 0,
            onClick: () => {
              navigate("/admin-dashboard/project-management");
            }
          },
          {
            label: "Total Demands",
            icon: FaHandHoldingHeart,
            count: formatToK(summary.totalDemands || 0),
            percentage: 0,
            onClick: () => {
              navigate("/admin-dashboard/demands");
            }
          },
          {
            label: "Total POs Created",
            icon: NewReleasesOutlined,
            count: formatToK(summary.totalPOsCreated || 0),
            percentage: 0,
            onClick: () => {
              navigate("/admin-dashboard/pOS");
            }
          },
          {
            label: "Total Amount Paid",
            icon: NewspaperOutlined,
            count: formatToK(summary.totalAmountPaid || 0),
            percentage: 0,
            onClick: () => {
              navigate("/admin-dashboard/payables");
            }
          },
          {
            label: "Pending Amount",
            icon: CachedSharp,
            count: formatToK(summary.totalAmountPending || 0),
            percentage: 0,
            onClick: () => {
              navigate("/admin-dashboard/payables");
            }
          },
          {
            label: "Amount Spent",
            icon: NewspaperOutlined,
            count: formatToK(summary.totalAmountSpent || 0),
            percentage: 0,
            onClick: () => {
              navigate("/admin-dashboard/payables");
            }
          },
          {
            label: "Total Vendors",
            icon: PeopleSharp,
            count: summary.totalVendors || 0,
            percentage: 0,
            onClick: () => {
              navigate("/admin-dashboard/vendors");
            }
          },
        ]);
        // Set chart data
        setDemandBreakdown(
          (charts.demandBreakdown || []).map((item) => ({
            label: item.status,
            value: item.count,
          }))
        );
        setPoDistributionByVendor(charts.poDistributionByVendor || []);
        setAmountByVendor(charts.amountByVendor || []);
        setFinancialProgress(charts.financialProgressPerProject || []);
        setUsersByRole(charts.usersByRole || []);
      } else {
        toast.error("Failed to fetch analytics data");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Error fetching analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      await Promise.all([
        fetchAnalytics(),
        fetchDemands(),
        fetchPurchaseOrders()
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Show initial loading spinner
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className=" md:px- w-full">
     
      <TopBar
        title="Admin Dashboard"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <h2 className="text-xl md:text-2xl font-semibold text-primary mt-4">
        Overview
      </h2>

      <div className="border rounded-xl p-4 mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {analyticsData.map((item, index) => (
          <div
            key={index}
            className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300
                     xl:last:after:hidden"
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

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {demandBreakdown && demandBreakdown.length > 0 && (
          <PieGraph pieTitle="Demand Status" data={demandBreakdown} />
        )}
        {poDistributionByVendor && poDistributionByVendor.length > 0 && (
          <div className="flex-1 min-w-[280px]">
            <HorixontalBarchartGraph
              title="PO Distribution by Vendor"
              dataset={poDistributionByVendor}
              series={[{ dataKey: "poCount", label: "PO Count" }]}
            />
          </div>
        )}
        {amountByVendor && amountByVendor.length > 0 && (
          <div className="flex-1 min-w-[280px]">
            <VertcleBarChart
              verTitle="Amount by Vendor"
              dataset={amountByVendor}
              series={[{ dataKey: "totalAmount", label: "Total Amount" }]}
            />
          </div>
        )}
      </div>

      {/* User Role Bar Chart */}
      {usersByRole && usersByRole.length > 0 && (
        <div className="mt-6">
          <BasicBarChart
            title="User Role"
            xAxis={usersByRole.map((u) => u.role || "")}
            series={[
              {
                data: usersByRole.map((u) => u.count || 0),
                label: "User Count",
                color: "#1D4ED8"
              }
            ]}
          />
        </div>
      )}

     
      {financialProgress && financialProgress.length > 0 && (
        <div className="mt-6">
          {/* <h3 className="text-lg font-semibold mb-2">Financial Progress Per Project</h3> */}
          <BasicBarChart
            title="Financial Progress Per Project"
            xAxis={financialProgress.map((p) => p.projectName || "")}
            series={[
              { data: financialProgress.map((p) => p.total || 0), label: "Total Amount", color: "#1D4ED8" },
              { data: financialProgress.map((p) => p.paid || 0), label: "Paid", color: "#FDBA74" },
              { data: financialProgress.map((p) => p.balance || 0), label: "Balance", color: "#EF4444" },
            ]}
          />
        </div>
      )}

      <div className="overflow-x-auto mt-8">
        <TopBar title="Recent Demands" />
        <div className="my-4 flex justify-end">
          <CustomFilterDropdown
            filters={demandFiltersConfig}
            selected={demandsFilter}
            onChange={handleDemandsFilterChange}
            onClear={handleDemandsFilterClear}
            placeholder="Filter by project or section"
            dropdownAlign="right"
          />
        </div>
        <SimpleTable columns={demandsColumns} data={filteredDemands} cellComponents={{ status: StatusChip, createdAt: DateCell }} />
      </div>
      <div className="overflow-x-auto mt-8">
        <TopBar title="Recent POs" />
        <div className="my-4 flex justify-end">
          <CustomFilterDropdown
            filters={poFiltersConfig}
            selected={purchaseOrdersFilter}
            onChange={handlePOFilterChange}
            onClear={handlePOFilterClear}
            placeholder="Filter by project or section"
            dropdownAlign="right"
          />
        </div>
        <SimpleTable columns={purchaseOrdersColumns} data={filteredPurchaseOrders} cellComponents={{ status: StatusChip }} />
      </div>
    </div>
  );
}

export default AdminDashboard;
