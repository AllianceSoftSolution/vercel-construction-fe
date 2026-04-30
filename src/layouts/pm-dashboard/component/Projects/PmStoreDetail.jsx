import React, { useEffect, useState } from "react";
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
import Loader from "../../../../components/ui/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
  borderRadius: "50px",
};

const PmStoreDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState({});

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/stores/${id}`);
      if (response?.data?.store) {
        setStoreData(response.data.store);
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
    if (id) fetchStoreDetails();
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
    { headerName: "Flow (From/To)", field: "flowStore" },
    { headerName: "Reference", field: "reference" },
    { headerName: "Notes", field: "notes" },
    { headerName: "Date", field: "transactionDateFormatted" },
  ];

  const inventoryTableData = (storeData?.inventory || [])
    .filter((item) => item && typeof item === "object" && item.id)
    .map((item) => ({
      ...item,
      materialName: item.material?.name || "-",
      unit: item.material?.unit || "-",
      updatedAtFormatted: item.updatedAt
        ? new Date(item.updatedAt).toLocaleDateString("en-GB")
        : "-",
    }));

  const transactionsTableData = (storeData?.transactions || [])
    .filter((item) => item && typeof item === "object" && item.id)
    .map((item) => {
      const inv = (storeData?.inventory || [])
        .filter((inv) => inv && typeof inv === "object" && inv.materialId)
        .find((inv) => inv.materialId === item.materialId);
      return {
        ...item,
        materialName: inv?.material?.name || item.materialId || "-",
        transactionDateFormatted: item.transactionDate
          ? new Date(item.transactionDate).toLocaleDateString("en-GB")
          : "-",
        flowStore: item.type === 'OUT'
          ? (item.toStore ? `→ ${item.toStore.name}` : '—')
          : item.type === 'IN'
          ? (item.fromStore ? `← ${item.fromStore.name}` : '—')
          : '—',
      };
    });



  const CustomActionComponent = () => {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState("");

    const handleOpen = (type) => {
      setModalType(type);
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
      setModalType("");
    };


    return (
      <>
      

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "12px",
              p: { xs: 2, sm: 4 },
            }}
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#222222] mb-2">
                {modalType === "stock-in" ? "Stock In" : "Stock Out"}
              </h1>

              {modalType === "stock-in" ? (
                <>
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="PO ( Purchase Order )"
                  />
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="QTY ( Quantity )"
                  />
                  <CustomTextField fullWidth margin="normal" label="Note" />
                  <CustomTextField fullWidth margin="normal" label="Product" />
                </>
              ) : (
                <>
                  <CustomTextField fullWidth margin="normal" label="Material" />
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="QTY ( Quantity )"
                  />
                  <CustomTextField fullWidth margin="normal" label="Note" />
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="CM ( Construction Manager )"
                  />
                </>
              )}

              <div className="mt-4 flex justify-end">
                <Button buttonText={"Save"} onClick={handleClose} />
              </div>
            </div>
          </Box>
        </Modal>
      </>
    );
  };

  const [hasMemberInfo, setHasMemberInfo] = useState(false);

  return (
    <>
      {loading ? <Loader/> : (
        <>
          <TopBar
        title="Store Detail"
        showIcon={true}
        // detail="lorem ipsum dolor sit amet"
        // showExport={true}
      />

      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <p className="text-[#444444] font-semibold text-lg sm:text-xl">
            {storeData?.name || "Store Name"}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-white bg-[#BF1017] px-6 py-1.5 rounded-full text-sm sm:text-base">
              IN-STORE
            </div>
            <CustomActionComponent />
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full "></div>

        <div className="flex justify-between gap-x-4 flex-wrap">
          <InfoRow label="Store Name:" value={storeData?.name || "-"} />
          <InfoRow
            label="Project:"
            value={storeData?.section?.name?.split(" of ")[1] || "-"}
          />
          <InfoRow label="Section:" value={storeData?.section?.name || "-"} />
          <InfoRow
            label="Material:"
            value={storeData?.inventory?.[0]?.material?.name || "N/A"}
          />
          <InfoRow
            label="Store Incharge:"
            value={
              storeData?.storeInchargeAssignments?.[0]?.user?.name || "N/A"
            }
          />
        </div>
      </div>

      {/* Store Incharge Assignments Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Store Incharge Assignments</h4>
      <SimpleTable
        data={(storeData?.storeInchargeAssignments || [])
          .filter((a) => a && typeof a === "object" && a.id)
          .map(a => ({
            id: a.id,
            userName: a.user?.name || "-",
            email: a.user?.email || "-",
            role: a.user?.role || "-",
            createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "-",
          }))}
        columns={[
          { headerName: "Assignment ID", field: "id" },
          { headerName: "Store Incharge Name", field: "userName" },
          { headerName: "Email", field: "email" },
          { headerName: "Role", field: "role" },
          { headerName: "Assigned At", field: "createdAt" },
        ]}
        cellComponents={{}}
      />

      {/* Inventory Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Inventory</h4>
      {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>

      <SimpleTable
        data={inventoryTableData}
        columns={columns}
        cellComponents={{}}
      />

      {/* Stock Movement Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Stock Movement History
      </h4>
      {/* <p className="text-[#979797]">lorem ipsum dolor sit amet</p> */}
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable
        data={transactionsTableData}
        columns={columns1}
        cellComponents={{}}
      />
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

export default PmStoreDetail;
