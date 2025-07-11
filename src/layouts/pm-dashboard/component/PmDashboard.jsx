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

function PmDashboard() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const data = [
    {
      id: 1,
      refNo: "REF-001",
      project: "Bridge Construction",
      material: "Cement",
      section: "A1",
      qty: 120,
      status: "Pending",
      cmName: "Ahmed Raza",
      date: "2025-06-15",
    },
    {
      id: 2,
      refNo: "REF-002",
      project: "Highway Expansion",
      material: "Steel",
      section: "B2",
      qty: 250,
      status: "Approved",
      cmName: "Fatima Khan",
      date: "2025-06-14",
    },
    {
      id: 3,
      refNo: "REF-003",
      project: "Metro Rail",
      material: "Concrete",
      section: "C3",
      qty: 300,
      status: "In Progress",
      cmName: "Hassan Ali",
      date: "2025-06-13",
    },
  ];

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

  const analyticsData = [
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
  ];

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
          date: demand.createdAt ? new Date(demand.createdAt).toLocaleDateString() : "N/A",
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
    fetchDemand();
  }, []);

  return (
    <div className="h-full">
      <TopBar
        title="Project-Manager Dashboard"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <h2 className="text-2xl font-semibold text-primary">Overview</h2>

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

      <div className="flex flex-col xl:flex-row gap-6 mt-6 flex-wrap">
        <div className="flex  flex-col lg:flex-row gap-6 flex-1 w-full xl:w-2/3">
          <PieGraph pieTitle={"Demand Status"} />

          <HorixontalBarchartGraph title={"PO Distribution by Vendor"} />
        </div>

        <div className="flex-1 w-full xl:w-1/3 min-w-[300px]">
          <BasicBarChart />
        </div>
      </div>

      <div className="overflow-x-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <SimpleTable columns={columns} data={demands} cellComponents={{}} />
      </div>
    </div>
  );
}

export default PmDashboard;
