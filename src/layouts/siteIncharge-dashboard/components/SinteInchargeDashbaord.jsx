import React from "react";
// import { FaBoxesStacked, FaHandHoldingHeart } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import PieGraph from "../../../components/ui/Graphs/PieGraph";
import VertcleBarChart from "../../../components/ui/Graphs/VerticleBarChart";
import HorixontalBarchartGraph from "../../../components/ui/Graphs/HorixontalBarchartGraph";
import BasicBarChart from "../../../components/ui/Graphs/BasicBarChart";
import SimpleTable from "../../../components/SimpleTable";
import { FaBoxesStacked, FaHandHoldingHeart } from "react-icons/fa6";

function SinteInchargeDashbaord() {
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

  const data2 = [
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
    { headerName: "Projects", field: "project" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Status", field: "status" },
    { headerName: "CM Name", field: "cmName" },
    { headerName: "Date", field: "date" },
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

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 w-full">
      <TopBar
        title="Site-Incharge Dashboard"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <h2 className="text-2xl font-semibold text-primary">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        <AnalyticsCard
          label={"Total Projects"}
          icon={FaBoxesStacked}
          count={10}
          percentage={10}
        />
        <AnalyticsCard
          label={"Approved Demands"}
          icon={FaHandHoldingHeart}
          count={10}
          percentage={10}
        />
        <AnalyticsCard
          label={"Rejected Demands"}
          icon={FaHandHoldingHeart}
          count={10}
          percentage={10}
        />
        <AnalyticsCard
          label={"Store Synced"}
          icon={IoStorefrontSharp}
          count={5}
          percentage={8}
        />
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
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
      <div className="overflow-x-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Recent POs</h2>
        <SimpleTable columns={columns2} data={data2} cellComponents={{}} />
      </div>
    </div>
  );
}

export default SinteInchargeDashbaord;
