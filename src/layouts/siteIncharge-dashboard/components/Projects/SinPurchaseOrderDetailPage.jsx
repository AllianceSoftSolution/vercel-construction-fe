import React, { useState } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { MdDelete } from "react-icons/md";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";

const SinPurchaseOrderDetailPage = () => {
  const data = [
    { id: 1, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
    { id: 2, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
    { id: 3, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
  ];

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Created Demand", field: "createdDemand" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];

  const CustomActionComponent = () => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "Edit",
          onClick: () => alert("Edit"),
          icon: <FaUserEdit />,
        },
        {
          label: "Delete ",
          onClick: () => alert("Delete"),
          icon: <FaTrash />,
        },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  return (
    <div className="px-4 md:px-6 py-4">
      <TopBar
        title="Purchase Order Detail Page"
        detail="lorem ipsum dolor sit amet"
      />

      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[#444444] font-semibold text-lg md:text-xl">
            Order Name Here
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="text-white bg-[#BF1017] px-6 py-2 rounded-full text-sm">
              Partial
            </div>
            {/* <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" /> */}
          </div>
        </div>

        <div className="border-t border-[#CDCDCD]"></div>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Info label="Demand ID" value="demand id" />
          <Info label="Demand Name" value="demand name" />
          <Info label="Project" value="project" />
          <Info label="Section" value="section" />
          <Info label="Material" value="material" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Info label="Quantity" value="quantity" />
          <Info label="Unit" value="unit" />
          <Info label="PO Quantity" value="po quantity" />
          <Info label="Assigned Vendor" value="assigned vendor" />
          <Info label="Vendor Phone No" value="phone no" />
        </div>
      </div>

      {/* Tables */}
      <div className="mt-8">
        <h4 className="text-[#444444] font-semibold text-lg md:text-xl">
          Store Sync Status
        </h4>
        <p className="text-[#979797] text-sm">lorem ipsum dolor sit amet</p>
        <SimpleTable
          data={data}
          columns={columns}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>

      <div className="mt-8">
        <h4 className="text-[#444444] font-semibold text-lg md:text-xl">
          Finance
        </h4>
        <p className="text-[#979797] text-sm">lorem ipsum dolor sit amet</p>
        <SimpleTable
          data={data}
          columns={columns}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[#444444] font-semibold text-sm sm:text-base">
      {label}:
    </p>
    <p className="text-[#979797] text-sm">{value}</p>
  </div>
);

export default SinPurchaseOrderDetailPage;
