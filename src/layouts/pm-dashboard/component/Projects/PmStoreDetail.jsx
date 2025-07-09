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

  const stockIn = [
    { id: "1", label: "PO ( Purchase Order )" },
    { id: "2", label: "QTY ( Quantity )" },
    { id: "3", label: "Note" },
    { id: "4", label: "Product" },
  ];

  const stockOut = [
    { id: "1", label: "Material" },
    { id: "2", label: "QTY ( Quantity )" },
    { id: "3", label: "Note" },
    { id: "4", label: "CM ( Construction Manager )" },
  ];

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

    const currentOptions = modalType === "stock-in" ? stockIn : stockOut;

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
      <TopBar
        title="Store Detail"
        detail="lorem ipsum dolor sit amet"
        showExport={true}
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
            value={storeData?.inventory?.[0]?.material || "N/A"}
          />
          <InfoRow
            label="Store Incharge:"
            value={
              storeData?.storeInchargeAssignments?.[0]?.user?.name || "N/A"
            }
          />
        </div>
      </div>

      {/* Member Info */}
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

      {/* Inventory Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">Inventory</h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet</p>
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>

      <SimpleTable
        data={storeData.inventory}
        columns={columns}
        cellComponents={{}}
      />

      {/* Stock Movement Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Stock Movement History
      </h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet</p>
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable
        data={storeData.transactions}
        columns={columns1}
        cellComponents={{}}
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

export default PmStoreDetail;
