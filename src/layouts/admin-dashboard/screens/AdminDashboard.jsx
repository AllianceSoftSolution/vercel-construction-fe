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

// Status color mapping for demands and POs
const statusColorMap = {
  APPROVED: "#22c55e", // green
  REJECTED: "#ef4444", // red
  PENDING: "#f59e42", // orange
  PARTIALLY_APPROVED: "#eab308", // yellow
  PO_CREATED: "#8b5cf6", // purple
  FULFILLED: "#0ea5e9", // blue
  // default: "#0252AD", // fallback blue
  COMPLETED: "#22c55e", // green
  PARTIAL: "#eab308", // yellow
  PENDING: "#f59e42", // orange
  REJECTED: "#ef4444", // red
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

function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [demands, setDemands] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
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
          qty: po.demand?.quantity || "-",
          unit: po.demand?.unit || "-",
          poQty: po.quantity || "-",
          amount: po.totalAmount ? `$${po.totalAmount}` : "-",
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
            count: summary.totalProjects || 0,
            percentage: 0,
          },
          {
            label: "Total Demands",
            icon: FaHandHoldingHeart,
            count: summary.totalDemands || 0,
            percentage: 0,
          },
          {
            label: "Total POs Created",
            icon: NewReleasesOutlined,
            count: summary.totalPOsCreated || 0,
            percentage: 0,
          },
          {
            label: "Total Amount Paid",
            icon: NewspaperOutlined,
            count: summary.totalAmountPaid || 0,
            percentage: 0,
          },
          {
            label: "Pending Amount",
            icon: CachedSharp,
            count: summary.totalAmountPending || 0,
            percentage: 0,
          },
          {
            label: "Amount Spent",
            icon: NewspaperOutlined,
            count: summary.totalAmountSpent || 0,
            percentage: 0,
          },
          {
            label: "Total Vendors",
            icon: PeopleSharp,
            count: summary.totalVendors || 0,
            percentage: 0,
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

  useEffect(() => {
    fetchAnalytics();
    fetchDemands();
    fetchPurchaseOrders();
  }, []);
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
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <PieGraph pieTitle="Demand Status" data={demandBreakdown} />
        <div className="flex-1 min-w-[280px]">
          <HorixontalBarchartGraph
            title="PO Distribution by Vendor"
            dataset={poDistributionByVendor}
            series={[{ dataKey: "poCount", label: "PO Count" }]}
          />
        </div>
        <div className="flex-1 min-w-[280px]">
          <VertcleBarChart
            verTitle="Amount by Vendor"
            dataset={amountByVendor}
            series={[{ dataKey: "totalAmount", label: "Total Amount" }]}
          />
        </div>
      </div>

      {/* User Role Bar Chart */}
      {/* <div className="mt-6">
        <BasicBarChart
          xAxis={usersByRole.map((u) => u.role)}
          series={[
            {
              data: usersByRole.map((u) => u.count),
              label: "project manager",
              color: "#1D4ED8"
            },  {
              data: usersByRole.map((u) => u.count),
              label: "Admin",
              color: "#1D4ED8"
            },  {
              data: usersByRole.map((u) => u.count),
              label: "Store Incharge",
              color: "#1D4ED8"
            },  {
              data: usersByRole.map((u) => u.count),
              label: "Accountant",
              color: "#1D4ED8"
            }
          ]}
        />
      </div> */}

     
      <div className="mt-6">
        <BasicBarChart
          xAxis={financialProgress.map((p) => p.projectName)}
          series={[
            { data: financialProgress.map((p) => p.total), label: "Total Amount", color: "#1D4ED8" },
            { data: financialProgress.map((p) => p.paid), label: "Paid", color: "#FDBA74" },
            { data: financialProgress.map((p) => p.balance), label: "Balance", color: "#EF4444" },
          ]}
        />
      </div>

      <div className="overflow-x-auto mt-8">
        <TopBar title="Recent Demands" />
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable columns={demandsColumns} data={demands} cellComponents={{ status: StatusChip }} />
        )}
      </div>
      <div className="overflow-x-auto mt-8">
        <TopBar title="Recent POs" />
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable columns={purchaseOrdersColumns} data={purchaseOrders} cellComponents={{ status: StatusChip }} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
