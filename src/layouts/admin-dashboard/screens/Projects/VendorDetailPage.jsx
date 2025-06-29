import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaBoxesStacked } from "react-icons/fa6";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import SimpleTable from "../../../../components/SimpleTable";

const VendorDetailPage = () => {
  const data = [
    {
      id: 1,
      po: "1",
      projectName: "Bridge Construction",
      projectCode: 9909,
      section: "A1",
      materialSupplied: 120000,
      poRef: "PO-001",
      poQty: "20 bags",
      deliveryDate: "2025-06-15",
      status: "Pending",
    },
    {
      id: 2,
      po: "1",
      projectName: "Bridge Construction",
      projectCode: 9909,
      section: "A1",
      materialSupplied: 120000,
      poRef: "PO-001",
      poQty: "20 bags",
      deliveryDate: "2025-06-15",
      status: "Pending",
    },
    {
      id: 3,
      po: "1",
      projectName: "Bridge Construction",
      projectCode: 9909,
      section: "A1",
      materialSupplied: 120000,
      poRef: "PO-001",
      poQty: "20 bags",
      deliveryDate: "2025-06-15",
      status: "Pending",
    },
  ];

  const columns = [
    { headerName: "PO", field: "po" },
    { headerName: "Project Name", field: "projectName" },
    { headerName: "Project Code", field: "projectCode" },
    { headerName: "Section", field: "section" },
    { headerName: "Material Supplied", field: "materialSupplied" },
    { headerName: "PO Ref", field: "poRef" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Delivery Date", field: "deliveryDate" },
    { headerName: "Status", field: "status" },
  ];

  return (
    <div className="px-4 py-2">
      <TopBar title="Vendor" />
      <div className="h-[1px] w-full bg-[#CDCDCD] mt-2" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {/* Left Card */}
        <div className="border-[0.5px] border-[#CDCDCD] rounded-xl p-4 bg-white">
          <h3 className="text-black font-semibold mb-4">Company Name</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Vendor Name</p>
              <p>Hassan</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Email</p>
              <p>example@gmail.com</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Phone Number</p>
              <p>90909090</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Address</p>
              <p>Lahore, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="md:col-span-2 flex flex-col bg-white p-4 rounded-xl border-[0.5px] border-[#CDCDCD]">
          <div className="flex justify-between items-start flex-wrap">
            <h3 className="text-xl font-semibold text-[#BF1017]">Overview</h3>
            <div className="flex gap-x-2 mt-2 md:mt-0">
              <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
              <MdEdit className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <AnalyticsCard
              label="Total Projects"
              icon={FaBoxesStacked}
              count={10}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-[#BF1017] mb-4">
          Recent Purchase Order
        </h3>
        <div className="overflow-x-auto">
          <SimpleTable data={data} columns={columns} cellComponents={{}} />
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
