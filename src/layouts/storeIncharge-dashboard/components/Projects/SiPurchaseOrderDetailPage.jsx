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
import  apiClient  from "../../../../api/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SiPurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const data = [
    { id: 1, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
    { id: 2, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
    { id: 3, name: "John Doe", createdDemand: "Approved", date: "12/3/25" },
  ];

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Created Demand", field: "createdDemand" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];

  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          { label: "Edit", onClick: () => alert("Edit"), icon: <FaUserEdit /> },
          {
            label: "Delete",
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

  return (
    <div className="">
      <TopBar
        title="Purchase Order Detail Page"
        detail="lorem ipsum dolor sit amet"
      />

      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-[#444444] font-semibold text-xl">
            {purchaseOrderData?.referenceNumber || "Order Name Here"}
          </p>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap items-center">
            <div className="text-white bg-[#BF1017] px-6 py-2 rounded-full text-center text-sm">
              {purchaseOrderData?.status || "-"}
            </div>
            {/* <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" /> */}
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full" />

        <div className="flex flex-wrap justify-between gap-y-4">
          <InfoRow label="Demand ID:" value={purchaseOrderData?.demand?.id || "-"} />
          <InfoRow label="Demand Name:" value={purchaseOrderData?.demand?.referenceNumber || "-"} />
          <InfoRow label="Project" value={purchaseOrderData?.demand?.section?.project?.name || "-"} />
          <InfoRow label="Section" value={purchaseOrderData?.demand?.section?.name || "-"} />
          <InfoRow label="Material" value={purchaseOrderData?.material?.name || purchaseOrderData?.materialId || "-"} />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-4 mt-2">
          <InfoRow label="Quantity:" value={purchaseOrderData?.demand?.quantity || "-"} />
          <InfoRow label="Unit" value={purchaseOrderData?.demand?.unit || "-"} />
          <InfoRow label="PO Quantity" value={purchaseOrderData?.quantity || "-"} />
          <InfoRow label="Assigned Vendor" value={purchaseOrderData?.vendorId || "-"} />
          {/* If you have vendor details, show phone/email here */}
        </div>
      </div>

      {/* Approvals Table */}
      {/* {purchaseOrderData?.demand?.approvals && purchaseOrderData.demand.approvals.length > 0 && (
        <SectionTable
          title="Approvals"
          description="Approval history for this demand"
          columns={[
            { headerName: "User", field: "userName" },
            { headerName: "Role", field: "role" },
            { headerName: "Status", field: "status" },
            { headerName: "Remarks", field: "remarks" },
            { headerName: "Date", field: "createdAt" },
          ]}
          data={purchaseOrderData.demand.approvals.map(a => ({
            userName: a.user?.name || "-",
            role: a.user?.role || "-",
            status: a.status || "-",
            remarks: a.remarks || "-",
            createdAt: a.createdAt ? new Date(a.createdAt).toLocaleString() : "-",
          }))}
          action={undefined}
        />
      )} */}

      <SectionTable
        title="Store Sync Status"
        description="lorem ipsum dolor sit amet"
        columns={columns}
        data={data}
        action={CustomActionComponent}
      />

      {/* <SectionTable
        title="Finance"
        description="lorem ipsum dolor sit amet"
        columns={columns}
        data={data}
        action={CustomActionComponent}
      /> */}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex gap-2 items-center min-w-[150px]">
    <p className="text-[#444444] font-semibold text-base sm:text-xl">{label}</p>
    <p className="text-[#979797] text-sm sm:text-base">{value}</p>
  </div>
);

const SectionTable = ({ title, description, columns, data, action }) => (
  <div className="mt-8 w-full overflow-x-auto">
    <h4 className="text-[#444444] font-semibold text-xl">{title}</h4>
    <p className="text-[#979797] mb-2">{description}</p>
    <SimpleTable data={data} columns={columns} cellComponents={{ action }} />
  </div>
);

export default SiPurchaseOrderDetailPage;
