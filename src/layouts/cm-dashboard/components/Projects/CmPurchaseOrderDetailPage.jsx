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
  const CustomActionComponent = ({ data }) => {
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
        // onClick={handleActionClick}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };
  return (
    <>
      <TopBar
        title="Purchase Order Detail Page"
        detail="lorem ipsum dolor sit amet"
        // showExport={true}
      />
      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex justify-between">
          <p className="text-[#444444] font-semibold text-xl">
            Order Name Here
          </p>
          <div className="flex gap-x-2">
            <div className="text-white bg-[#BF1017] px-12 py-2 rounded-full">
              Partial
            </div>
            <MdDelete
              // onClick={onDelete}
              className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
            />{" "}
          </div>
        </div>
        <div className="h-[1px] bg-[#CDCDCD] w-full "></div>

        <div className="flex justify-between gap-x-4 flex-wrap">
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Demand ID:</p>
            <p className="text-[#979797]">demand id</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Demand Name:</p>
            <p className="text-[#979797]">demand name</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Project</p>
            <p className="text-[#979797]">project</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Section</p>
            <p className="text-[#979797]">section</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Material</p>
            <p className="text-[#979797]">material</p>
          </div>
        </div>

        <div className="flex justify-start gap-x-14 flex-wrap">
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Quantity:</p>
            <p className="text-[#979797]">quantity</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Unit</p>
            <p className="text-[#979797]">unit</p>
          </div>{" "}
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">PO Quantity</p>
            <p className="text-[#979797]">po quantity</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">
              Assinged Vendor
            </p>
            <p className="text-[#979797]">assigned vendor</p>
          </div>
          <div className="flex gap-x-4 items-center mt-6">
            <p className="text-[#444444] font-semibold text-xl">
              Vendor Phone No{" "}
            </p>
            <p className="text-[#979797]">phone no</p>
          </div>
        </div>
      </div>

      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Store Sync Status
      </h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet </p>
      <SimpleTable
        data={data}
        columns={columns}
        cellComponents={{ action: CustomActionComponent }}
      />
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Finance</h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet </p>
      <SimpleTable
        data={data}
        columns={columns}
        cellComponents={{ action: CustomActionComponent }}
      />
    </>
  );
};

export default CmPurchaseOrderDetail;
 