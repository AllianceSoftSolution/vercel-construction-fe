import React, { useEffect, useState } from "react";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../../comments/components/DropdownButton";
import ReasonModal from "../Demands/ReasonModal";
import PurchaseOrderForm from "../Forms/PurchaseOrderForm";
import DemandQuantityCard from "../../../../components/DemandQuantityCard";
import Button from "../../../../components/Button";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import Loader from "../../../../components/ui/Loader";
import toast from "react-hot-toast";
import { HiCheckCircle } from "react-icons/hi";
import { TiTick } from "react-icons/ti";

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
  const [status, setStatus] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demandData, setDemandData] = useState({});
  const [statusLogs, setStatusLogs] = useState([]);
  const { id } = useParams();
  const [modalLoading, setModalLoading] = useState(false);

  const handleActionClick = (newStatus) => {
    if (newStatus === "Approved") {
      setPendingStatus(newStatus);
      setOpen(true);
    } else {
      setPendingStatus(newStatus);
      setOpen(true);
    }
  };

  const handleReasonSubmit = async (reasonText) => {
    setModalLoading(true);
    try {
      if (pendingStatus === "Approved") {
        // Remarks optional for approval
        await approveDemand(reasonText);
        toast.success("Demand approved!");
        setOpen(false);
        setPendingStatus(null);
        setModalLoading(false);
        // // Small delay to ensure modal closes, then reload
        // setTimeout(() => {
        //   window.location.reload();
        // }, 100);
      } else if (pendingStatus === "Rejected") {
        // Remarks required for rejection
        if (!reasonText || reasonText.trim() === "") {
          toast.error("Remarks are required for rejection!");
          setModalLoading(false);
          return;
        }
        await rejectDemand(reasonText);
        toast.success("Demand rejected!");
        setOpen(false);
        setPendingStatus(null);
        setModalLoading(false);
        // // Small delay to ensure modal closes, then reload
        // setTimeout(() => {
        //   window.location.reload();
        // }, 100);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
      setModalLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPendingStatus(null);
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/demands/${id}`);
      if (response?.data?.demand) {
        setDemandData(response.data.demand);
        setStatus(response.data.data.status || "");
        setStatusLogs(response.data.data.statusLogs || []);
      } else {
        console.error("Failed to fetch details", response?.data?.message);
      }
    } catch (error) {
      console.error("API error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const columns = [
    { headerName: "Name", field: "userName" },
    { headerName: "Status", field: "status" },
    { headerName: "Remarks", field: "remarks" },
  ];

  const CustomActionComponent = () => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          { label: "Reject", onClick: () => handleActionClick("Rejected") },
          { label: "Approve", onClick: () => handleActionClick("Approved") },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const rejectDemand = async (remarks) => {
    // setLoading(true); // Remove page loader for modal loader
    try {
      const response = await apiClient.post(`/demands/${id}/reject`, {
        remarks,
      });
      if (response?.data?.data?.demand) {
        setDemandData(response.data.data.demand);
      } else {
        throw new Error(response?.data?.message || "Failed to reject");
      }
    } catch (error) {
      throw error;
    }
  };
  
  const approveDemand = async (remarks) => {
    // setLoading(true); // Remove page loader for modal loader
    try {
      const requestBody = remarks ? { remarks } : {};
      const response = await apiClient.post(`/demands/${id}/approve`, requestBody);
      if (response?.data?.data?.demand) {
        setDemandData(response.data.data.demand);
      } else {
        throw new Error(response?.data?.message || "Failed to approve");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
        <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <ReasonModal
            textAreaPlaceholder={
              pendingStatus === "Approved" 
                ? "Enter your remarks here... (Optional)" 
                : "Enter your remarks here... (Required)"
            }
            onBackClick={handleClose}
            onSaveClick={handleReasonSubmit}
            loading={modalLoading}
          />
        </Box>
      </Modal>

      <PurchaseOrderForm
        isOpen={openPurchaseModal}
        onClose={() => setOpenPurchaseModal(false)}
        demandId={demandData?.id}
        sectionId={demandData?.sectionId}
        materialName={demandData?.material?.name}
        materialId={demandData?.material?.id}
        demandQuantity={demandData?.quantity}
      />

      <TopBar title="Demand Details" 
      // detail="lorem ipsum dolor sit amet" 
      />

      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 gap-y-6">
        <div className="flex flex-wrap justify-between items-center gap-y-4">
          <p className="text-[#444444] font-semibold text-xl">
            {demandData?.referenceNumber || "-"}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <div
              className={`text-white px-6 py-1.5 rounded-lg text-sm ${
                demandData?.status === "APPROVED"
                  ? "bg-green-600"
                  : demandData?.status === "PARTIALLY_APPROVED"
                  ? "bg-yellow-500"
                  : demandData?.status === "REJECTED"
                  ? "bg-red-600"
                  : demandData?.status === "PO_CREATED"
                  ? "bg-purple-700"
                  : "bg-[#0252AD]"
              }`}
            >
              {demandData?.status || "PENDING"}
            </div>

            {demandData?.status === "APPROVED" && (
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
            <p className="text-[#979797]">
              {demandData?.section?.projectName || "-"}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Section Name:</p>
            <p className="text-[#979797]">{demandData?.section?.name || "-"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Material:</p>
            <p className="text-[#979797]">
              {demandData?.material?.name || "-"}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Quantity:</p>
            <p className="text-[#979797]">{demandData?.quantity || "-"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Unit:</p>
            <p className="text-[#979797]">{demandData?.unit || "-"}</p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">PO Quantity:</p>
            <p className="text-[#979797]">{demandData?.poQuantity || "-"}</p>
          </div>
          {/* Exceeding Demand Quantity Alert and Checkbox */}
          {Number(demandData?.poQuantity) > Number(demandData?.quantity) && (
            <div className="flex flex-col col-span-2">
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="exceed-po-checkbox"
                  className="accent-red-600 w-4 h-4"
                  // Controlled by local state
                />
                <label htmlFor="exceed-po-checkbox" className="text-[#444444] font-semibold">
                  Are you sure to create PO greater than demand?
                </label>
              </div>
              <span className="text-red-600 font-semibold mt-1">You are exceeding demand Qty.</span>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Approved By:</p>
            <p className="text-[#979797]">{demandData?.approvedBy || "-"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Created By:</p>
            <p className="text-[#979797]">{demandData?.creator?.name || "-"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Fulfilled:</p>
            <p className="text-[#979797]">{demandData?.fulfilled || "-"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">
              Activity Description:
            </p>
            <p className="text-[#979797]">
              {demandData.activityDescription || "-"}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Notes by CM:</p>
            <p className="text-[#979797]">{demandData?.notes || "-"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <p className="text-[#444444] font-semibold text-xl">Remarks</p>
          <ul className="list-disc list-inside text-[#979797] space-y-1">
            {(demandData.remarks || []).map((remark, index) => (
              <li key={index}>{remark}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DemandQuantityCard
          storeName="Head Store"
          totalQty={
            demandData?.headStoreQty === 0 ? 0 : demandData?.headStoreQty || "-"
          }
          material={demandData?.material?.name || "Cement"}
          headStoreId={demandData?.headStoreId}
          cmStoreId={demandData?.cmStoreId}
          showButton
          id={id}
        />
        <DemandQuantityCard
          storeName="CM Store"
          totalQty={
            demandData?.cmStoreQty === 0 ? 0 : demandData?.cmStoreQty || "-"
          }
          material={demandData?.material?.name || "Cement"}
        />
      </div>

      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Status Logs</h4>
      <SimpleTable
        data={demandData?.approvals}
        columns={columns}
        cellComponents={{}}
      />
      </>
      
      )}
    </>
  );
};

export default DemandDetails;
