import React, { useState, useEffect } from "react";

import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../../comments/components/DropdownButton";
import ReasonModalCm from "../Demands/ReasonModalCm";
import PurchaseOrderForm from "../Forms/CmPurchaseOrderForm";
import DemandQuantityCard from "../../../../components/DemandQuantityCard";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};

const CmDemandDetailPage = () => {
  const [open, setOpen] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  // const [status, setStatus] = useState("Pending");
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
          },
          {
            label: "Approved",
          },
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
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ReasonModalCm
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
        demandId={demandData?.id}
        sectionId={demandData?.sectionId}
        materialName={demandData?.material?.name}
        materialId={demandData?.materialId}
        demandQuantity={demandData?.quantity}
      />

      <TopBar title="Demand Details" detail="lorem ipsum dolor sit amet" />

      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex justify-between">
          <p className="text-[#444444] font-semibold text-xl">{demandData.referenceNumber}</p>
          <div className="flex gap-x-2 items-center">
            {/* <div
              className={`text-white px-8 py-2 rounded-lg  ${
                status === "Approved"
                  ? "bg-green-600"
                  : status === "Rejected"
                  ? "bg-red-600"
                  : "bg-[#0252AD]"
              }`}
            >
              {status}
            </div> */}

            {/* {status === "Approved" && (
              <Button
                onClick={() => setOpenPurchaseModal(true)}
                className="bg-primary text-white px-4 py-2 "
                buttonText={"Create Purchase Order"}
              />
            )} */}

            {/* <CustomActionComponent /> */}
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full "></div>

        <div className="flex justify-between gap-x-4 flex-wrap">
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">
              Project Name:
            </p>
            <p className="text-[#979797]">{demandData.section?.project?.name || "N/A"}</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">
              Section Name:
            </p>
            <p className="text-[#979797]">{demandData.section?.name || "N/A"}</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Material</p>
            <p className="text-[#979797]">{demandData.material?.name || "N/A"}</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Quantity</p>
            <p className="text-[#979797]">{demandData.quantity || "N/A"}</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Unit</p>
            <p className="text-[#979797]">{demandData.unit || "N/A"}</p>
          </div>
        </div>

        <div className="flex justify-start gap-x-14 flex-wrap">
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">PO Quantity:</p>
            <p className="text-[#979797]">{demandData.poQuantity || "0"}</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Approved By</p>
            <p className="text-[#979797]">{demandData.approvedBy || "N/A"}</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Fulfilled</p>
            <p className="text-[#979797]">{demandData.quantityFulfilled || "0"}</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">
              Activity Description
            </p>
            <p className="text-[#979797]">{demandData.activity || "N/A"}</p>
          </div>
          <div className="flex gap-x-4 items-center mt-6">
            <p className="text-[#444444] font-semibold text-xl">Notes by CM</p>
            <p className="text-[#979797]">{demandData.notes || "N/A"}</p>
          </div>
        </div>

        <div className="flex gap-x-8 items-center mt-2">
          <p className="text-[#444444] font-semibold text-xl">Remarks</p>
          <ul>
            <li className="text-[#979797]">{demandData.remarks || "No remarks"}</li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <DemandQuantityCard
          storeName="Head Store"
          totalQty={demandData.quantity || 0}
          material={demandData.material?.name || "N/A"}
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

export default CmDemandDetailPage;
