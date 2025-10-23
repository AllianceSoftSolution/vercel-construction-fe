import React, { useState } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../../comments/components/DropdownButton";
import ReasonModal from "../Demands/ReasonModal";
import PurchaseOrderForm from "../Forms/SiPurchaseOrderForm";
import DemandQuantityCard from "../../../../components/DemandQuantityCard";
import Button from "../../../../components/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};

const SiDemandDetailPage = () => {
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ReasonModal
            textAreaPlaceholder="Enter your reason"
            onBackClick={handleClose}
            onSaveClick={handleReasonSubmit}
          />
        </Box>
      </Modal>

      {/* PurchaseOrderForm */}

      <PurchaseOrderForm
        isOpen={openPurchaseModal}
        onClose={() => setOpenPurchaseModal(false)}
      />

      <TopBar title="Demand Details" showIcon={true} />

      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex justify-between">
          <p className="text-[#444444] font-semibold text-xl">Project-A001</p>
          <div className="flex gap-x-2 items-center">
            <div
              className={`text-white px-8 py-2 rounded-lg  ${
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
                className="bg-primary text-white px-4 py-2 "
                buttonText={"Create Purchase Order"}
              />
            )}

            <CustomActionComponent />
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full "></div>

        <div className="flex justify-between gap-x-4 flex-wrap">
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">
              Project Name:
            </p>
            <p className="text-[#979797]">project name</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">
              Section Name:
            </p>
            <p className="text-[#979797]">section name</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Material</p>
            <p className="text-[#979797]">material</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Quantity</p>
            <p className="text-[#979797]">quantity</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Unit</p>
            <p className="text-[#979797]">unit</p>
          </div>
        </div>

        <div className="flex justify-start gap-x-14 flex-wrap">
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">PO Quantity:</p>
            <p className="text-[#979797]">po quantity</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Approved By</p>
            <p className="text-[#979797]">approved by</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Fulfilled</p>
            <p className="text-[#979797]">fulfilled</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">
              Activity Description
            </p>
            <p className="text-[#979797]">activity description</p>
          </div>
          <div className="flex gap-x-4 items-center mt-6">
            <p className="text-[#444444] font-semibold text-xl">Notes by CM</p>
            <p className="text-[#979797]">lorem ipsum dolor sit amet</p>
          </div>
        </div>

        <div className="flex gap-x-8 items-center mt-2">
          <p className="text-[#444444] font-semibold text-xl">Remarks</p>
          <ul>
            <li className="text-[#979797]">lorem ipsum dolor sit amet</li>
            <li className="text-[#979797]">lorem ipsum dolor sit amet</li>
            <li className="text-[#979797]">lorem ipsum dolor sit amet</li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
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

export default SiDemandDetailPage;
