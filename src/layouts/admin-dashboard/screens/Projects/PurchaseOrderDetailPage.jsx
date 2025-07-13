import React, { useState, useEffect } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import Loader from "../../../../components/ui/Loader";
import { MdDelete } from "react-icons/md";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const PurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Status", field: "status" },
    { headerName: "Remarks", field: "remarks" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];

  const CustomActionComponent = () => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "Edit",
          onClick: () => alert("Edit"),
          icon: <FaUserEdit />,
        },
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

  useEffect(() => {
    if (id) fetchPurchaseOrderDetail();
  }, [id]);

  // Prepare approvals data for Store Sync Status table
  const storeSyncData =
    purchaseOrderData?.demand?.approvals?.map((approval) => ({
      id: approval.id,
      name: approval.user?.name || "-",
      createdDemand: approval.status || "-",
      date: approval.createdAt
        ? new Date(approval.createdAt).toLocaleDateString()
        : "-",
      action: "",
    })) || [];

 

  return (
    <div className="px-4 md:px-6 py-4">
      {loading ? (
        <Loader />
      ) : (
        <>
      <TopBar
        title="Purchase Order Detail Page"
        detail="lorem ipsum dolor sit amet"
      />

      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader />
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <p className="text-[#444444] font-semibold text-lg md:text-xl">
                {purchaseOrderData?.referenceNumber || "Order Name Here"}
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="text-white bg-[#BF1017] px-6 py-2 rounded-full text-sm">
                  {purchaseOrderData?.status || "Partial"}
                </div>
                <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
              </div>
            </div>

            <div className="border-t border-[#CDCDCD]"></div>

            {/* Info Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <Info
                label="Demand ID"
                value={purchaseOrderData?.demand?.referenceNumber || "-"}
              />
              <Info
                label="Demand Name"
                value={purchaseOrderData?.demand?.referenceNumber || "-"}
              />
              <Info
                label="Project"
                value={purchaseOrderData?.demand?.section?.project?.name || "-"}
              />
              <Info
                label="Section"
                value={purchaseOrderData?.demand?.section?.name || "-"}
              />
              <Info label="Material" value={purchaseOrderData?.materialId || "-"} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <Info
                label="Quantity"
                value={purchaseOrderData?.demand?.quantity || "-"}
              />
              <Info label="Unit" value={purchaseOrderData?.demand?.unit || "-"} />
              <Info
                label="PO Quantity"
                value={purchaseOrderData?.quantity || "-"}
              />
              <Info
                label="Assigned Vendor"
                value={purchaseOrderData?.vendorId || "-"}
              />
              <Info
                label="Vendor Phone No"
                value={purchaseOrderData?.vendor?.phone || "-"}
              />
            </div>
          </>
        )}
      </div>

      {/* Tables */}
      <div className="mt-8">
        <h4 className="text-[#444444] font-semibold text-lg md:text-xl">
          Store Sync Status
        </h4>
        <p className="text-[#979797] text-sm">lorem ipsum dolor sit amet</p>
        <div className="relative">
          {loading ? (
            <div className="border rounded-lg p-8 bg-white flex items-center justify-center min-h-[200px]">
              <Loader />
            </div>
          ) : (
            <SimpleTable
              data={storeSyncData}
              columns={columns}
              cellComponents={{ action: CustomActionComponent }}
            />
          )}
            </div>
          </div>
        </>
      )}
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

export default PurchaseOrderDetailPage;
