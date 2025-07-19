import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";
import DropdownButton from "../../../comments/components/DropdownButton";
import { Box, IconButton, Modal, Chip } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import CustomTextField from "../../../mui/CustomTextField";
import Button from "../../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { IoPeopleSharp } from "react-icons/io5";
import { AccountBalance, Balance } from "@mui/icons-material";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";

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

const AddPriceModal = ({ open, onClose, poData }) => {
  const [formData, setFormData] = useState({
    unitPrice: '',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("AddPriceModal poData:", poData); // Debug log
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('poId', poData?.id); // Get PO ID from the purchase order data
      submitData.append('unitPrice', formData.unitPrice);
      submitData.append('notes', formData.notes);
      if (file) {
        submitData.append('document', file);
      }

      const response = await apiClient.post('/purchase-orders/add-price', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        toast.success('Price added successfully!');
        onClose();
        // Reset form
        setFormData({ unitPrice: '', notes: '' });
        setFile(null);
        // Refresh the purchase orders list
        window.location.reload();
      } else {
        toast.error(response.data?.message || 'Failed to add price');
      }
    } catch (error) {
      console.error('Error adding price:', error);
      toast.error('Error adding price');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ unitPrice: '', notes: '' });
    setFile(null);
    onClose();
  };
  
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="bg-white p-5">
        <h1 className="text-3xl font-semibold mb-4">Add Price Details</h1>
        <div className="flex flex-col gap-5">
          <CustomTextField 
            label="PO ID" 
            placeholder="PO ID" 
            value={poData?.referenceNumber || ""} 
            disabled 
          />
          <CustomTextField 
            label="Material" 
            placeholder="Material" 
            value={poData?.material?.name || ""} 
            disabled 
          />
          <CustomTextField 
            label="Unit Price" 
            placeholder="Enter Unit Price" 
            value={formData.unitPrice}
            onChange={(e) => handleInputChange('unitPrice', e.target.value)}
            type="number"
          />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Upload Document</label>
            <input 
              type="file" 
              className="border border-gray-300 rounded p-2 w-full" 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
          <CustomTextField 
            label="Notes" 
            placeholder="Enter Notes" 
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-6 py-3 rounded-xl text-lg font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <Button 
            buttonText={loading ? "Submitting..." : "Add Price"} 
            onClick={handleSubmit}
            disabled={loading || !formData.unitPrice}
          />
        </div>
      </Box>
    </Modal>
  );
};

const TransactionModal = ({ open, onClose, onSave, loading = false }) => {
  const [formData, setFormData] = useState({
    totalBalance: '',
    receivedBalance: '',
    file: null
  });

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

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} className="bg-white p-5">
        <h1 className="text-3xl font-semibold mb-4">Transaction Details</h1>
        <div className="flex flex-col gap-5">
          <CustomTextField
            label="Total Balance"
            placeholder="Enter Total Balance"
            value={formData.totalBalance}
            onChange={(e) => handleInputChange('totalBalance', e.target.value)}
            disabled={loading}
          />
          <CustomTextField
            label="Received Balance"
            placeholder="Enter Received Balance"
            value={formData.receivedBalance}
            onChange={(e) => handleInputChange('receivedBalance', e.target.value)}
            disabled={loading}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Upload File</label>
            <input 
              type="file" 
              className="border border-gray-300 rounded p-2 w-full" 
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-6 py-3 rounded-xl text-lg font-medium"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <Button 
            buttonText={loading ? "Submitting..." : "Submit"} 
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </Box>
    </Modal>
  );
};

