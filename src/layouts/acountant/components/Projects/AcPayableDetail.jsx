import React, { useEffect, useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { Box, IconButton, Modal } from "@mui/material";
import SimpleTable from "../../../../components/SimpleTable";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";
import { AccountBalance, AccountTree, Paid } from "@mui/icons-material";
import { RiRecordMailLine } from "react-icons/ri";
import apiClient from "../../../../api/apiClient";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../../../components/ui/Loader";
import CustomFilterDropdown from "../../../../components/ui/CustomFilterDropdown";
import DropdownButton from "../../../../comments/components/DropdownButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import CustomTextField from "../../../../mui/CustomTextField";
import Button from "../../../../components/Button";
import { formatDateDMY } from '../../../../utils';

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

const paymentColumns = [
  { headerName: "Date", field: "date" },
  { headerName: "Description", field: "description" },
  { headerName: "Project", field: "project" },
  { headerName: "Section", field: "section" },
  { headerName: "Type", field: "type" },
  { headerName: "Amount", field: "amount" },
  // { headerName: "Balance", field: "balance" },
  { headerName: "Proof", field: "proof" },
];

export default function AcPayableDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vendorAccount, setVendorAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ Type: [] });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Filter options for transaction type
  const typeOptions = [
    { label: "Credit", value: "CREDIT" },
    { label: "Debit", value: "DEBIT" },
  ];
  const filters = [
    { label: "Type", options: typeOptions.map(o => o.label) },
  ];

  const CustomActionComponent = ({ value: transactionId, rowData }) => {
    const handleDownloadReceipt = () => {
      console.log("Download receipt clicked for transaction:", transactionId);
      // Find the transaction data to get the proofOfPayment URL
      const transaction = transactions.find(t => t.id === transactionId);
      console.log("Found transaction:", transaction);
      if (transaction && transaction.proofOfPayment) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = transaction.proofOfPayment;
        link.download = `receipt-${transactionId}.pdf`; // or extract filename from URL
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started');
      } else {
        toast.error('No receipt available for this transaction');
      }
    };

    console.log("CustomActionComponent rendered for transaction:", transactionId);

    return (
      <DropdownButton
        
        items={[
          { 
            label: "Download Receipt", 
            onClick: handleDownloadReceipt,
            
          },
        ]}
      >
        <IconButton 
          size="small"
          className="text-gray-600 hover:text-primary hover:bg-primary transition-colors duration-200"
        >
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const TransactionModal = ({ open, onClose, onSave, loading = false }) => {
    const [formData, setFormData] = useState({
      amount: '',
      note: '',
      file: null
    });
    const [modalLoading, setModalLoading] = useState(false);
  
    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };
  
    const handleFileChange = (e) => {
      setFormData(prev => ({
        ...prev,
        file: e.target.files[0]
      }));
    };
  
    const handleSubmit = async () => {
      try {
        setModalLoading(true);
        
        // Create form data for file upload
        const submitData = new FormData();
        submitData.append('amount', formData.amount);
        submitData.append('note', formData.note);
        if (formData.file) {
          submitData.append('proofOfPayment', formData.file);
        }

        const response = await apiClient.post(`/vendor-account/vendors/${id}/payments`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.ok) {
          toast.success('Payment added successfully!');
          onClose();
          // Reset form
          setFormData({ amount: '', note: '', file: null });
          // Refresh the transaction data
          fetchDetails();
        } else {
          toast.error(response.data?.message || 'Failed to add payment');
        }
      } catch (error) {
        console.error('Error adding payment:', error);
        toast.error('Error adding payment');
      } finally {
        setModalLoading(false);
      }
    };

    const handleClose = () => {
      setFormData({ amount: '', note: '', file: null });
      onClose();
    };
  
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="bg-white p-5">
          <h1 className="text-3xl font-semibold mb-4">Add Payment</h1>
          <div className="flex flex-col gap-5">
            <CustomTextField
              label="Amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              disabled={modalLoading}
              type="number"
            />
            <CustomTextField
              label="Note"
              placeholder="Note"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              disabled={modalLoading}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Upload File</label>
              <input 
                type="file" 
                className="border border-gray-300 rounded p-2 w-full" 
                onChange={handleFileChange}
                disabled={modalLoading}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-6 py-2 rounded-xl text-lg font-medium"
              onClick={handleClose}
              disabled={modalLoading}
            >
              Cancel
            </button>
            <Button 
              buttonText={modalLoading ? "Submitting..." : "Add Payment"} 
              onClick={handleSubmit}
              disabled={modalLoading || !formData.amount || !formData.note}
            />
          </div>
        </Box>
      </Modal>
    );
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.get(`/vendor-account/vendors/${id}/statement`);
      console.log("API Response:", response);
      
      if (response.ok) {
        // The API returns data.data with vendorAccount and transactions
        const responseData = response.data.data;
        setVendorAccount(responseData);
        
        // Map transactions to table format
        const transactionData = responseData.transactions?.map((transaction) => ({
          id: transaction.id,
          date: formatDateDMY(transaction.createdAt),
          description: transaction.note || transaction.type,
          project: transaction.purchaseOrder?.section?.project?.name || "-",
          section: transaction.purchaseOrder?.section?.name || "-",
          type: transaction.type,
          amount: transaction.amount ? `${parseFloat(transaction.amount).toLocaleString()} PKR` : "-",
          proof: transaction.proofOfPayment,
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

  // Filtered transactions for credit and debit
  const creditTransactions = transactions.filter(txn => txn.type === 'CREDIT');
  const debitTransactions = transactions.filter(txn => txn.type === 'DEBIT');

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Type: [] });

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

  // Custom cell renderer for Proof link
  const ProofCell = ({ value }) => {
    if (!value) return <span>-</span>;
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black underline hover:text-primary"
      >
        View Proof
      </a>
    );
  };

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
        detail={`Vendor account details for ${vendorAccount?.vendor?.name || 'Vendor'} - Last updated: ${vendorAccount?.lastUpdated ? formatDateDMY(vendorAccount.lastUpdated) : 'N/A'}`}
      showIcon={true}
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
      
      <div className="mt-10 flex flex-col gap-8">
        <div>
          <TopBar title="Credit Transactions" detail="All credit transactions for this vendor account." />
          <div className="mt-4 overflow-x-auto relative">
            <SimpleTable
              data={creditTransactions}
              columns={paymentColumns}
              cellComponents={{ proof: ProofCell }}
            />
          </div>
        </div>
        <div>
          <TopBar title="Debit Transactions" detail="All debit transactions for this vendor account." buttonText="Add Payment" onButtonClick={() => setOpen(true)}/>
          <div className="mt-4 overflow-x-auto relative">
            <SimpleTable
              data={debitTransactions}
              columns={paymentColumns}
              cellComponents={{ proof: ProofCell }}
            />
          </div>
        </div>
      </div>

      <TransactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
  