import React from "react";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import SimpleTable from "../../../components/SimpleTable";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import PieGraph from "../../../components/ui/Graphs/PieGraph";
import BasicBarChart from "../../../components/ui/Graphs/BasicBarChart";
import HorixontalBarchartGraph from "../../../components/ui/Graphs/HorixontalBarchartGraph";
import { useEffect } from "react";
import { useState } from "react";
import  apiClient  from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import { IconButton, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDateDMY } from '../../../utils';

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

function PmDashboard() {
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);

  // Analytics and chart data states
  const [analyticsData, setAnalyticsData] = useState([
    { label: "Total Projects", icon: FaBoxesStacked, count: 0, percentage: 0 , onClick: () => navigate("/pm-dashboard/project-management")},
    { label: "Total Demands", icon: FaHandHoldingHeart, count: 0, percentage: 0 , onClick: () => navigate("/pm-dashboard/demands")},
    { label: "Total POs Created", icon: FaHandHoldingHeart, count: 0, percentage: 0 , onClick: () => navigate("/pm-dashboard/purchase-orders")},
  ]);
  const [demandBreakdown, setDemandBreakdown] = useState([]);
  const [amountByVendor, setAmountByVendor] = useState([]);

  const columns = [
    { headerName: "Ref No", field: "refNo" },
    { headerName: "Project Name", field: "project" },
    { headerName: "Material", field: "material" },
    { headerName: "Section", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Status", field: "status" },
    { headerName: "CM Name", field: "cmName" },
    { headerName: "Date", field: "date" },
  ];

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get("analytics/project-manager/dashboard");
      if (response.ok && response.data?.data?.summary) {
        const summary = response.data.data.summary;
        const charts = response.data.data.charts || {};
        setAnalyticsData([
          { label: "Total Projects", icon: FaBoxesStacked, count: summary.totalProjects || 0, percentage: 0 , onClick: () => navigate("/project-manager-dashboard/project-management")},
          { label: "Total Demands", icon: FaHandHoldingHeart, count: summary.totalDemands || 0, percentage: 0 , onClick: () => navigate("/project-manager-dashboard/demands")},
          { label: "Total POs Created", icon: FaHandHoldingHeart, count: summary.totalPOsCreated || 0, percentage: 0 , onClick: () => navigate("/project-manager-dashboard/pOS")},
        ]);
        setDemandBreakdown((charts.demandBreakdown || []).map((item) => ({ label: item.status, value: item.count })));
        setAmountByVendor(charts.amountByVendor || []);
      } else {
        toast.error("Failed to fetch analytics data");
      }
    } catch (error) {
      toast.error("Error fetching analytics data");
      console.error(error);
    }
  };

  const fetchDemand = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          refNo: demand.referenceNumber || `REF-${index + 1}`,
          project: demand.section?.projectName || "N/A",
          material: demand.material?.name || "N/A",
          section: demand.section?.name || "N/A",
          qty: demand.quantity || "N/A",
          unit: demand.unit || "N/A",
          status: demand.status || "N/A",
          cmName: demand.creator?.name || "N/A",
          date: demand.createdAt ? formatDateDMY(demand.createdAt) : "N/A",
        }));
        setDemands(data);
      } else {
        toast.error("Failed to fetch demands");
      }
    } catch (error) {
      toast.error("Error fetching demands");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchDemand();
  }, []);

  return (
    <div className="h-full">
      <TopBar
        title="Project-Manager Dashboard"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <h2 className="text-2xl font-semibold text-primary">Overview</h2>

      <div className="border rounded-xl p-4 mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {analyticsData.map((item, index) => (
          <div
            key={index}
            className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 xl:last:after:hidden"
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

      <div className="flex flex-col xl:flex-row gap-6 mt-6 flex-wrap">
        <div className="flex  flex-col lg:flex-row gap-6 flex-1 w-full xl:w-2/3">
          <PieGraph pieTitle={"Demand Status"} data={demandBreakdown} />
          <HorixontalBarchartGraph
            title={"Amount by Vendor"}
            dataset={amountByVendor}
            series={[{ dataKey: "totalAmount", label: "Total Amount" }]}
          />
        </div>
        {/* <div className="flex-1 w-full xl:w-1/3 min-w-[300px]">
          <BasicBarChart />
        </div> */}
      </div>

      <div className="overflow-x-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable columns={columns} data={demands} cellComponents={{ status: StatusChip }} />
        )}
      </div>
    </div>
  );
}

export default PmDashboard;
