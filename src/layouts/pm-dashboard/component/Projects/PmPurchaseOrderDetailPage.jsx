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


const PmPurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Created Demand", field: "createdDemand" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "id" },
  ];

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

  const CustomActionComponent = ({ value: id }) => {
    return (
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
  };

  // Helper to safely access nested data
  const get = (obj, path, fallback = "-") => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || fallback;
  };

  return (
    <>
      {loading ? <Loader/> : (
        <>
          <TopBar
        title="Purchase Order Detail "
        showIcon={true}
        // detail="lorem ipsum dolor sit amet"
      />
      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 w-full">
          <p className="text-[#444444] font-semibold text-xl">
            {purchaseOrderData?.referenceNumber || "Order Name Here"}
          </p>
          <div className="flex items-center gap-2">
            <div className="text-white bg-[#BF1017] px-6 sm:px-8 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
              {purchaseOrderData?.status || "Partial"}
            </div>
          </div>
        </div>
        <div className="h-[1px] bg-[#CDCDCD] w-full "></div>
        <div className="flex justify-between gap-x-4 flex-wrap">
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Demand ID:</p>
            <p className="text-[#979797]">{get(purchaseOrderData, 'demand.referenceNumber')}</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Demand Name:</p>
            <p className="text-[#979797]">{get(purchaseOrderData, 'demand.referenceNumber')}</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Project</p>
            <p className="text-[#979797]">{get(purchaseOrderData, 'demand.section.project.name')}</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Section</p>
            <p className="text-[#979797]">{get(purchaseOrderData, 'demand.section.name')}</p>
          </div>
          <div className="flex gap-x-4 items-center">
            <p className="text-[#444444] font-semibold text-xl">Material</p>
            <p className="text-[#979797]">{get(purchaseOrderData, 'demand.material.name')}</p>
          </div>
        </div>
        <div className="flex justify-start gap-x-14 flex-wrap">
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Quantity:</p>
            <p className="text-[#979797]">{get(purchaseOrderData, 'demand.quantity')}</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Unit</p>
            <p className="text-[#979797]">{get(purchaseOrderData, 'demand.unit')}</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">PO Quantity</p>
            <p className="text-[#979797]">{purchaseOrderData?.quantity || '-'}</p>
          </div>
          <div className="flex gap-x-4 items-center mt-2">
            <p className="text-[#444444] font-semibold text-xl">Assigned Vendor</p>
            <p className="text-[#979797]">{purchaseOrderData?.vendorId || '-'}</p>
          </div>
          <div className="flex gap-x-4 items-center mt-6">
            <p className="text-[#444444] font-semibold text-xl">Vendor Phone No</p>
            <p className="text-[#979797]">-</p>
          </div>
        </div>
      </div>
      <h4 className="mt-8 text-[#444444] font-semibold text-xl mb-4">Store Sync Status</h4>
      {/* <p className="text-[#979797]">lorem ipsum dolor sit amet </p> */}
      <SimpleTable
              tableTitle="store-sync-status"
        data={[]}
        columns={columns}
        cellComponents={{ id: CustomActionComponent }}
      />
      <h4 className="mt-8 text-[#444444] font-semibold text-xl mb-4">Finance</h4>
      {/* <p className="text-[#979797]">lorem ipsum dolor sit amet </p> */}
      <SimpleTable
              tableTitle="finance"
        data={[]}
        columns={columns}
        cellComponents={{ id: CustomActionComponent }}
      />
        </>
      )}
    </>
  );
};

export default PmPurchaseOrderDetailPage;
