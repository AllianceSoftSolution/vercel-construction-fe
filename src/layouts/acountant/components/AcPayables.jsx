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
import { useSelector } from "react-redux";

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

const AddPriceModal = ({ open, onClose, poId, onSuccess }) => {
  const [formData, setFormData] = useState({
    unitPrice: '',
    notes: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
    // Validation
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      toast.error('Please enter a valid unit price');
      return;
    }

    if (!formData.notes || formData.notes.trim() === '') {
      toast.error('Please enter notes');
      return;
    }


    try {
      setLoading(true);

      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('unitPrice', formData.unitPrice);
      submitData.append('notes', formData.notes.trim());
      if (file) {
        submitData.append('proofOfBill', file);
      }

      const response = await apiClient.patch(`/purchase-orders/${poId}/amount`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        toast.success('Price added successfully!');
        handleClose();
        // Call onSuccess callback to refresh data
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.data?.message || 'Failed to add price');
      }
    } catch (error) {
      console.error('Error adding price:', error);
      toast.error(error.response?.data?.message || 'Error adding price');
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
            label="Unit Price"
            placeholder="Enter Unit Price"
            value={formData.unitPrice}
            onChange={(e) => handleInputChange('unitPrice', e.target.value)}
            type="number"
            disabled={loading}
            required
          />

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload Document <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="file"
              className="border border-gray-300 rounded p-2 w-full"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
            </p>
          </div>

          <CustomTextField
            label="Notes"
            placeholder="Enter detailed notes about the pricing"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-6 py-3 rounded-xl text-lg font-medium transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <Button
            buttonText={loading ? "Adding Price..." : "Add Price"}
            onClick={handleSubmit}
            disabled={loading || !formData.unitPrice || !formData.notes.trim()}
          />
        </div>
      </Box>
    </Modal>
  );
};

