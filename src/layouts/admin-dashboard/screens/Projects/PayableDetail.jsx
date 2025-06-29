import React from "react";
import TopBar from "@/components/ui/TopBar";
import { Box, IconButton } from "@mui/material";
import SimpleTable from "../../../../components/SimpleTable";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";
import { AccountBalance, AccountTree, Paid } from "@mui/icons-material";
import { RiRecordMailLine } from "react-icons/ri";

const paymentData = [
  {
    id: 1,
    vendorName: "ABC Supplies Ltd.",
    amountPaid: 1200,
    remainingBalance: 300,
    date: "2025-06-25",
    paidBy: "John Doe",
    fileUrl: "/docs/payment-receipt-abc.pdf",
  },
  {
    id: 2,
    vendorName: "Tech Solutions Inc.",
    amountPaid: 800,
    remainingBalance: 0,
    date: "2025-06-26",
    paidBy: "Sarah Khan",
    fileUrl: "/docs/payment-receipt-tech.pdf",
  },
  {
    id: 3,
    vendorName: "Global Office Equipment",
    amountPaid: 1500,
    remainingBalance: 500,
    date: "2025-06-27",
    paidBy: "Ahmed Raza",
    fileUrl: "/docs/payment-receipt-global.pdf",
  },
];

const paymentColumns = [
  { headerName: "Vendor Name", field: "vendorName" },
  { headerName: "Amount Paid", field: "amountPaid" },
  { headerName: "Remaining Balance", field: "remainingBalance" },
  { headerName: "Date", field: "date" },
  { headerName: "Paid By", field: "paidBy" },
  { headerName: "Attachment", field: "fileUrl" },
];
const analyticsData = [
  {
    id: 1,
    label: "Total Payables",
    icon: AccountTree, // Assume this is imported already
    count: 120000,
  },
  {
    id: 2,
    label: "Total Paid",
    icon: Paid, // Assume this is imported already
    count: 250000,
  },
  {
    id: 3,
    label: "Balance Remaining",
    icon: RiRecordMailLine, // Assume this is imported already
    count: 1900000,
  },
];

export default function PayableDetails() {
  return (
    <Box className="p-4">
      <TopBar
        title="Payables Detail"
        detail="Detailed view of material stock movement transactions for selected Purchase Order."
        showFilter={true}
        filterOptions={["Assigned", "Not-Assigned"]}
      />
      <div className="border rounded-xl p-4 mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {analyticsData.map((item, index) => (
          <div
            key={index}
            className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300
                     xl:last:after:hidden"
          >
            <AnalyticsCard
              label={item.label}
              icon={item.icon}
              count={item.count}
              percentage={item.percentage}
            />
          </div>
        ))}
      </div>
      <div className="mt-10">
        <TopBar
          title="Transaction Details"
          detail="Detailed view of material stock movement transactions for selected Purchase Order."
        />
        <div className="mt-4 overflow-x-auto">
          <SimpleTable
            data={paymentData}
            columns={paymentColumns}
            cellComponents={{}}
          />
        </div>
      </div>
    </Box>
  );
}
