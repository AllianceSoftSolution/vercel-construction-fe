import React, { useState } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
const PurchaseOrderDetail = () => {
  const data = [
    {
      id: 1,
      material: "Cement",
      linkedDemand: "dm-2345",
      poQuantity: 100,
      received: 11,
      issued: 111,
      balance: 11,
      lastUpdated: "11-12-25",
      vendor: "111",
      status: "In-Store",
    },
    {
      id: 2,
      material: "Cement",
      linkedDemand: "dm-2345",
      poQuantity: 100,
      received: 11,
      issued: 111,
      balance: 11,
      lastUpdated: "11-12-25",
      vendor: "111",
      status: "In-Store",
    },
    {
      id: 3,
      material: "Cement",
      linkedDemand: "dm-2345",
      poQuantity: 100,
      received: 11,
      issued: 111,
      balance: 11,
      lastUpdated: "11-12-25",
      vendor: "111",
      status: "In-Store",
    },
  ];
  const columns = [
    { headerName: "Material", field: "material" },
    { headerName: "Linked Demand", field: "linkedDemand" },
    { headerName: "PO Quantity", field: "poQuantity" },
    { headerName: "Received", field: "received" },
    { headerName: "Issued", field: "issued" },
    { headerName: "Balance", field: "balance" },
    { headerName: "Last Updated", field: "lastUpdated" },
    { headerName: "Vendor", field: "vendor" },
    { headerName: "Status", field: "status" },
  ];
  const data1 = [
    {
      id: 1,
      date: "12-12-25",
      material: "Cement",
      type: "issued",
      qty: "20bags",
      handledBy: "John Doe",
      remarks: "For base pour",
    },
    {
      id: 2,
      date: "12-12-25",
      material: "Cement",
      type: "issued",
      qty: "20bags",
      handledBy: "John Doe",
      remarks: "For base pour",
    },
    {
      id: 3,
      date: "12-12-25",
      material: "Cement",
      type: "issued",
      qty: "20bags",
      handledBy: "John Doe",
      remarks: "For base pour",
    },
  ];
  const columns1 = [
    { headerName: "Material", field: "material" },
    { headerName: "Date", field: "date" },
    { headerName: "Type", field: "type" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Handled By", field: "handledBy" },
    { headerName: "Remarks", field: "remarks" },
  ];
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "Edit",
            // onClick: () => alert("Edit"),
            // icon: <FaUserEdit />,
          },
          {
            label: "Delete ",
            // onClick: () => alert("Delete"),
            // icon: <FaTrash />,
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
        title="Store Detail"
        detail="lorem ipsum dolor sit amet"
        showExport={true}
        buttonText="Add Store"
      />
      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex justify-between">
          <p className="text-[#444444] font-semibold text-xl">
            Order Name Here
          </p>
          <div className="flex gap-x-2">
            <div className="text-white bg-[#BF1017] px-12 py-2 rounded-full">
              IN-STORE
            </div>
            <CustomActionComponent />
          </div>
        </div>
        <div className="h-[1px] bg-[#CDCDCD] w-full "></div>

        <div className="flex justify-between gap-x-4 flex-wrap">
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Store ID:</p>
            <p className="text-[#979797]">store id</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Store Name:</p>
            <p className="text-[#979797]">store name</p>
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
            <p className="text-[#444444] font-semibold text-xl">
              Store Incharge:
            </p>
            <p className="text-[#979797]">store incharge</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Received</p>
            <p className="text-[#979797]">received</p>
          </div>{" "}
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">PO Quantity</p>
            <p className="text-[#979797]">po quantity</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Issued</p>
            <p className="text-[#979797]">issued</p>
          </div>
          <div className="flex gap-x-4 items-center mt-6">
            <p className="text-[#444444] font-semibold text-xl">Balance</p>
            <p className="text-[#979797]">balance</p>
          </div>
          <div className="flex gap-x-4 items-center mt-6">
            <p className="text-[#444444] font-semibold text-xl">CM Name</p>
            <p className="text-[#979797]">cm name</p>
          </div>
          <div className="flex gap-x-4 items-center mt-6">
            <p className="text-[#444444] font-semibold text-xl">Accountant</p>
            <p className="text-[#979797]">accountant</p>
          </div>
        </div>
      </div>

      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Inventory</h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet </p>
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable data={data} columns={columns} cellComponents={{}} />
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Stock Movement History
      </h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet </p>
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable data={data1} columns={columns1} cellComponents={{}} />
    </>
  );
};

export default PurchaseOrderDetail;
