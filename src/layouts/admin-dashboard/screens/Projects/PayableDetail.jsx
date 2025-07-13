import React, { useEffect, useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { Box, IconButton } from "@mui/material";
import SimpleTable from "../../../../components/SimpleTable";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";
import { AccountBalance, AccountTree, Paid } from "@mui/icons-material";
import { RiRecordMailLine } from "react-icons/ri";
import apiClient from "../../../../api/apiClient";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../../../components/ui/Loader";

const paymentColumns = [
  { headerName: "Date", field: "date" },
  { headerName: "Description", field: "description" },
  { headerName: "Type", field: "type" },
  { headerName: "Amount", field: "amount" },
  { headerName: "Balance", field: "balance" },
  { headerName: "Reference", field: "reference" },
];

export default function PayableDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vendorAccount, setVendorAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.get(`/vendor-account/vendors/${id}/statement`);
          console.log("API Response:", response);
      
      if (response.ok) {
        // The API returns data directly, not nested under vendorAccount
        setVendorAccount(response.data.data);
        
        // Map transactions to table format
        const transactionData = response.data.data.transactions?.map((transaction) => ({
          id: transaction.id,
          date: new Date(transaction.createdAt).toLocaleDateString(),
          description: transaction.note || transaction.type,
          type: transaction.type,
          amount: transaction.amount ? `$${parseFloat(transaction.amount).toLocaleString()}` : "-",
          balance: "-", // API doesn't provide balanceAfter, so we'll show "-"
          reference: transaction.purchaseOrderId || transaction.vendorPaymentId || "-",
        })) || [];
        
        setTransactions(transactionData);
      } else {
        console.error("API Error Response:", response.data);
        toast.error(response.data?.message || "Failed to fetch vendor account details");
      }
    } catch (error) {
      console.error("API error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Error fetching vendor account details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const analyticsData = [
    {
      id: 1,
      label: "Total Credited",
      icon: AccountTree,
      count: vendorAccount?.totalCredited ? parseFloat(vendorAccount.totalCredited).toLocaleString() : "0",
    },
    {
      id: 2,
      label: "Total Debited",
      icon: Paid,
      count: vendorAccount?.totalDebited ? parseFloat(vendorAccount.totalDebited).toLocaleString() : "0",
    },
    {
      id: 3,
      label: "Current Balance",
      icon: RiRecordMailLine,
      count: vendorAccount?.balance ? parseFloat(vendorAccount.balance).toLocaleString() : "0",
    },
  ];

  if (!vendorAccount && !loading) {
    return (
      <Box className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">No vendor account found</div>
        </div>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="p-4">
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </Box>
    );
  }

  return (
    <>
      <TopBar
        title={`Payables Detail - ${vendorAccount?.vendor?.name || 'Vendor'}`}
        detail={`Vendor account details for ${vendorAccount?.vendor?.name || 'Vendor'} - Last updated: ${vendorAccount?.lastUpdated ? new Date(vendorAccount.lastUpdated).toLocaleDateString() : 'N/A'}`}
        showFilter={true}
        filterOptions={["All", "Credits", "Debits"]}
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
            />
          </div>
        ))}
      </div>
      
      <div className="mt-10">
        <TopBar
          title="Transaction History"
          detail="Complete list of all transactions for this vendor account."
        />
        <div className="mt-4 overflow-x-auto relative">
          <SimpleTable
            data={transactions}
            columns={paymentColumns}
            cellComponents={{}}
          />
        </div>
      </div>
    </>
  );
}
