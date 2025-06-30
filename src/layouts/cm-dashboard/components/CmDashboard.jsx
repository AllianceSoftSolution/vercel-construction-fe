import React from "react";
import {
  FaBoxesStacked,
  FaEye,
  FaHandHoldingHeart,
  FaTrash,
} from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiExport } from "react-icons/ci";
import { FaToolbox, FaUserEdit } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import PieGraph from "../../../components/ui/Graphs/PieGraph";
import HorixontalBarchartGraph from "../../../components/ui/Graphs/HorixontalBarchartGraph";
import SimpleTable from "../../../components/SimpleTable";
import SectionCard from "../../../components/ui/SectionCard";
import { useNavigate } from "react-router-dom";

function CmDashboard() {
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

  const navigate = useNavigate();
  const actions = [
    // {
    //   label: "View Section Detail",
    //   icon: <FaEye />,
    //   onClick: () => navigate("/construction-manager-dashboard/sections/23232"),
    // },
    {
      label: "Edit Project Section",
      icon: <FaUserEdit />,
      onClick: () => console.log("Edit clicked"),
    },
    {
      label: "Delete Project Section",
      icon: <FaTrash />,
      onClick: () => console.log("Delete clicked"),
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

  const projectStats = [
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
    <div className="">
      <TopBar
        title="Construction Manager"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />

      <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>

      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projectStats.map((item, index) => {
          return (
            <div
              key={index}
              className={`relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-[#E0E0E0] `}
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

      <div className="mt-6 flex flex-col  lg:flex-row gap-6">
        <PieGraph />

        <HorixontalBarchartGraph title={"Fulfillment Progress"} />
      </div>
      <SectionCard
        sectionNo="01"
        sectionName="Piles"
        totalDemands="14"
        manager="Imran"
        linkedStores="01"
        dropdownActions={actions}
      />

      <div className="overflow-x-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
    </div>
  );
}

export default CmDashboard;
