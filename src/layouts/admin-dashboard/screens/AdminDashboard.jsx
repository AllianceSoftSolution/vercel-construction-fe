import React from "react";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiExport } from "react-icons/ci";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaToolbox } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import CustomCardComponent from "../../../mui/CustomCardComponent";
import CustomTable from "../../../mui/CustomTable";
import SimpleTable from "../../../components/SimpleTable";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
function AdminDashboard() {
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
    <div className="md:px-2 mx-2 h-full md:mx-0 ">
      {/* Header */}
      <TopBar
        title="Admin Dashboard"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <h2 className="text-2xl font-semibold text-primary ">Overview</h2>

      <div className="border-[0.5px] mt-4 border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnalyticsCard
          label={"Total Projects"}
          icon={IoMdArrowDropdown}
          count={10}
          percentage={10}
        />
        <AnalyticsCard
          label={"Approved Demands"}
          icon={IoMdArrowDropdown}
          count={10}
          percentage={10}
        />
        <AnalyticsCard
          label={"Rejected Demands"}
          icon={IoMdArrowDropdown}
          count={10}
          percentage={10}
        />
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 mt-4">Recent Demands</h2>
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
      {/* <div>
        <h2 className="text-xl font-bold mb-4">Recent POs</h2>
        <CustomTable columns={columns} data={data} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Invoices Awaiting Payment</h2>
        <CustomTable columns={columns} data={data} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Store Updates</h2>
        <CustomTable columns={columns} data={data} />
      </div> */}
    </div>
  );
}

export default AdminDashboard;
