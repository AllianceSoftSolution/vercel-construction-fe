import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import manager from "../../../../assets/construction/manager.png";
import { FaWhatsapp } from "react-icons/fa";
import flag from "../../../../assets/construction/flag.jpg";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaBoxesStacked } from "react-icons/fa6";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import SimpleTable from "../../../../components/SimpleTable";

const MemberDetailPage = () => {
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
    <div>
      <TopBar title="Vendor" />
      <div className="h-[1px] w-full bg-[#CDCDCD] mt-2"></div>
      <div className="flex ">
        <div className="h-fit w-[30%] border-[0.5px] border-[#CDCDCD] rounded-xl p-2 mt-16 ">
          <div className="mt-2 flex flex-col p-2">
            <div>
              <h3 className="text-black font-semibold">Company Name</h3>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Vendor Name</p>
              <p>Hassan</p>
            </div>{" "}
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Email</p>
              <p>example@gmail.com</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Phone Number</p>
              <p>90909090</p>
            </div>{" "}
            <div className="flex justify-between">
              <p className="font-semibold text-[#979797]">Address</p>
              <p>Lahore, Pakistan</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[70%] mt-2 p-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-[#BF1017] mt-4">
              OverView
            </h3>
            <div className="flex gap-x-2">
              <MdDelete
                // onClick={onDelete}
                className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
              />
              <MdEdit
                // onClick={onEdit}
                className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
              />
            </div>
          </div>
          <div className="border-[0.5px] mt-4 border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnalyticsCard
              label={"Total Projects "}
              icon={FaBoxesStacked}
              count={10}
              // percentage={10}
            />
          </div>
        </div>
      </div>{" "}
      <div>
        <h3 className="text-xl font-semibold text-[#BF1017] mt-4">
          Recent Purchase Order{" "}
        </h3>
        <SimpleTable data={data} columns={columns} cellComponents={{}} />
      </div>
    </div>
  );
};

export default MemberDetailPage;
