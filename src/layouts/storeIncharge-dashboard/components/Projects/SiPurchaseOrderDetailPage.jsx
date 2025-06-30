import React, { useState } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { MdDelete } from "react-icons/md";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";

const SiPurchaseOrderDetailPage = () => {
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

  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          { label: "Edit", onClick: () => alert("Edit"), icon: <FaUserEdit /> },
          {
            label: "Delete",
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
    <div className="">
      <TopBar
        title="Purchase Order Detail Page"
        detail="lorem ipsum dolor sit amet"
      />

      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-[#444444] font-semibold text-xl">
            Order Name Here
          </p>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap items-center">
            <div className="text-white bg-[#BF1017] px-6 py-2 rounded-full text-center text-sm">
              Partial
            </div>
            {/* <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" /> */}
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full" />

        <div className="flex flex-wrap justify-between gap-y-4">
          <InfoRow label="Demand ID:" value="demand id" />
          <InfoRow label="Demand Name:" value="demand name" />
          <InfoRow label="Project" value="project" />
          <InfoRow label="Section" value="section" />
          <InfoRow label="Material" value="material" />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-4 mt-2">
          <InfoRow label="Quantity:" value="quantity" />
          <InfoRow label="Unit" value="unit" />
          <InfoRow label="PO Quantity" value="po quantity" />
          <InfoRow label="Assinged Vendor" value="assigned vendor" />
          <InfoRow label="Vendor Phone No" value="phone no" />
        </div>
      </div>

      <SectionTable
        title="Store Sync Status"
        description="lorem ipsum dolor sit amet"
        columns={columns}
        data={data}
        action={CustomActionComponent}
      />

      <SectionTable
        title="Finance"
        description="lorem ipsum dolor sit amet"
        columns={columns}
        data={data}
        action={CustomActionComponent}
      />
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex gap-2 items-center min-w-[150px]">
    <p className="text-[#444444] font-semibold text-base sm:text-xl">{label}</p>
    <p className="text-[#979797] text-sm sm:text-base">{value}</p>
  </div>
);

const SectionTable = ({ title, description, columns, data, action }) => (
  <div className="mt-8 w-full overflow-x-auto">
    <h4 className="text-[#444444] font-semibold text-xl">{title}</h4>
    <p className="text-[#979797] mb-2">{description}</p>
    <SimpleTable data={data} columns={columns} cellComponents={{ action }} />
  </div>
);

export default SiPurchaseOrderDetailPage;
