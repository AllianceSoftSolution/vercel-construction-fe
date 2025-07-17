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
} from "@mui/icons-material";
import Divider from "../../../components/Divider";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";
import Loader from "../../../components/ui/Loader";

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

  const columns = [
    { headerName: "Id", field: "id" },
    { headerName: "Material Id", field: "materialId" },
    { headerName: "Qty", field: "quantity" },
    { headerName: "Unit", field: "unit" },
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
        const data = response.data.data.map((po) => ({
          id: po.id,
          materialId: po.materialId,
          quantity: po.quantity,
          unit: po.demand?.unit || "-",
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
            label: "Balance Amount",
            icon: CachedSharp,
            count: summary.totalAmountPending || 0,
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
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      {/* <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div> */}

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
          <SimpleTable columns={columns} data={demands} cellComponents={{}} />
        )}
      </div>
      <div className="overflow-x-auto mt-8">
        <TopBar title="Recent POs" />
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable columns={columns} data={purchaseOrders} cellComponents={{}} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
