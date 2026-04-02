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
import AssignMemberModal from "../../../../components/AssignMemberModal";

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
  const [openAssignStoreInchargeModal, setOpenAssignStoreInchargeModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
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
    { headerName: "Material", field: "materialName" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Stock", field: "stock" },
    { headerName: "Reserved", field: "reserved" },
    { headerName: "Available", field: "available" },
    { headerName: "Last Updated", field: "updatedAtFormatted" },
  ];

  const columns1 = [
    { headerName: "Material", field: "materialName" },
    { headerName: "Type", field: "type" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Reference", field: "reference" },
    { headerName: "Notes", field: "notes" },
    { headerName: "Date", field: "transactionDateFormatted" },
  ];

  const inventoryTableData = (storeData?.inventory || []).map((item) => ({
    ...item,
    materialName: item.material?.name || "-",
    unit: item.material?.unit || "-",
    updatedAtFormatted: item.updatedAt
      ? new Date(item.updatedAt).toLocaleDateString("en-GB")
      : "-",
  }));

  const transactionsTableData = (storeData?.transactions || []).map((item) => {
    const inv = (storeData?.inventory || []).find(
      (inv) => inv.materialId === item.materialId
    );
    return {
      ...item,
      materialName: inv?.material?.name || item.materialId || "-",
      transactionDateFormatted: item.transactionDate
        ? new Date(item.transactionDate).toLocaleDateString("en-GB")
        : "-",
    };
  });


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
  // Format text for display (roles, types, etc.)
  const formatText = (text) => {
    if (!text) return "-";
    
    // Convert text to title case and replace underscores with spaces
    return text
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  const headStoreData = (storeData?.storeInchargeAssignments || []).map(a => ({
    id: a.id,
    userName: a.user?.name || "-",
    email: a.user?.email || "-",
    role: formatText(a.user?.role) || "Store Incharge",
    createdAt: formatDate(a.createdAt),
  }));

  const fetchStoreInchargeUsers = async () => {
    try {
      // Use sectionId instead of projectId for fetching store incharge users
      const sectionId = storeData?.sectionId || storeData?.section?.id;
      const response = await apiClient.get(`/assignments/users-by-role`, {
        role: "STORE_INCHARGE",
        sectionId: sectionId,
      });
      if (response.ok && response.data?.users) {
        return response.data.users;
      }
      return [];
    } catch (e) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const createStoreInchargeUser = async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register`, {
        ...userData,
        role: "STORE_INCHARGE",
      });
      if (response.ok && response.data?.user) {
        toast.success("User created successfully");
        return response.data.user;
      }
      toast.error(response.data?.message || "Failed to create user");
      return null;
    } catch (e) {
      toast.error("Failed to create user");
      return null;
    }
  };

  const handleAssignStoreInchargeGeneric = async ({ userId }) => {
    try {
      setModalLoading(true);
      const response = await apiClient.post(`/assignments/store-incharge`, {
        userId,
        storeId: id,
      });
      if (response.ok) {
        toast.success("Store Incharge assigned successfully!");
        // Refresh the store data
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
        fetchStoreDetail();
        setOpenAssignStoreInchargeModal(false);
        return true;
      } else {
        toast.error(
          response.data?.message || "Failed to assign Store Incharge"
        );
        return false;
      }
    } catch (e) {
      toast.error("Failed to assign Store Incharge");
      return false;
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <TopBar
        title="Store Detail"
        showIcon={true}
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
              {/* <InfoRow label="Store ID:" value={storeData?.id || "-"} /> */}
              <InfoRow label="Store Name:" value={storeData?.name || "-"} />
              <InfoRow label="Project:" value={storeData?.section?.project?.name || "-"} />
              <InfoRow label="Section:" value={storeData?.section?.name || "-"} />
            </div>
          </div>
          {/* Head Store Table */}
          <div className="mt-10">
          <TopBar
            title="Store Incharge "
            buttonText="Add Store Incharge"
            onButtonClick={() => setOpenAssignStoreInchargeModal(true)}
            />
                     <SimpleTable
             data={(storeData?.storeInchargeAssignments || []).map(a => ({
               id: a.id,
               userName: a.user?.name || "-",
               email: a.user?.email || "-",
               role: formatText(a.user?.role) || "Store Incharge",
               createdAt: formatDate(a.createdAt),
             }))}
             columns={[
              //  { headerName: "Assignment ID", field: "id" },
               { headerName: "Store Incharge Name", field: "userName" },
               { headerName: "Email", field: "email" },
               { headerName: "Role", field: "role" },
               { headerName: "Assigned At", field: "createdAt" },
             ]}
             cellComponents={{}}
           />
          </div>
        

          {/* Inventory Table */}
          <h4 className="mt-8 text-[#444444] font-semibold text-xl ">Inventory</h4>
          {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
          <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
          <SimpleTable data={inventoryTableData} columns={columns} cellComponents={{}} />

          {/* Stock Movement Table */}}
          <h4 className="mt-8 text-[#444444] font-semibold text-xl ">
            Stock Movement History
          </h4>
          {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
          <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
          <SimpleTable data={transactionsTableData} columns={columns1} cellComponents={{}} />
        </>
      )}

      <AssignMemberModal
        role="Store Incharge"
        open={openAssignStoreInchargeModal}
        onClose={() => setOpenAssignStoreInchargeModal(false)}
        fetchUsers={fetchStoreInchargeUsers}
        createUser={createStoreInchargeUser}
        onAssign={handleAssignStoreInchargeGeneric}
      />
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
