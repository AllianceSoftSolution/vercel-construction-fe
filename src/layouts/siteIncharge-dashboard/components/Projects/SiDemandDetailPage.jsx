import React, { useState, useEffect } from "react";
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
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  boxShadow: 24,
};

const SiDemandDetails = () => {
  const [open, setOpen] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchDemandDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/demands/${id}`);
      if (response.ok) {
        setDemandData(response.data.demand);
        setStatus(response.data.demand.status || "Pending");
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

  const handleActionClick = (newStatus) => {
    setPendingStatus(newStatus);
    setOpen(true);
  };

  const rejectDemand = async (remarks) => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/demands/${id}/reject`, { remarks });
      if (response?.data?.demand) {
        setDemandData(response.data.demand);
      } else {
        toast.error(response?.data?.message || "Failed to reject");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "API error");
    } finally {
      setLoading(false);
    }
  };

  const approveDemand = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/demands/${id}/approve`);
      if (response?.data?.demand) {
        setDemandData(response.data.demand);
        toast.success("Demand approved successfully!");
      } else {
        toast.error(response?.data?.message || "Failed to approve");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "API error");
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSubmit = async (reasonText) => {
    if (pendingStatus === "Approved") {
      await approveDemand();
    } else if (pendingStatus === "Rejected") {
      await rejectDemand(reasonText);
    }
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-gray-600">Loading ...</p>
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


  const fulfillDemand = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/demands/${id}/fulfill`);
      if (response?.data?.demand) {
        setDemandData(response.data.demand);
      } else {
        toast.error(response?.data?.message || "Failed to fulfill");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "API error");
    } finally {
      setLoading(false);
    }
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
        demandId={demandData?.id}
        sectionId={demandData?.sectionId}
        materialName={demandData?.material?.name}
        materialId={demandData?.materialId}
        demandQuantity={demandData?.quantity}
      />

      <TopBar title="Demand Details"
      //  detail="lorem ipsum dolor sit amet" 
       />

      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 gap-y-6">
        <div className="flex flex-wrap justify-between items-center gap-y-4">
          <p className="text-[#444444] font-semibold text-xl">{demandData.referenceNumber}</p>
          <div className="flex flex-wrap gap-2 items-center">
            <div
              className={`text-white px-6 py-1.5 rounded-lg text-sm ${
                status === "APPROVED"
                  ? "bg-green-600"
                  : status === "REJECTED"
                  ? "bg-red-600"
                  : status === "PO_CREATED"
                  ? "bg-purple-700" : status === "PARTIALLY_APPROVED"
                  ? "bg-yellow-500"
                  : "bg-[#0252AD]"
              }`}
            >
              {status}
            </div>
            {status === "APPROVED" && (
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
            <p className="text-[#979797]">{demandData.section?.project?.name || "N/A"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Section Name:</p>
            <p className="text-[#979797]">{demandData.section?.name || "N/A"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Material:</p>
            <p className="text-[#979797]">{demandData.material?.name || "N/A"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Quantity:</p>
            <p className="text-[#979797]">{demandData.quantity || "N/A"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Unit:</p>
            <p className="text-[#979797]">{demandData.unit || "N/A"}</p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">PO Quantity:</p>
            <p className="text-[#979797]">{demandData.poQuantity || "0"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Approved By:</p>
            <p className="text-[#979797]">{demandData.approvedBy || "N/A"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Fulfilled:</p>
            <p className="text-[#979797]">{demandData.quantityFulfilled || "0"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">
              Activity Description:
            </p>
            <p className="text-[#979797]">{demandData.activity || "N/A"}</p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Notes by CM:</p>
            <p className="text-[#979797]">{demandData.notes || "N/A"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <p className="text-[#444444] font-semibold text-xl">Remarks</p>
          <ul className="list-disc list-inside text-[#979797] space-y-1">
            <li>{demandData.remarks || "No remarks"}</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DemandQuantityCard
          storeName="Head Store"
          totalQty={demandData.quantity || 0}
          material={demandData.material?.name || "N/A"}
              showButton
              onButtonClick={fulfillDemand}
        />
        <DemandQuantityCard
          storeName="CM Store"
          totalQty={demandData.quantity || 0}
          material={demandData.material?.name || "N/A"}
        />
      </div>

      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Status Logs</h4>
      <SimpleTable data={data} columns={columns} cellComponents={{}} />
    </>
  );
};

export default SiDemandDetails;
