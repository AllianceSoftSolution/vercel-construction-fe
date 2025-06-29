import React from "react";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import SimpleTable from "../../../components/SimpleTable";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import PieGraph from "../../../components/ui/Graphs/PieGraph";
import VertcleBarChart from "../../../components/ui/Graphs/VerticleBarChart";

function AccountantDashboard() {
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
    { headerName: "Projects", field: "project" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
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

  return (
    <div className="px-1 md:px-5 lg:px-6 py-4 w-full h-full overflow-y-auto">
      <TopBar
        title="Accountant Dashboard"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <div className="w-full lg:w-1/3">
          <PieGraph pieTitle="Payable" />
        </div>
        <div className="w-full lg:w-2/3">
          <VertcleBarChart verTitle="Fulfillment Progress" />
        </div>
      </div>

      <div className="overflow-x-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
    </div>
  );
}

export default AccountantDashboard;
