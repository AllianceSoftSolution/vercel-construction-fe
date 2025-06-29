import React from "react";
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

function AdminDashboard() {
  const analyticsData = [
    {
      label: "Total Projects",
      icon: FaBoxesStacked,
      count: 2132,
      percentage: 10.25,
    },
    {
      label: "Approved Demands",
      icon: FaHandHoldingHeart,
      count: 2132,
      percentage: 10.25,
    },
    {
      label: "Rejected Demands",
      icon: IoTabletLandscape,
      count: 2132,
      percentage: 10.25,
    },
    {
      label: "Total POs Created",
      icon: NewReleasesOutlined,
      count: 2132,
      percentage: 10.25,
    },
    {
      label: "Total Amount Paid",
      icon: NewspaperOutlined,
      count: 2132,
      percentage: 10.25,
    },
    {
      label: "Balance Amount",
      icon: CachedSharp,
      count: 2132,
      percentage: 10.25,
    },
  ];

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

  return (
    <div className="p-4 md:px-6 w-full">
      <TopBar
        title="Admin Dashboard"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <h2 className="text-xl md:text-2xl font-semibold text-primary">
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
        <div className="flex-1 min-w-[280px]">
          <PieGraph pieTitle="Demand Status" />
        </div>
        <div className="flex-1 min-w-[280px]">
          <HorixontalBarchartGraph title="PO Distribution by Vendor" />
        </div>
        <div className="flex-1 min-w-[280px]">
          <VertcleBarChart verTitle="Top 5 Requested Material" />
        </div>
      </div>

      <div className="mt-6">
        <BasicBarChart />
      </div>

      <div className="overflow-x-auto mt-8">
        <TopBar title="Recent Demands" />
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
      <div className="overflow-x-auto mt-8">
        <TopBar title="Recent POs" />
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
    </div>
  );
}

export default AdminDashboard;
