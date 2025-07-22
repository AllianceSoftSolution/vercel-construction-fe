import React, { useState, useEffect } from "react";
import MemebersOverviewCard from "../../../../mui/MembersOverviewCard";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../../components/SimpleTable";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { Box, IconButton, Modal } from "@mui/material";
import Search from "../../../../../src/assets/construction/Search.png";
import manager from "../../../../../src/assets/construction/manager.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import { Check } from "@mui/icons-material";
import CustomTextField from "../../../../mui/CustomTextField";
import Button from "../../../../components/Button";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../../components/ui/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};

const SinStoreDetail = () => {
  const { id } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/stores/${id}`);
        if (response.ok) {
          setStoreData(response.data.store);
        } else {
          setError("Failed to fetch store details");
          toast.error("Failed to fetch store details");
        }
      } catch (error) {
        setError("Error fetching store details");
        toast.error("Error fetching store details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStoreDetail();
  }, [id]);

  const columns = [
    { headerName: "Material", field: "material" },
    { headerName: "Linked Demand", field: "linkedDemand" },
    { headerName: "PO Quantity", field: "poQuantity" },
    { headerName: "Received", field: "received" },
    { headerName: "Issued", field: "issued" },
    { headerName: "Balance", field: "balance" },
    { headerName: "Last Updated", field: "lastUpdated" },
    { headerName: "Vendor", field: "vendor" },
    { headerName: "Status", field: "status" },
  ];

  const columns1 = [
    { headerName: "Material", field: "material" },
    { headerName: "Date", field: "date" },
    { headerName: "Type", field: "type" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Handled By", field: "handledBy" },
    { headerName: "Remarks", field: "remarks" },
  ];


  const [hasMemberInfo, setHasMemberInfo] = useState(false);

  // Head Store Table Columns
  const headStoreColumns = [
    { headerName: "Assignment ID", field: "id" },
    { headerName: "Store Incharge Name", field: "userName" },
    { headerName: "Email", field: "email" },
    { headerName: "Role", field: "role" },
    { headerName: "Assigned At", field: "createdAt" },
  ];

  // Head Store Table Data
  const headStoreData = (storeData?.storeInchargeAssignments || []).map(a => ({
    id: a.id,
    userName: a.user?.name || "-",
    email: a.user?.email || "-",
    role: a.user?.role || "-",
    createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "-",
  }));

  return (
    <>
      <TopBar
        title="Store Detail"
          // detail="lorem ipsum dolor sit amet"
        // showExport={true}
      />
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500 text-lg">{error}</div>
      ) : (
        <>
          <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-y-4 md:gap-y-0">
              <p className="text-[#444444] font-semibold text-xl">
                {storeData?.name || "Store Name"}
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="text-white bg-[#BF1017] px-6 py-2 rounded-full text-sm md:text-base">
                  {storeData?.isActive ? "ACTIVE" : "INACTIVE"}
                </div>
              </div>
            </div>
            <div className="h-[1px] bg-[#CDCDCD] w-full " />
            <div className="flex flex-wrap gap-x-4">
              <InfoRow label="Store ID:" value={storeData?.id || "-"} />
              <InfoRow label="Store Name:" value={storeData?.name || "-"} />
              <InfoRow label="Project:" value={storeData?.section?.name?.split(" of ")[1] || "-"} />
              <InfoRow label="Section:" value={storeData?.section?.name || "-"} />
            </div>
          </div>
          {/* Head Store Table */}
          <h4 className="mt-8 text-[#444444] font-semibold text-xl">Head Store Assignments</h4>
          <SimpleTable data={headStoreData} columns={headStoreColumns} />
        

          {/* Inventory Table */}
          <h4 className="mt-8 text-[#444444] font-semibold text-xl ">Inventory</h4>
          {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
          <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
          <SimpleTable data={storeData?.inventory || []} columns={columns} cellComponents={{}} />

          {/* Stock Movement Table */}
          <h4 className="mt-8 text-[#444444] font-semibold text-xl ">
            Stock Movement History
          </h4>
          {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
          <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
          <SimpleTable data={storeData?.transactions || []} columns={columns1} cellComponents={{}} />
        </>
      )}
    </>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex gap-x-4 items-center mt-2">
    <p className="text-[#444444] font-semibold text-xl">{label}</p>
    <p className="text-[#979797]">{value}</p>
  </div>
);

export default SinStoreDetail;
