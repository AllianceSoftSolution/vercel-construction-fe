import React, { useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";
import DropdownButton from "../../../comments/components/DropdownButton";
import { Box, IconButton, Modal } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import CustomTextField from "../../../mui/CustomTextField";
import Button from "../../../components/Button";
import PayableDetails from "./Projects/PayableDetail";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};

const AddPriceModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={style} className="bg-white p-5 rounded-xl">
      <h1 className="text-3xl font-semibold mb-4">Add Price Details</h1>
      <div className="flex flex-col gap-5">
        <CustomTextField label="PO Quantity" placeholder="Enter PO Quantity" />
        <CustomTextField label="Material" placeholder="Enter Material" />
        <CustomTextField label="Price" placeholder="Enter Price" />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button buttonText="Cancel" onClick={onClose} />
        <Button buttonText="Add Price" />
      </div>
    </Box>
  </Modal>
);

const TransactionModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={style} className="bg-white p-5 rounded-xl">
      <h1 className="text-3xl font-semibold mb-4">Transaction Details</h1>
      <div className="flex flex-col gap-5">
        <CustomTextField label="Total Balance" placeholder="Enter Total Balance" />
        <CustomTextField label="Received Balance" placeholder="Enter Received Balance" />
        <label className="text-sm font-medium text-gray-700">Upload File</label>
        <input type="file" className="border border-gray-300 rounded p-2" />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button buttonText="Cancel" onClick={onClose} />
        <Button buttonText="Submit" />
      </div>
    </Box>
  </Modal>
);

const CustomActionComponent = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[{ label: "Add Price", onClick: () => setOpen(true) }]}
      >
        <IconButton><BsThreeDotsVertical /></IconButton>
      </DropdownButton>
      <AddPriceModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const ActionComforRegPOs = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[{ label: "Transaction to Add", onClick: () => setOpen(true) }]}
      >
        <IconButton><BsThreeDotsVertical /></IconButton>
      </DropdownButton>
      <TransactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
const ActionComForPayableDetails = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const onNavigation=()=>{
    navigate('/admin-dashboard/payables/details/:id')
  }
  return (
    <>
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[{ label: "Details", onClick: onNavigation }]}
      >
        <IconButton><BsThreeDotsVertical /></IconButton>
      </DropdownButton>
      <TransactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const Payables = () => {
  const data = [
    {
      id: 1,
      poRefer: "PO-001",
      project: "Bridge Construction",
      demand: "Cement",
      section: "A1",
      qty: 120,
      payables: "Pending",
      amount: 12000,
      vendors: "Qurrat",
    },
  ];

  const columns = [
    { headerName: "PO Ref", field: "poRefer" },
    { headerName: "Projects", field: "project" },
    { headerName: "Demands", field: "demand" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty Received", field: "qty" },
    { headerName: "Payables", field: "payables" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Vendors", field: "vendors" },
    { headerName: "Action", field: "action" },
  ];

  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
    
      <TopBar
        title="Payables"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showFilter={true}
        filterOptions={["Assigned", "Not-Assigned"]}
        onFilterChange={(selected) => console.log("Selected Filters:", selected)}
      />

      <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        <AnalyticsCard label="Total Payables" icon={IoMdArrowDropdown} count={120000} />
        <AnalyticsCard label="Total Paid" icon={IoMdArrowDropdown} count={250000} />
        <AnalyticsCard label="Balance Remaining" icon={IoMdArrowDropdown} count={1900000} />
      </div>

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <div className="overflow-x-auto">
        <SimpleTable columns={columns} data={data} cellComponents={{action: ActionComForPayableDetails}} />
      </div>

      <div className="mt-16">
        <h1 className="text-2xl mb-5 font-bold">New Purchase Orders</h1>
        <SimpleTable columns={columns} data={data} cellComponents={{ action: CustomActionComponent }} />
      </div>

      <div className="mt-16">
        <h1 className="text-2xl mb-5 font-bold">Regular POs</h1>
        <SimpleTable columns={columns} data={data} cellComponents={{ action: ActionComforRegPOs }} />
      </div>
    </div>
  );
};

export default Payables;
