import React, { useState } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../../comments/components/DropdownButton";
import ReasonModal from "../Demands/ReasonModal";
import PurchaseOrderForm from "../Forms/PurchaseOrderForm";
import DemandQuantityCard from "../../../../components/DemandQuantityCard";
import Button from "../../../../components/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  boxShadow: 24,
};

const DemandDetails = () => {
  const [open, setOpen] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [pendingStatus, setPendingStatus] = useState(null);

  const handleActionClick = (newStatus) => {
    setPendingStatus(newStatus);
    setOpen(true);
  };

  const handleReasonSubmit = (reasonText) => {
    setStatus(pendingStatus);
    setPendingStatus(null);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setPendingStatus(null);
  };

  const data = [
    { id: 1, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
    { id: 2, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
    { id: 3, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
  ];

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Created Demand", field: "createdDemand" },
    { headerName: "Date", field: "date" },
  ];

  const CustomActionComponent = () => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          { label: "Rejected", onClick: () => handleActionClick("Rejected") },
          { label: "Approved", onClick: () => handleActionClick("Approved") },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <ReasonModal
            textAreaPlaceholder="Enter your reason"
            onBackClick={handleClose}
            onSaveClick={handleReasonSubmit}
          />
        </Box>
      </Modal>

      <PurchaseOrderForm
        isOpen={openPurchaseModal}
        onClose={() => setOpenPurchaseModal(false)}
      />

      <TopBar title="Demand Details" detail="lorem ipsum dolor sit amet" />

      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 gap-y-6">
        <div className="flex flex-wrap justify-between items-center gap-y-4">
          <p className="text-[#444444] font-semibold text-xl">Project-A001</p>
          <div className="flex flex-wrap gap-2 items-center">
            <div
              className={`text-white px-6 py-1.5 rounded-lg text-sm ${
                status === "Approved"
                  ? "bg-green-600"
                  : status === "Rejected"
                  ? "bg-red-600"
                  : "bg-[#0252AD]"
              }`}
            >
              {status}
            </div>
            {status === "Approved" && (
              <Button
                onClick={() => setOpenPurchaseModal(true)}
                className="bg-primary text-white px-4 py-2 text-sm"
                buttonText={"Create Purchase Order"}
              />
            )}
            <CustomActionComponent />
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full" />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Project Name:</p>
            <p className="text-[#979797]">project name</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Section Name:</p>
            <p className="text-[#979797]">section name</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Material:</p>
            <p className="text-[#979797]">material</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Quantity:</p>
            <p className="text-[#979797]">quantity</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Unit:</p>
            <p className="text-[#979797]">unit</p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">PO Quantity:</p>
            <p className="text-[#979797]">po quantity</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Approved By:</p>
            <p className="text-[#979797]">approved by</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Fulfilled:</p>
            <p className="text-[#979797]">fulfilled</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">
              Activity Description:
            </p>
            <p className="text-[#979797]">activity description</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Notes by CM:</p>
            <p className="text-[#979797]">lorem ipsum dolor sit amet</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <p className="text-[#444444] font-semibold text-xl">Remarks</p>
          <ul className="list-disc list-inside text-[#979797] space-y-1">
            <li>lorem ipsum dolor sit amet</li>
            <li>lorem ipsum dolor sit amet</li>
            <li>lorem ipsum dolor sit amet</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DemandQuantityCard
          storeName="Head Store"
          totalQty={80}
          material="Cement"
          showButton
        />
        <DemandQuantityCard
          storeName="CM Store"
          totalQty={50}
          material="Cement"
        />
      </div>

      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Status Logs</h4>
      <SimpleTable data={data} columns={columns} cellComponents={{}} />
    </>
  );
};

export default DemandDetails;
