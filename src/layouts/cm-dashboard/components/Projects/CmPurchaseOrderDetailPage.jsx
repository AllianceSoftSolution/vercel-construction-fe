import React, { useEffect, useState } from "react";
import ProjectInfoCard from "@/components/ui/ProjectInfoCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import { MdDelete } from "react-icons/md";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../../components/ui/Loader";
import { POPdfButtons } from "../../../../components/POPdfActions";

const CmPurchaseOrderDetail = () => {
  const { id } = useParams();
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Created Demand", field: "createdDemand" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "id" },
  ];

  const CustomActionComponent = ({ value: id }) => {
    return (
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
  };

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

  // Helper to safely access nested data
  const get = (obj, path, fallback = "-") => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || fallback;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4">
        <TopBar title="Purchase Order Detail Page" showIcon={true} />
      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <p className="text-[#444444] font-semibold text-xl">{purchaseOrderData?.referenceNumber || "Order Name Here"}</p>
          <POPdfButtons
            poId={purchaseOrderData?.id}
            referenceNumber={purchaseOrderData?.referenceNumber}
          />
          <div className="flex flex-wrap gap-2">
            <div className="text-white bg-[#BF1017] px-6 py-2 rounded-full text-center">{purchaseOrderData?.status || "Partial"}</div>
          </div>
        </div>
        <div className="h-[1px] bg-[#CDCDCD] w-full" />
        <div className="flex flex-wrap gap-4">
          <InfoItem label="Demand ID:" value={get(purchaseOrderData, 'demand.referenceNumber')} />
          <InfoItem label="Demand Name:" value={get(purchaseOrderData, 'demand.referenceNumber')} />
          <InfoItem label="Project" value={get(purchaseOrderData, 'demand.section.project.name')} />
          <InfoItem label="Section" value={get(purchaseOrderData, 'demand.section.name')} />
          <InfoItem label="Material" value={get(purchaseOrderData, 'demand.material.name')} />
        </div>
        <div className="flex flex-wrap gap-4">
          <InfoItem label="Quantity:" value={get(purchaseOrderData, 'demand.quantity')} />
          <InfoItem label="Unit" value={get(purchaseOrderData, 'demand.unit')} />
          <InfoItem label="PO Quantity" value={purchaseOrderData?.quantity || '-'} />
          <InfoItem label="Assigned Vendor" value={purchaseOrderData?.vendorId || '-'} />
          <InfoItem label="Vendor Phone No" value={"-"} />
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-[#444444] font-semibold text-xl">Store Sync Status</h4>
        {/* <p className="text-[#979797]">lorem ipsum dolor sit amet </p> */}
        <div className="overflow-x-auto">
          <SimpleTable
              tableTitle="store-sync-status"
            data={[]}
            columns={columns}
            cellComponents={{ id: CustomActionComponent }}
          />
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-[#444444] font-semibold text-xl">Finance</h4>
        {/* <p className="text-[#979797]">lorem ipsum dolor sit amet </p> */}
        <div className="overflow-x-auto">
          <SimpleTable
              tableTitle="finance"
            data={[]}
            columns={columns}
            cellComponents={{ id: CustomActionComponent }}
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <p className="text-[#444444] font-semibold text-base sm:text-xl">{label}</p>
    <p className="text-[#979797] text-base sm:text-lg">{value}</p>
  </div>
);

export default CmPurchaseOrderDetail;
