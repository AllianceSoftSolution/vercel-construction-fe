import React, { useState } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { MdDelete } from "react-icons/md";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";

const CmPurchaseOrderDetail = () => {
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

  const CustomActionComponent = () => {
    return (
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
  };

  return (
    <div className="p-4">
      <TopBar title="Purchase Order Detail Page" detail="lorem ipsum dolor sit amet" />

      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <p className="text-[#444444] font-semibold text-xl">Order Name Here</p>
          <div className="flex flex-wrap gap-2">
            <div className="text-white bg-[#BF1017] px-6 py-2 rounded-full text-center">Partial</div>
            <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full" />

        <div className="flex flex-wrap gap-4">
          <InfoItem label="Demand ID:" value="demand id" />
          <InfoItem label="Demand Name:" value="demand name" />
          <InfoItem label="Project" value="project" />
          <InfoItem label="Section" value="section" />
          <InfoItem label="Material" value="material" />
        </div>

        <div className="flex flex-wrap gap-4">
          <InfoItem label="Quantity:" value="quantity" />
          <InfoItem label="Unit" value="unit" />
          <InfoItem label="PO Quantity" value="po quantity" />
          <InfoItem label="Assinged Vendor" value="assigned vendor" />
          <InfoItem label="Vendor Phone No" value="phone no" />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-[#444444] font-semibold text-xl">Store Sync Status</h4>
        <p className="text-[#979797]">lorem ipsum dolor sit amet </p>
        <div className="overflow-x-auto">
          <SimpleTable
            data={data}
            columns={columns}
            cellComponents={{ action: CustomActionComponent }}
          />
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-[#444444] font-semibold text-xl">Finance</h4>
        <p className="text-[#979797]">lorem ipsum dolor sit amet </p>
        <div className="overflow-x-auto">
          <SimpleTable
            data={data}
            columns={columns}
            cellComponents={{ action: CustomActionComponent }}
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <p className="text-[#444444] font-semibold text-base sm:text-xl">{label}</p>
    <p className="text-[#979797] text-base sm:text-lg">{value}</p>
  </div>
);

export default CmPurchaseOrderDetail;
