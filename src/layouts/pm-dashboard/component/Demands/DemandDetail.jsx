import React, { useState, useEffect } from "react";
import BackButton from "../../../../components/BackButton";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import CustomTextField from "../../../../mui/CustomTextField";
import CreatePOModal from "./CreatePOModal";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const DemandDetail = () => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchDemandDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/demands/${id}`);
      if (response.ok) {
        setDemandData(response.data.demand);
      } else {
        toast.error("Failed to fetch demand details");
      }
    } catch (error) {
      console.error("Error fetching demand details:", error);
      toast.error("Something went wrong while fetching demand details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDemandDetail();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading demand details...</div>
      </div>
    );
  }

  if (!demandData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Demand not found</div>
      </div>
    );
  }

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
          <h4 className="font-semibold">Demand {demandData.referenceNumber}</h4>
          <div className="flex items-center gap-x-1">
            <span className="px-4 py-2 border border-gray-200 rounded-full">
              {demandData.status}
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
            <span className="font-medium text-black">Project Name</span>
            {demandData.section?.project?.name || "N/A"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Section Name</span>
            {demandData.section?.name || "N/A"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Material</span>
            {demandData.material?.name || "N/A"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Quantity</span>
            {demandData.quantity || "N/A"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Unit</span>
            {demandData.unit || "N/A"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">PO Quantity</span>
            {demandData.poQuantity || "0"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60 col-span-2">
            <span className="font-medium text-black">Approved by</span>
            {demandData.approvedBy || "N/A"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60">
            <span className="font-medium text-black">Fulfilled</span>
            {demandData.quantityFulfilled || "0"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60 sm:col-span-2">
            <span className="font-medium text-black">
              Activity Description:
            </span>
            {demandData.activity || "N/A"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60 sm:col-span-2">
            <span className="font-medium text-black">Notes by CM:</span>
            {demandData.notes || "N/A"}
          </p>
          <p className="flex items-center gap-x-1 text-black/60 sm:col-span-2">
            <span className="font-medium text-black">Remarks:</span>
            {demandData.remarks || "No remarks"}
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
        product={demandData.material?.name || "N/A"}
        quantity={quantity}
        setQuantity={setQuantity}
        vendor={vendor}
        setVendor={setVendor}
        vendorOptions={vendorOptions}
        totalQuantity={demandData.quantity || 0}
      />
    </div>
  );
};

export default DemandDetail;
