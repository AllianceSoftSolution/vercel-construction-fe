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
import { useNavigate } from "react-router-dom";
import { IoPeopleSharp } from "react-icons/io5";
import { AccountBalance, Balance } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  boxShadow: 24,
  borderRadius: "16px",
};

const AddPriceModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={style} className="bg-white p-5">
      <h1 className="text-3xl font-semibold mb-4">Add Price Details</h1>
      <div className="flex flex-col gap-5">
        <CustomTextField label="PO Quantity" placeholder="Enter PO Quantity" />
        <CustomTextField label="Material" placeholder="Enter Material" />
        <CustomTextField label="Price" placeholder="Enter Price" />
        <CustomTextField label="Total Price" placeholder="Total Price" />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-6 py-3 rounded-xl text-lg font-medium"
        >
          Cancel
        </button>
        <Button buttonText="Add Price" />
      </div>
    </Box>
  </Modal>
);

const TransactionModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={style} className="bg-white p-5">
      <h1 className="text-3xl font-semibold mb-4">Transaction Details</h1>
      <div className="flex flex-col gap-5">
        <CustomTextField
          label="Total Balance"
          placeholder="Enter Total Balance"
        />
        <CustomTextField
          label="Received Balance"
          placeholder="Enter Received Balance"
        />
        <label className="text-sm font-medium text-gray-700">Upload File</label>
        <input type="file" className="border border-gray-300 rounded p-2" />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-6 py-3 rounded-xl text-lg font-medium"
          onClick={onClose}
        >
          Cancel
        </button>
        <Button buttonText="Submit" />
      </div>
    </Box>
  </Modal>
);

const CustomActionComponent = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const onNavigation = () => {
    navigate("/admin-dashboard/payables/details/23232");
  };
  return (
    <>
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[{ label: "Add Price", onClick: () => setOpen(true) }, ,]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
      <AddPriceModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const ActionComforRegPOs = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const onNavigation = () => {
    navigate("/admin-dashboard/payables/details/45435");
  };
  return (
    <>
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          { label: "Transaction to Add", onClick: () => setOpen(true) },
          { label: "Details", onClick: onNavigation },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
      <TransactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const ActionComForPayableDetails = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const onNavigation = () => {
    navigate("/admin-dashboard/payables/details/:id");
  };
  return (
    <>
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[{ label: "Details", onClick: onNavigation }]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
      <TransactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const payablesData = [
  {
    label: "Total Payables",
    icon: IoPeopleSharp,
    count: 120000,
  },
  {
    label: "Total Paid",
    icon: AccountBalance,
    count: 250000,
  },
  {
    label: "Balance Remaining",
    icon: Balance,
    count: 1900000,
  },
];

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

  const data1 = [
    {
      id: 1,
      No: "1",
      projectName: "Bridge Construction",
      projectCode: 9909,
      section: "A1",
      materialSupplied: 120000,
      poRef: "PO-001",
      poQty: "20 bags",
      deliveryDate: "2025-06-15",
      status: "Pending",
    },
    {
      id: 2,
      No: "2",
      projectName: "Bridge Construction",
      projectCode: 9909,
      section: "A1",
      materialSupplied: 120000,
      poRef: "PO-001",
      poQty: "20 bags",
      deliveryDate: "2025-06-15",
      status: "Pending",
    },
    {
      id: 3,
      No: "3",
      projectName: "Bridge Construction",
      projectCode: 9909,
      section: "A1",
      materialSupplied: 120000,
      poRef: "PO-001",
      poQty: "20 bags",
      deliveryDate: "2025-06-15",
      status: "Pending",
    },
  ];

  const columns1 = [
    { headerName: "No.", field: "No" },
    { headerName: "Vendor Name", field: "projectName" },
    { headerName: "Total Balance", field: "projectCode" },
    { headerName: "Remaining Balance", field: "section" },
    { headerName: "Paid Amount", field: "materialSupplied" },
    { headerName: "Action", field: "action" },
  ];
  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-10 py-4">
      <TopBar
        title="Payables"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showFilter={true}
        filterOptions={["Assigned", "Not-Assigned"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
      />

      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {payablesData.map((item, index) => (
          <div
            key={index}
            className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 lg:last:after:hidden"
          >
            <AnalyticsCard
              label={item.label}
              icon={item.icon}
              count={item.count}
            />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h1 className="text-xl md:text-2xl font-bold mb-5">
          New Purchase Orders
        </h1>
        <div className="overflow-x-auto">
          <SimpleTable
            columns={columns}
            data={data}
            cellComponents={{ action: CustomActionComponent }}
          />
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-xl md:text-2xl font-bold mb-5">Vendor List</h1>
        <div className="overflow-x-auto">
          <SimpleTable
            columns={columns1}
            data={data1}
            cellComponents={{ action: ActionComforRegPOs }}
          />
        </div>
      </div>
    </div>
  );
};

export default Payables;
