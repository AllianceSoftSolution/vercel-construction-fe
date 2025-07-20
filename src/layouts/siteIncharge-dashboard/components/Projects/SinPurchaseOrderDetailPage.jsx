import React, { useEffect, useState } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { MdDelete } from "react-icons/md";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
const SinPurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const data = [
    { id: 1, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
    { id: 2, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
    { id: 3, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
  ];

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Status", field: "createdDemand" },
    { headerName: "Date", field: "date" },
    { headerName: "Remarks", field: "remarks" },
    { headerName: "Action", field: "action" },
  ];

  const CustomActionComponent = () => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        // {
        //   label: "Edit",
        //   onClick: () => alert("Edit"),
        //   icon: <FaUserEdit />,
        // },
        {
          label: "Delete ",
          onClick: () => alert("Delete"),
          icon: <FaTrash />,
        },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  const fetchPurchaseOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/purchase-orders/${id}`);
      if (response.ok) {
        setPurchaseOrderData(response.data.data);
      } else {
        toast.error("Failed to fetch purchase order details.");
      }
    } catch (error) {
      console.error("Error fetching purchase order details:", error);
      toast.error("Something went wrong while fetching details.");
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-600";
      case "PENDING":
        return "bg-yellow-600";
      case "APPROVED":
        return "bg-green-600";
      case "REJECTED":
        return "bg-red-600";
      case "IN_STORE":
        return "bg-blue-600";
      case "PARTIAL":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  // Transform approvals data for table
  const transformApprovalsData = () => {
    if (!purchaseOrderData?.demand?.approvals) return [];
    
    return purchaseOrderData.demand.approvals.map((approval, index) => ({
      id: approval.id,
      name: approval.user?.name || "Unknown",
      createdDemand: approval.status,
      date: formatDate(approval.createdAt),
      remarks: approval.remarks || "No remarks",
      action: approval.id,
    }));
  };

  useEffect(() => {
    if (id) fetchPurchaseOrderDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-gray-600">Loading ..</p>
      </div>
    );
  }

  if (!purchaseOrderData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Purchase order not found or failed to load.</p>
      </div>
    );
  }

  const approvalsData = transformApprovalsData();

  return (
    <div className="px-4 md:px-6 py-4">
      <TopBar
        title="Purchase Order Detail Page"
        // detail="View detailed information about the purchase order"
      />

      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[#444444] font-semibold text-lg md:text-xl">
            {purchaseOrderData.referenceNumber}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <div className={`text-white ${getStatusColor(purchaseOrderData.status)} px-6 py-2 rounded-full text-sm`}>
              {purchaseOrderData.status}
            </div>
          </div>
        </div>

        <div className="border-t border-[#CDCDCD]"></div>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* <Info label="Demand ID" value={purchaseOrderData.demand?.referenceNumber || "N/A"} /> */}
          {/* <Info label="Demand Name" value={purchaseOrderData.demand?.referenceNumber || "N/A"} /> */}
          <Info label="Project" value={purchaseOrderData.demand?.section?.project?.name || "N/A"} />
          <Info label="Section" value={purchaseOrderData.section?.name || "N/A"} />
          <Info label="Material" value={purchaseOrderData.demand?.material?.name || "N/A"} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Info label="Demand Quantity" value={purchaseOrderData.demand?.quantity || "N/A"} />
          <Info label="Unit" value={purchaseOrderData.demand?.unit || "N/A"} />
          <Info label="PO Quantity" value={purchaseOrderData.quantity || "N/A"} />
          <Info label="Vendor ID" value={purchaseOrderData.vendorId || "N/A"} />
          <Info label="Created Date" value={formatDate(purchaseOrderData.createdAt)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Info label="Demand Status" value={purchaseOrderData.demand?.status || "N/A"} />
          <Info label="Quantity Fulfilled" value={purchaseOrderData.demand?.quantityFulfilled || "0"} />
          <Info label="Quantity Remaining" value={purchaseOrderData.demand?.quantityRemaining || "N/A"} />
          <Info label="Notes" value={purchaseOrderData.demand?.notes || "N/A"} />
          <Info label="Updated Date" value={formatDate(purchaseOrderData.updatedAt)} />
        </div>
      </div>

      {/* Approval History Table */}
      <div className="mt-8">
        <h4 className="text-[#444444] font-semibold text-lg md:text-xl">
          Approval History
        </h4>
        <p className="text-[#979797] text-sm">Track the approval process for this purchase order</p>
        {approvalsData.length > 0 ? (
          <SimpleTable
            data={approvalsData}
            columns={columns}
            cellComponents={{ action: CustomActionComponent }}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No approval history found.</p>
          </div>
        )}
      </div>

     
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[#444444] font-semibold text-sm sm:text-base">
      {label}:
    </p>
    <p className="text-[#979797] text-sm">{value}</p>
  </div>
);

export default SinPurchaseOrderDetailPage;