const CustomActionComponent = ({ value: id }) => {
  const navigate = useNavigate();

  const onNavigation = () => {
    navigate(`/accountant-dashboard/payables/details/${id}`);
  };

  return (
    <DropdownButton
      items={[
        { label: "Details", onClick: onNavigation },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );
};

// Edit Price Modal
const EditPriceModal = ({ open, onClose, poId, poData, onSuccess }) => {
  const [formData, setFormData] = useState({
    unitPrice: poData?.unitPrice?.toString() || '',
    notes: poData?.notes || ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (poData) {
      setFormData({
        unitPrice: poData.unitPrice?.toString() || '',
        notes: poData.notes || ''
      });
    }
  }, [poData]);

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
    // Validation
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      toast.error('Please enter a valid unit price');
      return;
    }

    try {
      setLoading(true);

      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('unitPrice', formData.unitPrice);
      if (formData.notes.trim()) {
        submitData.append('notes', formData.notes.trim());
      }
      if (file) {
        submitData.append('proofOfBill', file);
      }

      const response = await apiClient.put(`/purchase-orders/${poId}/amount`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        toast.success('Price updated successfully!');
        handleClose();
        // Call onSuccess callback to refresh data
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.data?.message || 'Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error(error.response?.data?.message || 'Error updating price');
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
        <h1 className="text-3xl font-semibold mb-4">Edit Price Details</h1>
        <div className="flex flex-col gap-5">
          <CustomTextField
            label="Unit Price"
            placeholder="Enter Unit Price"
            value={formData.unitPrice}
            onChange={(e) => handleInputChange('unitPrice', e.target.value)}
            type="number"
            disabled={loading}
            required
          />

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload New Document <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="file"
              className="border border-gray-300 rounded p-2 w-full"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG. Leave empty to keep existing document.
            </p>
          </div>

          <CustomTextField
            label="Notes"
            placeholder="Enter detailed notes about the pricing"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-6 py-3 rounded-xl text-lg font-medium transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <Button
            buttonText={loading ? "Updating Price..." : "Update Price"}
            onClick={handleSubmit}
            disabled={loading || !formData.unitPrice}
          />
        </div>
      </Box>
    </Modal>
  );
};

// View Price Details Modal
const ViewPriceDetailsModal = ({ open, onClose, poData, onEdit }) => {
  if (!poData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleViewProof = () => {
    if (poData.proofOfBill) {
      window.open(poData.proofOfBill, '_blank');
    }
  };

  // Check if within 24 hours
  const isWithin24Hours = () => {
    if (!poData.amountAddedAt) return false;
    const now = new Date();
    const amountAddedAt = new Date(poData.amountAddedAt);
    const hoursDiff = (now.getTime() - amountAddedAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  const canEdit = isWithin24Hours();

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} className="bg-white p-5">
        <h1 className="text-3xl font-semibold mb-4">Price Details</h1>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Unit Price</label>
              <p className="text-lg font-semibold text-gray-900">
                {poData.unitPrice ? `PKR ${parseFloat(poData.unitPrice).toLocaleString()}` : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Total Amount</label>
              <p className="text-lg font-semibold text-gray-900">
                {poData.totalAmount ? `PKR ${parseFloat(poData.totalAmount).toLocaleString()}` : "-"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg min-h-[80px]">
              {poData.notes || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Added By</label>
              <p className="text-gray-900">
                {poData.amountAdder?.name || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Added At</label>
              <p className="text-gray-900">
                {formatDate(poData.amountAddedAt)}
              </p>
            </div>
          </div>

          {poData.proofOfBill && (
            <div>
              <label className="text-sm font-medium text-gray-700">Proof of Bill</label>
              <button
                onClick={handleViewProof}
                className="mt-2 text-blue-600 hover:text-blue-800 underline"
              >
                View Document
              </button>
            </div>
          )}

          {!canEdit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Edit window has expired. Amounts can only be edited within 24 hours of being added.
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          {canEdit && onEdit && (
            <Button
              buttonText="Edit"
              onClick={onEdit}
            />
          )}
          <button
            onClick={onClose}
            className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-6 py-3 rounded-xl text-lg font-medium transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </Box>
    </Modal>
  );
};

const AccPayables = () => {
  const [loading, setLoading] = useState(false);
  const [vendorAccounts, setVendorAccounts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrdersWithAmount, setPurchaseOrdersWithAmount] = useState([]);
  const [selectedPOForDetails, setSelectedPOForDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPOForEdit, setSelectedPOForEdit] = useState(null);
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
    Project: [],
    Section: [],
    });
  const [projects, setProjects] = useState([]);
  const [globalProjectFilter, setGlobalProjectFilter] = useState([]);
  const [poWithAmountFilter, setPoWithAmountFilter] = useState({
    Project: [],
  });
  
  // Get user role from Redux store
  const user = useSelector((state) => {
    if (!state || !state.auth) return null;
    return state.auth.user;
  });
  const userRole = user?.role;
  
  // Check if user is head accountant (has permission to view vendor accounts)
  // Use isHead property to determine if user is head accountant
  const isHeadAccountant = user?.isHead === true;

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
  // Fetch all projects for filter
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get("/projects");
        if (response.ok) {
          setProjects(response.data.projects || []);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchProjects();
  }, []);

  const projectOptions = projects.map((p) => ({ label: p.name, value: p.id }));

  // Get unique sections from purchase orders
  const sectionOptions = [...new Set(
    [...purchaseOrders, ...purchaseOrdersWithAmount]
      .map(po => po.section)
      .filter(Boolean)
  )];

  const filters = [
    { label: "Status", options: statusOptions.map(o => o.label) },
    { label: "Project", options: projectOptions.map(o => o.label) },
    { label: "Section", options: sectionOptions },
  ];

  const poWithAmountFilters = [
    { label: "Project", options: projectOptions.map(o => o.label) },
  ];

  // Global project filter options
  const globalProjectFilters = [
    { label: "Project", options: projectOptions.map(o => o.label) },
  ];

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Status: [], Project: [], Section: [] });

  const handlePOWithAmountFilterChange = (newSelected) => {
    setPoWithAmountFilter(newSelected);
  };
  const handlePOWithAmountFilterClear = () => setPoWithAmountFilter({ Project: [] });

    const handleGlobalProjectFilterChange = (newSelected) => {
    setGlobalProjectFilter(newSelected);
    
    // Only apply project filter for head accountants
    if (!isHeadAccountant) return;
    
    // Get the selected project ID
    const selectedProject = newSelected.Project && newSelected.Project.length > 0 
      ? newSelected.Project[0] 
      : null;
    
    // Find the project ID from the project name
    const selectedProjectId = selectedProject 
      ? projectOptions.find(p => p.label === selectedProject)?.value 
      : null;
    
    // Fetch vendor accounts with project filter
    fetchVendorAccount(selectedProjectId);
  };

  const handleGlobalProjectFilterClear = () => {
    setGlobalProjectFilter([]);
    // Only fetch vendor accounts for head accountants when filter is cleared
    if (isHeadAccountant) {
      fetchVendorAccount();
    }
  };

  // Filter purchase orders by status, project, section, and global project filter
  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    // Status filter
    const statusMatch =
      !filter.Status ||
      filter.Status.length === 0 ||
      filter.Status.includes(
        statusOptions.find((opt) => opt.value === po.status)?.label || po.status
      );

    // Project filter
    const projectMatch =
      !filter.Project ||
      filter.Project.length === 0 ||
      filter.Project.includes(po.project);

    // Section filter
    const sectionName = po.section || "-";
    const sectionMatch =
      !filter.Section ||
      filter.Section.length === 0 ||
      filter.Section.includes(sectionName);

    // Global project filter
    const globalProjectMatch =
      !globalProjectFilter.Project ||
      globalProjectFilter.Project.length === 0 ||
      globalProjectFilter.Project.includes(po.project);

    return statusMatch && projectMatch && sectionMatch && globalProjectMatch;
  });

  // Filter vendor accounts by global project filter
  // Note: This filtering is now handled at the API level, so we just return all vendor accounts
  // The API will return only the vendors for the selected project
  const filteredVendorAccounts = vendorAccounts;

  const filteredPurchaseOrdersWithAmount = purchaseOrdersWithAmount.filter((po) => {
    const projectMatch =
      !poWithAmountFilter.Project ||
      poWithAmountFilter.Project.length === 0 ||
      poWithAmountFilter.Project.includes(po.project);

    return projectMatch;
  });

  // Vendor Accounts columns
  const vendorColumns = [
    { headerName: "No.", field: "no" },
    { headerName: "Vendor Name", field: "vendorName" },
    { headerName: "Total Amount (PKR)", field: "totalBalance" },
    { headerName: "Remaining Amount (PKR)", field: "remainingBalance" },
    { headerName: "Paid Amount (PKR)", field: "paidAmount" },
    { headerName: "Action", field: "id" },
  ];

  // Purchase Orders columns
  const purchaseOrderColumns = [
    { headerName: "No.", field: "no" },
    { headerName: "PO Reference", field: "poReference" },
    { headerName: "Project", field: "project" },
    { headerName: "Material", field: "material" },
    { headerName: "Vendor", field: "vendor" },
    { headerName: "Section", field: "section" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Unit Price", field: "unitPrice" },
    { headerName: "Amount (PKR)", field: "amount" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "id" },
  ];

  // Purchase Orders with Amounts columns (includes View Document column)
  const purchaseOrderWithAmountColumns = [
    { headerName: "No.", field: "no" },
    { headerName: "PO Reference", field: "poReference" },
    { headerName: "Project", field: "project" },
    { headerName: "Material", field: "material" },
    { headerName: "Vendor", field: "vendor" },
    { headerName: "Section", field: "section" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Unit Price", field: "unitPrice" },
    { headerName: "Amount (PKR)", field: "amount" },
    { headerName: "Status", field: "status" },
    { headerName: "View Document", field: "proofOfBill" },
    { headerName: "Action", field: "id" },
  ];

  const fetchVendorAccount = async (projectId = null) => {
    try {
      setLoading(true);
      let url = "/vendor-account/vendors";
      if (projectId) {
        url += `?projectId=${projectId}`;
      }

      const response = await apiClient.get(url);
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
            totalBalance: account.totalCredited ? `${account.totalCredited.toLocaleString()}` : "-",
            remainingBalance: account.remainingAmount ? `${account.remainingAmount.toLocaleString()}` : "-",
            paidAmount: account.paidAmount ? `${account.paidAmount.toLocaleString()}` : "-",
            // Store original numeric values for color coding
            totalBalanceValue: account.totalCredited || 0,
            remainingBalanceValue: account.remainingAmount || 0,
            paidAmountValue: account.paidAmount || 0,
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

  const fetchNewPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/purchase-orders?hasAmount=false");
      if (response.ok) {
        const data = response.data.data.map((po, index) => {
          // Create rowData with all PO data and display fields
          const rowData = {
            // Display fields for table
            id: po.id,
            no: index + 1,
            poReference: po.referenceNumber || po.id || "-",
            project: po.demand?.section?.project?.name || "-",
            material: po.material?.name || "-", // Material name for display
            vendor: po.vendor?.name || "-",
            section: po.demand?.section?.name || po.section?.name || "-",
            quantity: po.quantity || "-",
            unit: po.demand?.unit || "-",
            unitPrice: po.unitPrice ? parseFloat(po.unitPrice).toLocaleString('en-US') : "-",
            amount: po.totalAmount ? parseFloat(po.totalAmount).toLocaleString('en-US') : "-",
            status: po.status || "-",
            // Complete PO data for modal
            poData: po // Store complete PO data separately
          };
          return rowData;
        });
        console.log("Mapped purchase orders data:", data); // Debug log
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

  const fetchPurchaseOrdersWithAmount = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/purchase-orders?hasAmount=true");
      if (response.ok) {
        const data = response.data.data.map((po, index) => {
          // Create rowData with all PO data and display fields
          const rowData = {
            // Display fields for table
            id: po.id,
            no: index + 1,
            poReference: po.referenceNumber || po.id || "-",
            project: po.demand?.section?.project?.name || "-",
            material: po.material?.name || "-", // Material name for display
            vendor: po.vendor?.name || "-",
            section: po.demand?.section?.name || po.section?.name || "-",
            quantity: po.quantity || "-",
            unit: po.demand?.unit || "-",
            unitPrice: po.unitPrice ? parseFloat(po.unitPrice).toLocaleString('en-US') : "-",
            amount: po.totalAmount ? parseFloat(po.totalAmount).toLocaleString('en-US') : "-",
            status: po.status || "-",
            proofOfBill: po.proofOfBill || null, // Document URL
            // Complete PO data for modal
            poData: po // Store complete PO data separately
          };
          return rowData;
        });
        console.log("Mapped purchase orders with amount data:", data); // Debug log
        setPurchaseOrdersWithAmount(data);
      } else {
        toast.error("Failed to fetch purchase orders with amounts");
      }
    } catch (error) {
      console.error("Error fetching purchase orders with amounts:", error);
      toast.error("Error fetching purchase orders with amounts");
    } finally {
      setLoading(false);
    }
  };

  // Format number with commas
  const formatAmount = (amount) => {
    return (amount || 0).toLocaleString('en-US');
  };

  // Get color for balance remaining: red for zero/positive, green for negative
  const getBalanceRemainingColor = (balance) => {
    const numericBalance = balance || 0;
    if (numericBalance < 0) {
      return "#22c55e"; // green for negative
    } else {
      return "#ef4444"; // red for zero and positive
    }
  };

  // Update analytics with real data from API
  const payablesData = [
    {
      label: "Total Payables",
      icon: IoPeopleSharp,
      count: formatAmount(payablesSummary.totalCredited),
      countColor: "#ef4444", // red
    },
    {
      label: "Total Paid",
      icon: AccountBalance,
      count: formatAmount(payablesSummary.totalDebited),
      countColor: "#22c55e", // green
    },
    // Only show balance remaining for head accountants
    ...(isHeadAccountant ? [{
      label: "Balance Remaining",
      icon: Balance,
      count: formatAmount(payablesSummary.totalBalance),
      countColor: getBalanceRemainingColor(payablesSummary.totalBalance),
    }] : []),
  ];

  useEffect(() => {
    // Only fetch vendor accounts for head accountants
    if (isHeadAccountant) {
      fetchVendorAccount();
    }
  }, [isHeadAccountant]);

  useEffect(() => {
    fetchNewPurchaseOrders();
    fetchPurchaseOrdersWithAmount();
  }, []);

  // ActionComforRegPOs component with access to fetchNewPurchaseOrders
  const ActionComforRegPOs = ({ value: id }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();



    const handleSuccess = () => {
      // Refresh both purchase orders lists
      fetchNewPurchaseOrders();
      fetchPurchaseOrdersWithAmount();
    };

    return (
      <>
        <DropdownButton
          items={[
            { label: "Add Price", onClick: () => setOpen(true) },
          ]}
        >
          <IconButton>
            <BsThreeDotsVertical />
          </IconButton>
        </DropdownButton>
        <AddPriceModal
          open={open}
          onClose={() => setOpen(false)}
          poId={id}
          onSuccess={handleSuccess}
        />
      </>
    );
  };

  // Action component for Purchase Orders with Amounts
  const ActionForPOsWithAmount = ({ value: id }) => {
    const handleViewDetails = () => {
      const po = purchaseOrdersWithAmount.find(p => p.id === id);
      if (po && po.poData) {
        setSelectedPOForDetails(po.poData);
        setDetailsModalOpen(true);
      }
    };

    const handleEdit = () => {
      const po = purchaseOrdersWithAmount.find(p => p.id === id);
      if (po && po.poData) {
        setSelectedPOForEdit(po.poData);
        setEditModalOpen(true);
        setDetailsModalOpen(false);
      }
    };

    // Check if within 24 hours
    const isWithin24Hours = () => {
      const po = purchaseOrdersWithAmount.find(p => p.id === id);
      if (!po?.poData?.amountAddedAt) return false;
      const now = new Date();
      const amountAddedAt = new Date(po.poData.amountAddedAt);
      const hoursDiff = (now.getTime() - amountAddedAt.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    };

    const canEdit = isWithin24Hours();
    const items = [{ label: "View Details", onClick: handleViewDetails }];
    if (canEdit) {
      items.push({ label: "Edit", onClick: handleEdit });
    }

    return (
      <DropdownButton items={items}>
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
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

  // View Document component for Purchase Orders with Amounts
  const ViewDocument = ({ value }) => {
    if (!value) {
      return <span className="text-gray-400">-</span>;
    }

    const handleViewDocument = () => {
      window.open(value, '_blank');
    };

    return (
      <button
        onClick={handleViewDocument}
        className="text-orange-500 hover:text-orange-600 underline font-medium cursor-pointer"
      >
        View Document
      </button>
    );
  };

  // Color-coded amount component for vendor accounts
  const ColorCodedAmount = ({ value, field }) => {
    if (!value || value === "-") return <span>{value}</span>;

    // Remove commas and convert to number
    const numericValue = parseFloat(value.replace(/,/g, ""));

    if (isNaN(numericValue)) return <span>{value}</span>;

    // Green for negative (overpaid/advance), red for positive > 0 (owe), neutral for zero (balanced)
    let color = "#222222"; // neutral/black for zero
    if (numericValue < 0) {
      color = "#22c55e"; // green for negative (overpaid)
    } else if (numericValue > 0) {
      color = "#ef4444"; // red for positive (we owe)
    }
    const fontWeight = "font-semibold";

    return (
      <span style={{ color, fontWeight }} className={fontWeight}>
        {value}
      </span>
    );
  };

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
              countColor={item.countColor}
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
            placeholder="Filter by status, project or section"
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

      {/* Purchase Orders with Amounts */}
      <div className="mt-10">
        <h1 className="text-xl md:text-2xl font-bold mb-5">
          Purchase Orders with Amounts
        </h1>
        <div className="my-4 flex justify-end">
          <CustomFilterDropdown
            filters={poWithAmountFilters}
            selected={poWithAmountFilter}
            onChange={handlePOWithAmountFilterChange}
            onClear={handlePOWithAmountFilterClear}
            placeholder="Filter by project"
            dropdownAlign="right"
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <SimpleTable
              columns={purchaseOrderWithAmountColumns}
              data={filteredPurchaseOrdersWithAmount}
              cellComponents={{
                id: ActionForPOsWithAmount,
                status: StatusChip,
                proofOfBill: ViewDocument,
                // unitPrice: ColorCodedAmount,
                amount: ColorCodedAmount
              }}
            />
          )}
        </div>
      </div>
      
      {/* Only show vendor accounts section for head accountants */}
      {isHeadAccountant && (
        <div className="mt-10">
          <h1 className="text-xl md:text-2xl font-bold mb-5">Vendor Accounts</h1>
          <div className="overflow-x-auto">
            {loading ? (
              <Loader />
            ) : (
              <SimpleTable
                columns={vendorColumns}
                data={filteredVendorAccounts}
                cellComponents={{ 
                  id: CustomActionComponent,
                  totalBalance: ColorCodedAmount,
                  remainingBalance: ColorCodedAmount,
                  paidAmount: ColorCodedAmount,
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Price Details Modal */}
      <ViewPriceDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedPOForDetails(null);
        }}
        poData={selectedPOForDetails}
        onEdit={() => {
          if (selectedPOForDetails) {
            setSelectedPOForEdit(selectedPOForDetails);
            setEditModalOpen(true);
            setDetailsModalOpen(false);
          }
        }}
      />

      {/* Edit Price Modal */}
      <EditPriceModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPOForEdit(null);
        }}
        poId={selectedPOForEdit?.id}
        poData={selectedPOForEdit}
        onSuccess={() => {
          fetchPurchaseOrdersWithAmount();
          setEditModalOpen(false);
          setSelectedPOForEdit(null);
        }}
      />
    </div>
  );
};

export default AccPayables;
