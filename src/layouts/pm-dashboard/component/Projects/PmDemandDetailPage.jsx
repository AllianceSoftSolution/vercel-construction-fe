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

const PmDemandDetails = () => {
  const [open, setOpen] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [pendingStatus, setPendingStatus] = useState(null);

  const handleActionClick = (newStatus) => {
    setPendingStatus(newStatus);
    setOpen(true);
  };

  const handleReasonSubmit = (reasonText) => {
    console.log(reasonText);
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
          {
            label: "Rejected",
            onClick: () => handleActionClick("Rejected"),
          },
          {
            label: "Approved",
            onClick: () => handleActionClick("Approved"),
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

      <TopBar title="Demand Details" detail="lorem ipsum dolor sit amet" />

   
      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 gap-y-4">

        <div className="flex flex-wrap justify-between items-center gap-y-2">
          <p className="text-[#444444] font-semibold text-xl">Project-A001</p>
          <div className="flex items-center gap-2">
            <div
              className={`text-white px-6 py-2 rounded-lg text-sm ${
                status === "Approved"
                  ? "bg-green-600"
                  : status === "Rejected"
                  ? "bg-red-600"
                  : "bg-[#0252AD]"
              }`}
            >
              {status}
            </div>
            <CustomActionComponent />
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full" />

      
        <div className="flex flex-wrap gap-4">
          <InfoItem label="Project Name" value="project name" />
          <InfoItem label="Section Name" value="section name" />
          <InfoItem label="Material" value="material" />
          <InfoItem label="Quantity" value="quantity" />
          <InfoItem label="Unit" value="unit" />
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-4 mt-2">
          <InfoItem label="PO Quantity" value="po quantity" />
          <InfoItem label="Approved By" value="approved by" />
          <InfoItem label="Fulfilled" value="fulfilled" />
          <InfoItem label="Activity Description" value="activity description" />
          <InfoItem label="Notes by CM" value="lorem ipsum dolor sit amet" />
        </div>

      
        <div className="flex flex-col gap-1 mt-4">
          <p className="text-[#444444] font-semibold text-xl">Remarks</p>
          <ul className="list-disc list-inside text-[#979797]">
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
      <div className=" mt-2">
        <SimpleTable data={data} columns={columns} cellComponents={{}} />
      </div>
    </>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex items-center gap-2 min-w-[160px]">
    <p className="text-[#444444] font-semibold text-base whitespace-nowrap">
      {label}:
    </p>
    <p className="text-[#979797] text-sm">{value}</p>
  </div>
);

export default PmDemandDetails;
