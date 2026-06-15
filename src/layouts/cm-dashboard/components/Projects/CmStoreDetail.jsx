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
import CustomTextField from "../../../../mui/CustomTextField";
import Button from "../../../../components/Button";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../../components/ui/Loader";
import StoreMovementHistoryTable from "../../../../components/store/StoreMovementHistoryTable";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  boxShadow: 24,
  borderRadius: "30px",
};

const CmStoreDetail = () => {
  const { id } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    { headerName: "Material", field: "materialName" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Stock", field: "stock" },
    { headerName: "Reserved", field: "reserved" },
    { headerName: "Available", field: "available" },
    { headerName: "Last Updated", field: "updatedAtFormatted" },
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

  const fetchStoreDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/stores/${id}`);
      if (response.ok) {
        setStoreData(response.data.store);
      } else {
        toast.error("Failed to fetch Store details.");
      }
    } catch (error) {
      console.error("Error fetching Store details:", error);
      toast.error("Something went wrong while fetching details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStoreDetail();
  }, [id]);

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
        <DropdownButton
          className="bg-[#FF0000] font-semibold"
          items={[
            { label: "Stock In", onClick: () => handleOpen("stock-in") },
            { label: "Stock Out", onClick: () => handleOpen("stock-out") },
          ]}
        >
          <IconButton>
            <BsThreeDotsVertical />
          </IconButton>
        </DropdownButton>

        <Modal open={open} onClose={handleClose}>
          <Box sx={style} className="bg-white p-5">
            <h1 className="text-3xl mb-4">
              {modalType === "stock-in" ? "Stock In" : "Stock Out"}
            </h1>
            <Box>
              <CustomTextField
                fullWidth
                margin="normal"
                label={
                  modalType === "stock-in"
                    ? "PO ( Purchase Order )"
                    : "Material"
                }
              />
              <CustomTextField
                fullWidth
                margin="normal"
                label="QTY ( Quantity )"
              />
              {modalType === "stock-out" && (
                <CustomTextField
                  fullWidth
                  margin="normal"
                  label="CM ( Construction Manager )"
                />
              )}
              <CustomTextField fullWidth margin="normal" label="Note" />
              {modalType === "stock-in" && (
                <CustomTextField fullWidth margin="normal" label="Product" />
              )}
              <Button buttonText="Save" onClick={handleClose} />
            </Box>
          </Box>
        </Modal>
      </>
    );
  };

  const [hasMemberInfo, setHasMemberInfo] = useState(false);

  if (loading) {

    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <TopBar
        title="Store Detail"
        showIcon={true}
        // detail="lorem ipsum dolor sit amet"
        // showExport={true}
      />

      <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col gap-4 p-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-y-2">
          <p className="text-[#444444] font-semibold text-lg md:text-xl">
            Order Name Here
          </p>
          <div className="flex items-center justify-between sm:flex-row gap-2  sm:items-center">
            <div className="text-white bg-[#BF1017] px-6 py-1.5 rounded-full text-sm">
              IN-STORE
            </div>
            <CustomActionComponent />
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full"></div>
        <div className="flex justify-between gap-x-4 flex-wrap">
          <InfoRow label="Store ID:" value={storeData?.id || "-"} />
          <InfoRow label="Store Name:" value={storeData?.name || "-"} />
          <InfoRow
            label="Project:"
            value={storeData?.section?.name?.split(" of ")[1] || "-"}
          />
          <InfoRow label="Section:" value={storeData?.section?.name || "-"} />
          <InfoRow
            label="Material:"
            value={storeData?.inventory?.[0]?.material?.name || "N/A"}
          />{" "}
          <InfoRow
            label="Store Incharge:"
            value={
              storeData?.storeInchargeAssignments?.[0]?.user?.name || "N/A"
            }
          />
        </div>
      </div>

      <div>
        <h4 className="mt-8 text-[#12141D] font-semibold text-xl">
          Members Overview
        </h4>
        {hasMemberInfo ? (
          <MemberInfoCard
            title="General information - Store Incharge"
            image={manager}
            name="Manager name here"
            phone="+92 300 000 090"
            role="Store Head"
            email="example@gmail.com"
            joiningDate="January 8, 2001"
            id="9090"
            address="address here"
            country="United States"
            linkedStores={["Store A", "Store B", "Store C"]}
          />
        ) : (
          <MemebersOverviewCard
            title="General Information"
            subTitle="Store Incharge"
            linkText="Assign Store Incharge"
            imageSrc={Search}
            imageAlt="Search Illustration"
            onManagerClick={() => setHasMemberInfo(true)}
          />
        )}
      </div>

      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Inventory</h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet</p>
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable
              tableTitle="store-inventory" data={inventoryTableData} columns={columns} cellComponents={{}} />

      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Stock Movement History
      </h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet</p>
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <StoreMovementHistoryTable
        storeData={storeData}
        storeId={id}
        onRefresh={fetchStoreDetail}
      />
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
    <p className="text-[#444444] font-semibold text-sm sm:text-base">{label}</p>
    <p className="text-[#979797] text-sm sm:text-base">{value}</p>
  </div>
);

export default CmStoreDetail;
