import React, { useEffect, useState } from "react";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { Box, IconButton, Modal, Chip } from "@mui/material";
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

// Status color mapping for purchase order status
const statusColorMap = {
  COMPLETED: "#22c55e", // green
  PARTIAL: "#eab308", // yellow
  PENDING: "#f59e42", // orange
  REJECTED: "#ef4444", // red
  CONFIRMED: "#44085c", // purple
  APPROVED: "#22c55e", // green
  PARTIALLY_APPROVED: "#eab308", // yellow
  PO_CREATED: "#8b5cf6", // purple
  default: "#0252AD", // fallback blue
};

const StatusChip = ({ value }) => {
  const status = (value || "PENDING").toUpperCase();
  const color = statusColorMap[status] || statusColorMap.default;
  return (
    <Chip
      label={status.replace(/_/g, " ")}
      size="small"
      sx={{
        bgcolor: color,
        color: "#fff",
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    />
  );
};

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
  const [loading, setLoading] = useState(false);
  const [demandData, setDemandData] = useState({});
  const [statusLogs, setStatusLogs] = useState([]);
  const { id } = useParams();

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
    try {
      if (pendingStatus === "Approved") {
        await approveDemand();
        toast.success("Demand approved successfully!");
      } else if (pendingStatus === "Rejected") {
        await rejectDemand(reasonText);
        toast.success("Demand rejected successfully!");
      }
      setPendingStatus(null);
      setOpen(false);
      // Refresh data after successful action
      await fetchDetails();
    } catch (error) {
      console.error("Error in handleReasonSubmit:", error);
      toast.error(error.message || "An error occurred. Please try again.");
      throw error; // Re-throw to let the modal know about the error
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

// Date and time formatting function
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d)) return "-";

  // Format as "DD MMM YYYY, HH:MM AM/PM" (e.g., "15 Jan 2024, 02:33 PM")
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} ${month} ${year}, ${time}`;
};

// Date component for table
const DateComponent = ({ value }) => {
  return <span className="text-gray-700 font-medium">{formatDate(value)}</span>;
};

  const DateCellComponent = ({ value }) => {
    return <div>{formatDate(value)}</div>;
  };

  const columns = [
    { headerName: "Name", field: "userName" },
    { headerName: "Status", field: "status" },
    { headerName: "Role", field: "userRole" },
    { headerName: "Remarks", field: "remarks" },
    { headerName: "Date", field: "createdAt" },
  ];
  const columnsPurchaseOrder = [
    // { headerName: "Demand ID", field: "demandId" },
    { headerName: "Project Name", field: "project" },
    // { headerName: "Demand", field: "demandName" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Amount (PKR)", field: "amount" },
    { headerName: "Proof of Bill", field: "proofOfBill" },
    { headerName: "Date", field: "createdAt" },
    { headerName: "Status", field: "status" },
    // { headerName: "Assigned Vendors", field: "assingedVendors" },
    // { headerName: "Action", field: "id" },
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
    try {
      console.log("Sending reject request with remarks:", remarks);
      const response = await apiClient.post(`/demands/${id}/reject`, {
        remarks,
      });
      console.log("Reject response:", response);
      
      if (response?.data?.data?.demand) {
        setDemandData(response.data.data.demand);
        return response.data.data.demand;
      } else {
        throw new Error(response?.data?.message || "Failed to reject demand");
      }
    } catch (error) {
      console.error("Reject API error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to reject demand");
    }
  };
  const approveDemand = async () => {
    try {
      const response = await apiClient.post(`/demands/${id}/approve`);
      if (response?.data?.data?.demand) {
        setDemandData(response.data.data.demand);
        return response.data.data.demand;
      } else {
        throw new Error(response?.data?.message || "Failed to approve demand");
      }
    } catch (error) {
      console.error("Approve API error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to approve demand");
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
            //  textAreaPlaceholder="Enter your remarks here..."
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
        materialId={demandData?.material?.id}
        demandQuantity={demandData?.quantity}
      />

      <TopBar title="Demand Details" 
      showIcon={true}
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
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          {Number(demandData?.poQuantity) > Number(demandData?.quantity) && (
            <div className="flex flex-col col-span-2">
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="exceed-po-checkbox"
                  className="accent-red-600 w-4 h-4"
                />
                <label htmlFor="exceed-po-checkbox" className="text-[#444444] font-semibold">
                  Are you sure to create PO greater than demand?
                </label>
              </div>
              <span className="text-red-600 font-semibold mt-1">You are exceeding demand Qty.</span>
            </div>
          )}
        
          <div className="flex gap-2 items-center">
            <p className="text-[#444444] font-semibold">Notes by CM:</p>
            <p className="text-[#979797]">{demandData?.notes || "-"}</p>
          </div>
        </div>

          {/* <div className="flex flex-col gap-y-2">
            <p className="text-[#444444] font-semibold text-xl">Remarks</p>
            <ul className="list-disc list-inside text-[#979797] space-y-1">
              {(demandData.remarks || []).map((remark, index) => (
                <li key={index}>{remark}</li>
              ))}
            </ul>
          </div> */}
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
      <div className="mt-6">
            <TopBar title="Purchase Order" />
            <SimpleTable
              data={demandData?.purchaseOrders?.map((po, index) => ({
                id: po.id,
                demandId: po.demand?.referenceNumber || "-",
                project: po.demand?.section?.project?.name || "-",
                demandName: po.demand?.referenceNumber || "-",
                material: po.material?.name || "-",
                section: po.demand?.section?.name || "-",
                qty: po.demand?.quantity || "-",
                unit: po.demand?.unit || "-",
                poQty: po.quantity || "-",
                amount: po.totalAmount ? `${po.totalAmount}` : "-",
                createdAt: po.createdAt ? formatDate(po.createdAt) : "-",
                status: po.status || "-",
                assingedVendors: po.vendorId || "-",
                proofOfBill: po.proofOfBill || "-",
              }))}
              columns={columnsPurchaseOrder}
              cellComponents={{
                createdAt: DateComponent,
                status: StatusChip,
              }}
            />
          </div>
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Status Logs</h4>
      <SimpleTable
        data={demandData?.approvals || []}
        columns={columns}
        cellComponents={{ createdAt: DateCellComponent }}
      />
      </>
      
      )}
    </>
  );
};

export default SiDemandDetails;
