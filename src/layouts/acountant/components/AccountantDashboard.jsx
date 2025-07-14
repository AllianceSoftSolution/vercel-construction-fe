import React, { useEffect, useState } from "react";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import SimpleTable from "../../../components/SimpleTable";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import PieGraph from "../../../components/ui/Graphs/PieGraph";
import VertcleBarChart from "../../../components/ui/Graphs/VerticleBarChart";
import Loader from "../../../components/ui/Loader";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

function AccountantDashboard() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Analytics and chart data states
  const [analyticsData, setAnalyticsData] = useState([
    { label: "Total Vendors", icon: FaBoxesStacked, count: 0, percentage: 0 },
    { label: "Total Amount Spent", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Total Amount Pending", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Total Amount Paid", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Assigned Sections", icon: FaBoxesStacked, count: 0, percentage: 0 },
  ]);
  const [topVendorAccounts, setTopVendorAccounts] = useState([]);

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
      const response = await apiClient.get("/analytics/accountant/dashboard");
      if (response.ok && response.data?.data?.summary) {
        const summary = response.data.data.summary;
        setAnalyticsData([
          { label: "Total Vendors", icon: FaBoxesStacked, count: summary.totalVendors || 0, percentage: 0 },
          { label: "Total Amount Spent", icon: FaHandHoldingHeart, count: summary.totalAmountSpent || 0, percentage: 0 },
          { label: "Total Amount Pending", icon: FaHandHoldingHeart, count: summary.totalAmountPending || 0, percentage: 0 },
          { label: "Total Amount Paid", icon: FaHandHoldingHeart, count: summary.totalAmountPaid || 0, percentage: 0 },
          { label: "Assigned Sections", icon: FaBoxesStacked, count: summary.assignedSections || 0, percentage: 0 },
        ]);
        setTopVendorAccounts(response.data.data.topVendorAccounts || []);
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
          date: demand.createdAt ? new Date(demand.createdAt).toLocaleDateString() : "-",
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
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
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
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <PieGraph pieTitle="Payable" data={[]} />
        <VertcleBarChart
          verTitle="Top Vendor Balances"
          dataset={topVendorAccounts.map(v => ({ vendorName: v.vendorName, balance: Number(v.balance) }))}
          series={[{ dataKey: "balance", label: "Balance" }]}
        />
      </div>

      <div className="overflow-x-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <SimpleTable columns={columns} data={demands} cellComponents={{}} />
      </div>
    </div>
  );
}

export default AccountantDashboard;
