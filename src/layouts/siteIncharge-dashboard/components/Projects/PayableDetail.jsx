import React from "react";
import TopBar from "@/components/ui/TopBar";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import SimpleTable from "../../../../components/SimpleTable";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";

const data = [
  {
    id: 1,
    poRef: "PO-1001",
    material: "Cement",
    qty: "100 Bags",
    type: "Stock In",
    handledBy: "John Doe",
    remarks: "Received at site",
    date: "2025-06-21",
    fileUrl: "/docs/invoice-po1001.pdf",
  },
  {
    id: 2,
    poRef: "PO-1002",
    material: "Steel",
    qty: "50 Tons",
    type: "Stock Out",
    handledBy: "Ahmed Khan",
    remarks: "Issued for Block A",
    date: "2025-06-19",
    fileUrl: "/docs/dispatch-note-po1002.pdf",
  },
  {
    id: 3,
    poRef: "PO-1002",
    material: "Steel",
    qty: "50 Tons",
    type: "Stock Out",
    handledBy: "Ahmed Khan",
    remarks: "Issued for Block A",
    date: "2025-06-19",
    fileUrl: "/docs/dispatch-note-po1002.pdf",
  },
];

const columns = [
  { headerName: "PO Ref", field: "poRef" },
  { headerName: "Material", field: "material" },
  { headerName: "Qty", field: "qty" },
  { headerName: "Type", field: "type" },
  { headerName: "Handled By", field: "handledBy" },
  { headerName: "Remarks", field: "remarks" },
  { headerName: "Date", field: "date" },
  { headerName: "Attachment", field: "fileUrl" },
];

export default function PayableDetails() {
  return (
    <Box >
      <TopBar
        title="Payables Detail"
        detail="Detailed view of material stock movement transactions for selected Purchase Order."
        showFilter={true}
        filterOptions={["Assigned", "Not-Assigned"]}
      />
      <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        <AnalyticsCard
          label="Total Payables"
          icon={IoMdArrowDropdown}
          count={120000}
        />
        <AnalyticsCard
          label="Total Paid"
          icon={IoMdArrowDropdown}
          count={250000}
        />
        <AnalyticsCard
          label="Balance Remaining"
          icon={IoMdArrowDropdown}
          count={1900000}
        />
      </div>
      <div className="mt-10">
        <TopBar
          title="Transaction Details"
          detail="Detailed view of material stock movement transactions for selected Purchase Order."
        />
        <div className="mt-3">
          <SimpleTable
              tableTitle="transaction-details" data={data} columns={columns} cellComponents={{}}/>
        </div>
      </div>
    </Box>
  );
}
