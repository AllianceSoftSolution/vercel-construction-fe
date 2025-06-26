import React, { useState } from "react";
import BackButton from "../../../../components/BackButton";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import CustomTextField from "../../../../mui/CustomTextField";
import CreatePOModal from "./CreatePOModal";

const DemandDetail = () => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const totalQuantity = 100; // example

  const handleApproveClick = () => {
    setOpen(true);
  };

  const handleApprove = () => {
    console.log("Approved with reason:", reason);
    setOpen(false);
    setReason(""); // Reset
  };

  const [poOpen, setPoOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [vendor, setVendor] = useState("");
  const vendorOptions = ["Vendor A", "Vendor B", "Vendor C"]; // Replace with actual vendors

  const handleCreatePO = (poData) => {
    console.log("PO Data Submitted:", poData);
    // Reset handled inside modal after submit
  };

  return (
    <div>
      {/* TopBar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-2">
          <BackButton />
          <h2 className="font-bold text-2xl">Demand Details</h2>
        </div>
        <div>Buttons Here(If any)</div>
      </div>

      {/* Body */}
      <div className="bg-[#f7f7f7] rounded-md px-3 py-5">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Demand R203423</h4>
          <div className="flex items-center gap-x-1">
            <span className="px-4 py-2 border border-gray-200 rounded-full">
              Pending
            </span>
            <button
              onClick={handleApproveClick}
              className="px-4 py-2 bg-primary text-white rounded-full"
            >
              Approve
            </button>
            <button
              onClick={() => {
                setPoOpen(true);
              }}
              className="px-4 py-2 bg-primary text-white rounded-full"
            >
              Create PO
            </button>
          </div>
        </div>
        <hr />
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Project Name</span> Name
            Here
          </p>
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Section Name</span> Name
            Here
          </p>{" "}
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Material</span> Name Here
          </p>{" "}
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Quantity</span> 100 Here
          </p>{" "}
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Unit</span> Ton
          </p>{" "}
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">PO Quantity</span> Name
            Here
          </p>{" "}
          <p className="flex items-center gap-x-1 text-black/60 col-span-2">
            <span className="font-medium text-black">Approved by</span> Name
            Here, Name here
          </p>{" "}
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Fulfilled</span> 20
          </p>
          <p className="flex items-center gap-x-1 text-black/60 sm:col-span-2">
            <span className="font-medium text-black">
              Activity Description:
            </span>
            Foundation concrete for base slab
          </p>
          <p className="flex items-center gap-x-1 text-black/60 sm:col-span-2">
            <span className="font-medium text-black">Notes by CM:</span>"Site
            has no remaining stock, requires urgent delivery."
          </p>
          <p className="flex items-center gap-x-1 text-black/60 sm:col-span-2">
            <span className="font-medium text-black">Remarks:</span>
            PM: "Approved – planned for Thursday" SM: "Delivery confirmed with
            store availability" Owner: "Approved – vendor confirmed"
          </p>
        </div>
      </div>

      {/* MUI Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={2}>
            Approval Reason
          </Typography>

          <CustomTextField
            fullWidth
            multiline
            minRows={4}
            label="Reason for Approval"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <button
              className="px-4 py-2 rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-full bg-primary text-white"
              onClick={handleApprove}
              disabled={!reason.trim()}
            >
              Approve
            </button>
          </Box>
        </Box>
      </Modal>

      <CreatePOModal
        open={poOpen}
        onClose={() => setPoOpen(false)}
        onSubmit={handleCreatePO}
        product="Steel Rods"
        quantity={quantity}
        setQuantity={setQuantity}
        vendor={vendor}
        setVendor={setVendor}
        vendorOptions={vendorOptions}
        totalQuantity={totalQuantity}
      />
    </div>
  );
};

export default DemandDetail;
