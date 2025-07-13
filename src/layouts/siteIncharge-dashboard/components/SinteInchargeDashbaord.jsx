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


function SinteInchargeDashbaord() {
  const [demands, setDemands] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loadingDemands, setLoadingDemands] = useState(false);
  const [loadingPurchaseOrders, setLoadingPurchaseOrders] = useState(false);

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
  const dashboardStats = [
    {
      label: "Total Projects",
      icon: FaBoxesStacked,
      count: 10,
      percentage: 10,
    },
    {
      label: "Approved Demands",
      icon: FaHandHoldingHeart,
      count: 10,
      percentage: 10,
    },
    {
      label: "Rejected Demands",
      icon: FaHandHoldingHeart,
      count: 10,
      percentage: 10,
    },
    {
      label: "Store Synced",
      icon: IoStorefrontSharp,
      count: 5,
      percentage: 8,
    },
  ];

  const columns2 = [
    { headerName: "Ref No", field: "refNo" },
    { headerName: "Projects", field: "project" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Status", field: "status" },
    { headerName: "CM Name", field: "cmName" },
    { headerName: "Date", field: "date" },
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
          date: new Date(demand.createdAt).toLocaleDateString(),
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
          refNo: po.referenceNumber,
          project: po.demand?.section?.project?.name || po.section?.project?.name || "-",
          material: po.material?.name || "-",
          section: po.section?.name || "-",
          qty: po.quantity,
          status: po.status,
          cmName: po.demand?.creator?.name || "-",
          date: new Date(po.createdAt).toLocaleDateString(),
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

  useEffect(() => {
    fetchDemands();
    fetchPurchaseOrders();
  }, []);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 w-full">
      <TopBar
        title="Site-Incharge Dashboard"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
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
            />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PieGraph pieTitle={"Demand Status"} />
        <HorixontalBarchartGraph title={"PO Distribution by Vendor"} />
        <VertcleBarChart verTitle={"Top 5 Requested Materials"} />
      </div>

      <div className="mt-8">
        <BasicBarChart />
      </div>

      <div className="overflow-x-auto mt-8">  
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        {loadingDemands ? (
          <Loader />
        ) : (
          <SimpleTable columns={columns} data={demands} cellComponents={{}} />
        )}
      </div>
      <div className="overflow-x-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Recent POs</h2>

        {loadingPurchaseOrders ? (
          <Loader />
        ) : (
          <SimpleTable columns={columns2} data={purchaseOrders} cellComponents={{}} />
        )}
      </div>
    </div>
  );
}

export default SinteInchargeDashbaord;
