import React, { useState } from "react";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
  borderRadius: "50px",
};

const CmStoreDetail = () => {
  const data = [
    {
      id: 1,
      material: "Cement",
      linkedDemand: "dm-2345",
      poQuantity: 100,
      received: 11,
      issued: 111,
      balance: 11,
      lastUpdated: "11-12-25",
      vendor: "111",
      status: "In-Store",
    },
    {
      id: 2,
      material: "Cement",
      linkedDemand: "dm-2345",
      poQuantity: 100,
      received: 11,
      issued: 111,
      balance: 11,
      lastUpdated: "11-12-25",
      vendor: "111",
      status: "In-Store",
    },
    {
      id: 3,
      material: "Cement",
      linkedDemand: "dm-2345",
      poQuantity: 100,
      received: 11,
      issued: 111,
      balance: 11,
      lastUpdated: "11-12-25",
      vendor: "111",
      status: "In-Store",
    },
  ];

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

  const data1 = [
    {
      id: 1,
      date: "12-12-25",
      material: "Cement",
      type: "issued",
      qty: "20bags",
      handledBy: "John Doe",
      remarks: "For base pour",
    },
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
    { id: "3", label: "CM ( Construction Manager )" },
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
          <Box sx={style}>
            <div className="bg-white p-5">
              <h1 className="text-2xl font-medium text-[#222222] mb-8">
                {modalType === "stock-in" ? (
                  <>
                    <h1 className="text-3xl">Stock In</h1>
                    <Box>
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
                      <CustomTextField
                        fullWidth
                        margin="normal"
                        label="Product"
                      />
                      <Button buttonText={"Save"} onClick={handleClose} />
                    </Box>
                  </>
                ) : (
                  <>
                  <h1 className="text-3xl">Stock Out</h1>
                    <Box>
                      <CustomTextField
                        fullWidth
                        margin="normal"
                        label="Material"
                      />
                      <CustomTextField
                        fullWidth
                        margin="normal"
                        label="QTY ( Quantity )"
                      />
                      <CustomTextField
                        fullWidth
                        margin="normal"
                        label="CM ( Construction Manager )"
                      />
                      <Button buttonText={"Save"} onClick={handleClose}/>
                    </Box>
                  </>
                )}
              </h1>
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
        buttonText="Add Store"
      />

      <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
        <div className="flex justify-between">
          <p className="text-[#444444] font-semibold text-xl">
            Order Name Here
          </p>
          <div className="flex gap-x-2">
            <div className="text-white bg-[#BF1017] px-12 py-2 rounded-full">
              IN-STORE
            </div>
            <CustomActionComponent />
          </div>
        </div>

        <div className="h-[1px] bg-[#CDCDCD] w-full "></div>

        <div className="flex justify-between gap-x-4 flex-wrap">
          <InfoRow label="Store ID:" value="store id" />
          <InfoRow label="Store Name:" value="store name" />
          <InfoRow label="Project:" value="project" />
          <InfoRow label="Section:" value="section" />
          <InfoRow label="Material:" value="material" />
        </div>

        <div className="flex justify-start gap-x-14 flex-wrap">
          <InfoRow label="Store Incharge:" value="store incharge" />
          <InfoRow label="Received:" value="received" />
          <InfoRow label="PO Quantity:" value="po quantity" />
          <InfoRow label="Issued:" value="issued" />
          <InfoRow label="Balance:" value="balance" />
          <InfoRow label="CM Name:" value="cm name" />
          <InfoRow label="Accountant:" value="accountant" />
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
      <SimpleTable data={data} columns={columns} cellComponents={{}} />

      {/* Stock Movement Table */}
      <h4 className="mt-8 text-[#444444] font-semibold text-xl">
        Stock Movement History
      </h4>
      <p className="text-[#979797]">lorem ipsum dolor sit amet</p>
      <div className="h-[1px] bg-[#CDCDCD] w-full mt-2"></div>
      <SimpleTable data={data1} columns={columns1} cellComponents={{}} />
    </>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex gap-x-4 items-center mt-2">
    <p className="text-[#444444] font-semibold text-xl">{label}</p>
    <p className="text-[#979797]">{value}</p>
  </div>
);

export default CmStoreDetail;
