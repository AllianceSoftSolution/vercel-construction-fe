import React, { useEffect, useState } from "react";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import SimpleTable from "../../../components/SimpleTable";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import { PieChart } from "@mui/x-charts/PieChart";
import VertcleBarChart from "../../../components/ui/Graphs/VerticleBarChart";
import Loader from "../../../components/ui/Loader";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import { Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDateDMY, formatToK } from '../../../utils';
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";

function AccountantDashboard() {
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [demandsFilter, setDemandsFilter] = useState({
    Project: [],
    Section: [],
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Analytics and chart data states
  const [analyticsData, setAnalyticsData] = useState([
    { label: "Total Vendors", icon: FaBoxesStacked, count: 0, percentage: 0 },
    { label: "Total Amount Spent", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Total Amount Pending", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Total Amount Paid", icon: FaHandHoldingHeart, count: 0, percentage: 0, countColor: "#22c55e" },
    { label: "Assigned Sections", icon: FaBoxesStacked, count: 0, percentage: 0 },
  ]);
  const [topVendorAccounts, setTopVendorAccounts] = useState([]);
  const [demandBreakdown, setDemandBreakdown] = useState([]);

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
        sx={{ backgroundColor: color, color: "#fff" }}
        size="small"
      />
    );
  };

  const fetchAnalytics = async () => {
    try {
      const response = await apiClient.get("/analytics/accountant/dashboard");
      if (response.ok && response.data?.data?.summary) {
        const { summary, charts, topVendorAccounts: topVA } = response.data.data;
        setAnalyticsData([
          { label: "Total Vendors", icon: FaBoxesStacked, count: formatToK(summary.totalVendors || 0), percentage: 0 },
          { label: "Total Amount Spent", icon: FaHandHoldingHeart, count: formatToK(summary.totalAmountSpent || 0), percentage: 0 , onClick: () => navigate("/accountant-dashboard/payables")},
          { label: "Total Amount Pending", icon: FaHandHoldingHeart, count: formatToK(summary.totalAmountPending || 0), percentage: 0 , onClick: () => navigate("/accountant-dashboard/payables")},
          { label: "Total Amount Paid", icon: FaHandHoldingHeart, count: formatToK(summary.totalAmountPaid || 0), percentage: 0 , onClick: () => navigate("/accountant-dashboard/payables"), countColor: "#22c55e"},
          { label: "Assigned Sections", icon: FaBoxesStacked, count: formatToK(summary.assignedSections || 0), percentage: 0 },
        ]);
        setTopVendorAccounts(topVA || []);
        setDemandBreakdown(
          (charts?.demandBreakdown || []).map((item) => ({
            label: item.status,
            value: item.count,
            color: statusColorMap[item.status] || statusColorMap.default,
          }))
        );
      } else {
        toast.error("Failed to fetch analytics data");
      }
    } catch (error) {
      toast.error("Error fetching analytics data");
      console.error(error);
    }
  };

  const fetchDemands = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          refNo: demand.referenceNumber,
          project: demand.section?.projectName || "-",
          material: demand.material?.name || "-",
          section: demand.section?.name || "-",
          qty: demand.quantity,
          status: demand.status,
          cmName: demand.creator?.name || "-",
          date: demand.createdAt ? formatDateDMY(demand.createdAt) : "-",
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

  const projectOptions = [...new Set(demands.map((demand) => demand.project).filter(Boolean))];
  const sectionOptions = [...new Set(demands.map((demand) => demand.section).filter(Boolean))];

  const demandFilters = [
    { label: "Project", options: projectOptions },
    { label: "Section", options: sectionOptions },
  ];

  const handleDemandFilterChange = (newSelected) => {
    setDemandsFilter(newSelected);
  };

  const handleDemandFilterClear = () => {
    setDemandsFilter({
      Project: [],
      Section: [],
    });
  };

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

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <TopBar
        title="Accountant Dashboard"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>

      <div className=" border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {analyticsData.map((item, index) => {
          return (
            <div
              key={index}
              className={`relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 `}
            >
              <AnalyticsCard
                label={item.label}
                icon={item.icon}
                count={item.count}
                percentage={item.percentage}
                onClick={item.onClick}
                countColor={item.countColor}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        {/* Demand Status Donut Chart */}
        <div className="border rounded-xl p-5 flex flex-col min-w-[280px]">
          <h3 className="text-lg font-semibold text-primary mb-4">Demand Status</h3>
          {demandBreakdown.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No demand data available</p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <PieChart
                series={[
                  {
                    paddingAngle: 3,
                    innerRadius: 50,
                    outerRadius: 80,
                    cornerRadius: 8,
                    data: demandBreakdown,
                  },
                ]}
                width={200}
                height={200}
                hideLegend
              />
              <ul className="w-full space-y-2">
                {demandBreakdown.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700">
                        {item.label.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <VertcleBarChart
          verTitle="Top Vendor Balances"
          dataset={topVendorAccounts.map(v => ({ vendorName: v.vendorName, balance: Number(v.balance) }))}
          series={[{ dataKey: "balance", label: "Balance" }]}
        />
      </div>

      <div className="overflow-x-auto mt-10">
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
        <SimpleTable columns={columns} data={filteredDemands} cellComponents={{ status: StatusChip }} />
      </div>
    </div>
  );
}

export default AccountantDashboard;
