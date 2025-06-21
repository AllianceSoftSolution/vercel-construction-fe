import React from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";

const Payables = () => {
  const data = [
    {
      id: 1,
      poRefer: "PO-001",
      project: "Bridge Construction",
      demand: "Cement",
      section: "A1",
      qty: 120,
      payables: "Pending",
      amount: 12000,
      vendors: "Qurrat",
    },
    {
      id: 2,
      poRefer: "PO-002",
      project: "Highway Expansion",
      demand: "Steel",
      section: "B2",
      qty: 250,
      status: "Approved",
      amount: 13000,
      vendors: "Ahmad",
    },
    {
      id: 3,
      poRefer: "PO-003",
      project: "Metro Rail",
      demand: "Concrete",
      section: "C3",
      qty: 300,
      payables: "In Progress",
      amount: 12345,
      vendors: "Hassan",
    },
  ];
  const columns = [
    { headerName: "PO Ref", field: "poRefer" },
    { headerName: "Projects", field: "project" },
    { headerName: "Demands", field: "demand" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty Received", field: "qty" },
    { headerName: "Payables", field: "payables" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Vendors", field: "vendors" },
  ];
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        title="Payables"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        showFilter={true}
        filterOptions={["Assinged", "Not-Assinged"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
      />
      <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        <AnalyticsCard
          label={"Total Payables"}
          icon={IoMdArrowDropdown}
          count={120000}
          // percentage={10}
        />
        <AnalyticsCard
          label={"Total Paid"}
          icon={IoMdArrowDropdown}
          count={250000}
          // percentage={10}
        />
        <AnalyticsCard
          label={"Total Balance Remaining"}
          icon={IoMdArrowDropdown}
          count={1900000}
          // percentage={10}
        />
      </div>

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
    </div>
  );
};

export default Payables;
