import React, { useEffect, useState, useRef } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { Box, IconButton, Modal } from "@mui/material";
import SimpleTable from "../../../../components/SimpleTable";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
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
import FileUploadField from "../../../../components/ui/FileUploadField";
import AttachmentLinks from "../../../../components/ui/AttachmentLinks";
import useS3MultiUpload from "../../../../hooks/useS3MultiUpload";
import { UPLOAD_FOLDERS } from "../../../../constants/fileUpload";
import { normalizeAttachmentUrls } from "../../../../utils/fileUpload";

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
  { headerName: "Amount(PKR)", field: "amount" },
  // { headerName: "Balance", field: "balance" },
  { headerName: "Proof", field: "proof" },
];

const SORT_OPTIONS = [
  { label: 'Date (newest first)', value: 'date_desc' },
  { label: 'Date (oldest first)', value: 'date_asc' },
  { label: 'Amount (high to low)', value: 'amount_desc' },
  { label: 'Amount (low to high)', value: 'amount_asc' },
  { label: 'Project Name', value: 'project_asc' },
];

export default function AcPayableDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vendorAccount, setVendorAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ Type: [] });
  const [open, setOpen] = useState(false);
  const [sortOption, setSortOption] = useState('date_desc');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      const proofUrls = normalizeAttachmentUrls(transaction?.proofRaw);
      if (proofUrls.length > 0) {
        const link = document.createElement('a');
        link.href = proofUrls[0];
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

  const TransactionModal = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
      amount: '',
      note: '',
      vendorName: '',
      projectId: '',
      sectionId: '',
    });
    const [paymentFiles, setPaymentFiles] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const { uploadFiles, uploading: fileUploading } = useS3MultiUpload();
    const [projects, setProjects] = useState([]);
    const [allSections, setAllSections] = useState([]);
    const [filteredSections, setFilteredSections] = useState([]);

    // Fetch projects & sections when modal opens
    useEffect(() => {
      if (!open) return;
      const fetchData = async () => {
        try {
          const [projRes, secRes] = await Promise.all([
            apiClient.get('/projects'),
            apiClient.get('/sections'),
          ]);
          if (projRes.ok) setProjects(projRes.data.projects || []);
          if (secRes.ok) setAllSections(secRes.data.sections || []);
        } catch (e) {
          console.error('Error fetching projects/sections', e);
        }
      };
      fetchData();
    }, [open]);

    // Filter sections when project changes
    useEffect(() => {
      if (formData.projectId) {
        setFilteredSections(allSections.filter(s => s.projectId === formData.projectId));
      } else {
        setFilteredSections([]);
      }
      setFormData(prev => ({ ...prev, sectionId: '' }));
    }, [formData.projectId, allSections]);

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
      if (!formData.amount || !formData.note || !formData.vendorName || !formData.projectId || !formData.sectionId) {
        toast.error('Please fill all required fields');
        return;
      }
      try {
        setModalLoading(true);
        const payload = {
          amount: formData.amount,
          note: formData.note,
          vendorName: formData.vendorName,
          projectId: formData.projectId,
          sectionId: formData.sectionId,
        };
        if (paymentFiles.length) {
          payload.proofOfPaymentUrls = await uploadFiles(
            paymentFiles,
            UPLOAD_FOLDERS.proofOfPayment
          );
        }
        const response = await apiClient.post(`/vendor-account/vendors/${id}/payments`, payload);
        if (response.ok) {
          toast.success('Payment added successfully!');
          onClose();
          setFormData({ amount: '', note: '', vendorName: '', projectId: '', sectionId: '' });
          setPaymentFiles([]);
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
      setFormData({ amount: '', note: '', vendorName: '', projectId: '', sectionId: '' });
      setPaymentFiles([]);
      onClose();
    };

    const isSubmitDisabled = modalLoading || fileUploading || !formData.amount || !formData.note ||
      !formData.vendorName || !formData.projectId || !formData.sectionId;

    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="bg-white p-5 overflow-y-auto" style={{ maxHeight: '90vh' }}>
          <h1 className="text-3xl font-semibold mb-4">Add Payment</h1>
          <div className="flex flex-col gap-5">
            {/* Row 1: Amount + Vendor Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomTextField
                label="Amount *"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                disabled={modalLoading}
                type="number"
              />
              <CustomTextField
                label="Vendor Name *"
                placeholder="Enter vendor name"
                value={formData.vendorName}
                onChange={(e) => handleInputChange('vendorName', e.target.value)}
                disabled={modalLoading}
              />
            </div>
            {/* Row 2: Project Name + Section Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Project Name *</label>
                <select
                  className="border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={formData.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                  disabled={modalLoading}
                >
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Section Name *</label>
                <select
                  className="border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                  value={formData.sectionId}
                  onChange={(e) => handleInputChange('sectionId', e.target.value)}
                  disabled={modalLoading || !formData.projectId}
                >
                  <option value="">{formData.projectId ? 'Select Section' : 'Select a project first'}</option>
                  {filteredSections.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Note */}
            <CustomTextField
              label="Note *"
              placeholder="Note"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              disabled={modalLoading}
            />
            <FileUploadField
              label="Upload File"
              files={paymentFiles}
              onChange={setPaymentFiles}
              disabled={modalLoading || fileUploading}
            />
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
              buttonText={modalLoading ? 'Submitting...' : 'Add Payment'}
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
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
          rawDate: transaction.createdAt,
          description: transaction.note || transaction.type,
          project: transaction.purchaseOrder?.section?.project?.name || transaction.project?.name || "-",
          section: transaction.purchaseOrder?.section?.name || transaction.section?.name || "-",
          type: transaction.type,
          amount: transaction.amount ? `${parseFloat(transaction.amount).toLocaleString()} ` : "-",
          rawAmount: parseFloat(transaction.amount) || 0,
          proof: transaction.proofOfPayment,
          proofRaw: transaction.proofOfPayment,
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

  // Sorted debit transactions
  const sortedDebitTransactions = [...debitTransactions].sort((a, b) => {
    switch (sortOption) {
      case 'date_asc':  return new Date(a.rawDate) - new Date(b.rawDate);
      case 'date_desc': return new Date(b.rawDate) - new Date(a.rawDate);
      case 'amount_desc': return b.rawAmount - a.rawAmount;
      case 'amount_asc':  return a.rawAmount - b.rawAmount;
      case 'project_asc': return (a.project || '').localeCompare(b.project || '');
      default: return 0;
    }
  });

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Type: [] });

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || amount === "") return "0";
    return parseFloat(amount).toLocaleString();
  };

  const getAmountColor = (amount) => {
    const numericAmount = Number(amount) || 0;
    if (numericAmount < 0) {
      return "#22c55e"; // green for negative (advance/overpayment)
    } else if (numericAmount > 0) {
      return "#ef4444"; // red for positive (amount owed)
    }
    return "#222222"; // neutral for zero
  };

  const ColorCodedAmount = ({ value }) => {
    if (!value || value === "-") return <span>{value || "-"}</span>;

    const numericValue = parseFloat(value.replace(/,/g, ""));
    if (isNaN(numericValue)) return <span>{value}</span>;

    let color = "#222222";
    if (numericValue < 0) {
      color = "#22c55e";
    } else if (numericValue > 0) {
      color = "#ef4444";
    }

    return (
      <span style={{ color, fontWeight: "600" }}>
        {value}
      </span>
    );
  };

  const analyticsData = [
    {
      id: 1,
      label: "Total Credited",
      icon: AccountTree,
      count: vendorAccount?.totalCredited ? formatAmount(vendorAccount.totalCredited) : "0",
      countColor: getAmountColor(vendorAccount?.totalCredited),
    },
    {
      id: 2,
      label: "Total Debited",
      icon: Paid,
      count: vendorAccount?.totalDebited ? formatAmount(vendorAccount.totalDebited) : "0",
      countColor: getAmountColor(vendorAccount?.totalDebited),
    },
    {
      id: 3,
      label: "Current Balance",
      icon: RiRecordMailLine,
      count: vendorAccount?.balance ? formatAmount(vendorAccount.balance) : "0",
      countColor: getAmountColor(vendorAccount?.balance),
    },
  ];

  const ProofCell = ({ value }) => (
    <AttachmentLinks urls={value} linkClassName="text-black underline hover:text-primary text-sm" />
  );

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
              countColor={item.countColor}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex flex-col gap-8">
        <div>
          <TopBar title="Credit Transactions" detail="All credit transactions for this vendor account." />
          <div className="mt-4 overflow-x-auto relative">
            <SimpleTable
              tableTitle="credit-transactions"
              data={creditTransactions}
              columns={paymentColumns}
            cellComponents={{ proof: ProofCell, amount: ColorCodedAmount }}
            />
          </div>
        </div>
        <div>
          {/* Debit header with Sort + Add Payment */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-2xl font-bold text-[#444444]">Debit Transactions</span>
            <div className="flex items-center gap-2">
              {/* Sort Filter dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setSortDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm text-gray-600 hover:bg-gray-50"
                >
                  <FiFilter className="text-gray-500" />
                  Sort
                  <IoMdArrowDropdown className="text-gray-500" />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-20 w-52">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortOption(opt.value); setSortDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 ${
                          sortOption === opt.value ? 'font-semibold text-orange-500' : 'text-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button buttonText="Add Payment" onClick={() => setOpen(true)} />
            </div>
          </div>
          <div className="mt-4 overflow-x-auto relative">
            <SimpleTable
              tableTitle="debit-transactions"
              data={sortedDebitTransactions}
              columns={paymentColumns}
              cellComponents={{ proof: ProofCell, amount: ColorCodedAmount }}
            />
          </div>
        </div>
      </div>

      <TransactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
  