const CustomActionComponent = ({ value:id }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const onNavigation = () => {
    navigate(`/admin-dashboard/payables/details/${id}`);
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

const ActionComforRegPOs = ({ value: id, rowData, ...props }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get the full data from rowData (which now contains the full row)
  const fullData = rowData?.fullData || rowData;
  
  console.log("ActionComforRegPOs rowData:", rowData); // Debug rowData
  console.log("ActionComforRegPOs fullData:", fullData); // Debug fullData
  
  return (
    <>
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          { label: "Add Price", onClick: () => setOpen(true) },

        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
      <AddPriceModal open={open} onClose={() => setOpen(false)} poData={fullData} />
    </>
  );
};

// Status color mapping for PO status
const statusColorMap = {
  APPROVED: "#22c55e", // green
  REJECTED: "#ef4444", // red
  PENDING: "#f59e42", // orange
  PARTIALLY_APPROVED: "#eab308", // yellow
  PO_CREATED: "#8b5cf6", // purple
  FULFILLED: "#0ea5e9", // blue
  COMPLETED: "#22c55e", // green
  PARTIAL: "#eab308", // yellow
  ORDER_PLACED: "#f59e42", // orange
  IN_TRANSIT: "#0ea5e9", // blue
  IN_STORE: "#8b5cf6", // purple
  CANCELLED: "#ef4444", // red
  default: "#0252AD", // fallback blue
};

const StatusChip = ({ value }) => {
  const status = (value || "PENDING").toUpperCase();
  const color = statusColorMap[status] || statusColorMap.default;
  return (
    <Chip
      label={status.replace(/_/g, " ")}
      size="small"
      sx={{ bgcolor: color, color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}
    />
  );
};

const Payables = () => {
  const [loading, setLoading] = useState(false);
  const [vendorAccounts, setVendorAccounts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [payablesSummary, setPayablesSummary] = useState({
    totalVendors: 0,
    totalCredited: 0,
    totalDebited: 0,
    totalBalance: 0,
    vendorsWithOverdue: 0,
    vendorsWithAdvance: 0
  });
  const [filter, setFilter] = useState({
    Status: [],
  });

  // Status options for filter
  const statusOptions = [
    { label: "Order Placed", value: "ORDER_PLACED" },
    { label: "Created", value: "CREATED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "In Transit", value: "IN_TRANSIT" },
    { label: "In Store", value: "IN_STORE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Pending", value: "PENDING" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Approved", value: "APPROVED" },
    { label: "Partially Approved", value: "PARTIALLY_APPROVED" },
    { label: "PO Created", value: "PO_CREATED" },
    { label: "Fulfilled", value: "FULFILLED" },
    { label: "Partial", value: "PARTIAL" },
  ];
  const filters = [
    { label: "Status", options: statusOptions.map(o => o.label) },
  ];

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Status: [] });

  // Filter purchase orders by status
  const filteredPurchaseOrders = filter.Status && filter.Status.length > 0
    ? purchaseOrders.filter(po =>
        filter.Status.includes(
          statusOptions.find(opt => opt.value === po.status)?.label || po.status
        )
      )
    : purchaseOrders;

  // Vendor Accounts columns
  const vendorColumns = [
    { headerName: "No.", field: "no" },
    { headerName: "Vendor Name", field: "vendorName" },
    { headerName: "Total Balance", field: "totalBalance" },
    { headerName: "Remaining Balance", field: "remainingBalance" },
    { headerName: "Paid Amount", field: "paidAmount" },
    { headerName: "Action", field: "id" },
  ];

  // Purchase Orders columns
  const purchaseOrderColumns = [
    { headerName: "No.", field: "no" },
    { headerName: "PO Reference", field: "poReference" },
    { headerName: "Project", field: "project" },
    { headerName: "Material", field: "material" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "id" },
  ];

  const fetchVendorAccount = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/vendor-account/vendors");
      if (response.ok) {
        const vendorData = response.data.data || [];
        const summary = response.data.summary || {};
        
        // Map vendor account data to table format
        const mappedData = vendorData.map((account, index) => {
          console.log("Vendor account data:", account);
          return {
            id: account.vendorId, // Use vendorId for navigation to detail page
            no: index + 1,
            vendorName: account.vendor?.name || "-",
            totalBalance: account.totalCredited ? `$${account.totalCredited.toLocaleString()}` : "-",
            remainingBalance: account.remainingAmount ? `$${account.remainingAmount.toLocaleString()}` : "-",
            paidAmount: account.paidAmount ? `$${account.paidAmount.toLocaleString()}` : "-",
          };
        });
        
        setVendorAccounts(mappedData);
        setPayablesSummary(summary);
      } else {
        toast.error("Failed to fetch vendor accounts");
      }
    } catch (error) {
      console.error("Error fetching vendor accounts:", error);
      toast.error("Error fetching vendor accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorAccount();
  }, []);

  // Update analytics with real data from API
  const payablesData = [
    {
      label: "Total Payables",
      icon: IoPeopleSharp,
      count: payablesSummary.totalCredited || 0,
    },
    {
      label: "Total Paid",
      icon: AccountBalance,
      count: payablesSummary.totalDebited || 0,
    },
    {
      label: "Balance Remaining",
      icon: Balance,
      count: payablesSummary.totalBalance || 0,
    },
  ];

  const fetchNewPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/purchase-orders?hasAmount=false");
      if (response.ok) {
        const data = response.data.data.map((po, index) => ({
          id: po.id,
          no: index + 1,
          poReference: po.referenceNumber || po.id || "-",
          project: po.demand?.section?.project?.name || "-",
          material: po.material?.name || "-",
          quantity: po.quantity || "-",
          unit: po.demand?.unit || "-",
          amount: po.totalAmount ? `$${po.totalAmount.toLocaleString()}` : "-",
          status: po.status || "-",
          // Store full PO data for modal
          fullData: po
        }));
        setPurchaseOrders(data);
      } else {
        toast.error("Failed to fetch purchase orders");
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      toast.error("Error fetching purchase orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewPurchaseOrders();
  }, []);

  return (
    <div className=" ">
      <TopBar
        title="Payables"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showFilter={true}
        // filterOptions={["Assigned", "Not-Assigned"]}
        // onFilterChange={(selected) =>
        //   console.log("Selected Filters:", selected)
        // }
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
          Purchase Orders
        </h1>
        <div className="my-4 flex justify-end">
          <CustomFilterDropdown
            filters={filters}
            selected={filter}
            onChange={handleFilterChange}
            onClear={handleFilterClear}
            placeholder="Filter by status"
            dropdownAlign="left"
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <SimpleTable
              columns={purchaseOrderColumns}
              data={filteredPurchaseOrders}
              cellComponents={{ 
                id: ActionComforRegPOs,
                status: StatusChip
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-xl md:text-2xl font-bold mb-5">Vendor Accounts</h1>
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <SimpleTable
              columns={vendorColumns}
              data={vendorAccounts}
              cellComponents={{ id: CustomActionComponent }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Payables;
