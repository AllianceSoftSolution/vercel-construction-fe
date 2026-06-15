import React, { useEffect, useState, useRef, useMemo } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import ExportToExcelButton from "../../../components/ExportToExcelButton";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
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
import { formatDateDMY } from '../../../utils';
import { isHeadUser } from "../../../utils/userHelpers";
import {
  PO_EXPORT_COLUMNS,
  VENDOR_PO_EXPORT_COLUMNS,
  PAYMENT_EXPORT_COLUMNS,
} from "../../../utils/payablesExportHelpers";
import { buildExportFileName } from "../../../modules/tableExportHelpers";

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

  // Check if within 24 hours (uses last edit time if available, falls back to add time)
  const isWithin24Hours = () => {
    const refTime = poData.amountLastEditedAt ?? poData.amountAddedAt;
    if (!refTime) return false;
    const hoursDiff = (new Date().getTime() - new Date(refTime).getTime()) / (1000 * 60 * 60);
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

          {!canEdit && !!onEdit && (
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

// â”€â”€â”€ PROJECT COLOR PALETTE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PROJECT_COLORS = ['#0252AD', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

// â”€â”€â”€ TRANSACTION MODAL (Level 3 â€“ Add Payment) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TransactionModal = ({ open, onClose, vendorId, defaultVendorName, defaultProjectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '', note: '', vendorName: defaultVendorName || '',
    projectId: defaultProjectId || '', sectionId: '', file: null,
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);

  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        vendorName: defaultVendorName || '',
        projectId: defaultProjectId || '',
      }));
    }
  }, [open, defaultVendorName, defaultProjectId]);

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
      } catch (e) { console.error('Error fetching projects/sections', e); }
    };
    fetchData();
  }, [open]);

  useEffect(() => {
    if (formData.projectId) {
      setFilteredSections(allSections.filter(s => s.projectId === formData.projectId));
    } else {
      setFilteredSections([]);
    }
    setFormData(prev => ({ ...prev, sectionId: '' }));
  }, [formData.projectId, allSections]);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleFileChange = (e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }));

  const handleSubmit = async () => {
    if (!formData.amount || !formData.note || !formData.vendorName || !formData.projectId || !formData.sectionId) {
      toast.error('Please fill all required fields'); return;
    }
    try {
      setModalLoading(true);
      const submitData = new FormData();
      submitData.append('amount', formData.amount);
      submitData.append('note', formData.note);
      submitData.append('vendorName', formData.vendorName);
      submitData.append('projectId', formData.projectId);
      submitData.append('sectionId', formData.sectionId);
      if (formData.file) submitData.append('proofOfPayment', formData.file);
      const response = await apiClient.post(`/vendor-account/vendors/${vendorId}/payments`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.ok) {
        toast.success('Payment added successfully!');
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.data?.message || 'Failed to add payment');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error('Error adding payment');
    } finally { setModalLoading(false); }
  };

  const handleClose = () => {
    setFormData({ amount: '', note: '', vendorName: defaultVendorName || '', projectId: defaultProjectId || '', sectionId: '', file: null });
    onClose();
  };

  const isSubmitDisabled = modalLoading || !formData.amount || !formData.note || !formData.vendorName || !formData.projectId || !formData.sectionId;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="bg-white p-5 overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <h1 className="text-3xl font-semibold mb-4">Add Payment</h1>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomTextField
              label="Amount *" placeholder="Amount" value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              disabled={modalLoading} type="number"
            />
            <CustomTextField
              label="Vendor Name *" placeholder="Enter vendor name" value={formData.vendorName}
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
              disabled={modalLoading || !!defaultVendorName}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Project Name *</label>
              <select
                className="border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50 disabled:bg-gray-50"
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                disabled={modalLoading || !!defaultProjectId}
              >
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
                {filteredSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <CustomTextField
            label="Note *" placeholder="Note" value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            disabled={modalLoading}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Upload Proof of Payment</label>
            <input type="file" className="border border-gray-300 rounded p-2 w-full" onChange={handleFileChange} disabled={modalLoading} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-[#dddddd] text-[#000000] px-6 py-2 rounded-xl text-lg font-medium hover:bg-[#b0b0b0] transition-colors"
            onClick={handleClose} disabled={modalLoading}
          >Cancel</button>
          <Button buttonText={modalLoading ? 'Submitting...' : 'Add Payment'} onClick={handleSubmit} disabled={isSubmitDisabled} />
        </div>
      </Box>
    </Modal>
  );
};

// â”€â”€â”€ MAIN COMPONENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AccPayables = () => {
  // â”€â”€ Core data state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [loading, setLoading] = useState(false);
  const [drillLoading, setDrillLoading] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrdersWithAmount, setPurchaseOrdersWithAmount] = useState([]);
  const [selectedPOForDetails, setSelectedPOForDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPOForEdit, setSelectedPOForEdit] = useState(null);
  const [payablesSummary, setPayablesSummary] = useState({
    totalVendors: 0, totalCredited: 0, totalDebited: 0, totalBalance: 0,
  });
  const [filter, setFilter] = useState({ Status: [], Project: [], Section: [] });
  const [projects, setProjects] = useState([]);
  const [poWithAmountFilter, setPoWithAmountFilter] = useState({ Project: [] });

  // â”€â”€ Head Accountant drill-down state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [drillLevel, setDrillLevel] = useState('projects'); // 'projects' | 'vendors' | 'payments'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [projectSummaries, setProjectSummaries] = useState([]);
  const [vendorSummaries, setVendorSummaries] = useState([]);
  const [scopedSummary, setScopedSummary] = useState({});
  const [vendorTransactions, setVendorTransactions] = useState([]); // raw transactions for Level 3
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [poProjectTab, setPoProjectTab] = useState('all');
  const [poStatusFilter, setPoStatusFilter] = useState('');

  // â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const user = useSelector((state) => {
    if (!state || !state.auth) return null;
    return state.auth.user;
  });
  const userRole = user?.role;
  const isHeadAccountant = isHeadUser(user);
  const isSectionAccountant = userRole === 'ACCOUNTANT' && !isHeadAccountant;

  // â”€â”€ Status options â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  const projectOptions = projects.map((p) => ({ label: p.name, value: p.id }));
  const sectionOptions = [...new Set(
    [...purchaseOrders, ...purchaseOrdersWithAmount].map(po => po.section).filter(Boolean)
  )];
  const filters = [
    { label: "Status", options: statusOptions.map(o => o.label) },
    { label: "Project", options: projectOptions.map(o => o.label) },
    { label: "Section", options: sectionOptions },
  ];
  const poWithAmountFilters = [{ label: "Project", options: projectOptions.map(o => o.label) }];

  const handleFilterChange = (newSelected) => setFilter(newSelected);
  const handleFilterClear = () => setFilter({ Status: [], Project: [], Section: [] });
  const handlePOWithAmountFilterChange = (newSelected) => setPoWithAmountFilter(newSelected);
  const handlePOWithAmountFilterClear = () => setPoWithAmountFilter({ Project: [] });

  // â”€â”€ Filtered data (section accountant view) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    const statusMatch = !filter.Status?.length ||
      filter.Status.includes(statusOptions.find(opt => opt.value === po.status)?.label || po.status);
    const projectMatch = !filter.Project?.length || filter.Project.includes(po.project);
    const sectionMatch = !filter.Section?.length || filter.Section.includes(po.section || "-");
    return statusMatch && projectMatch && sectionMatch;
  });

  const filteredPurchaseOrdersWithAmount = purchaseOrdersWithAmount.filter((po) => {
    return !poWithAmountFilter.Project?.length || poWithAmountFilter.Project.includes(po.project);
  });

  // â”€â”€ Column definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const purchaseOrderColumns = [
    { headerName: "No.", field: "no" },
    { headerName: "PO Reference", field: "poReference" },
    { headerName: "Project", field: "project" },
    { headerName: "Material", field: "material" },
    { headerName: "Vendor", field: "vendor" },
    { headerName: "Section", field: "section" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit", field: "unit" },
    ...(!isSectionAccountant
      ? [{ headerName: "Unit Price", field: "unitPrice" }, { headerName: "Amount (PKR)", field: "amount" }]
      : [{ headerName: "Payment Status", field: "paymentStatus" }]
    ),
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "id" },
  ];

  const purchaseOrderWithAmountColumns = [
    { headerName: "No.", field: "no" },
    { headerName: "PO Reference", field: "poReference" },
    { headerName: "Project", field: "project" },
    { headerName: "Material", field: "material" },
    { headerName: "Vendor", field: "vendor" },
    { headerName: "Section", field: "section" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit", field: "unit" },
    ...(!isSectionAccountant
      ? [{ headerName: "Unit Price", field: "unitPrice" }, { headerName: "Amount (PKR)", field: "amount" }]
      : [{ headerName: "Payment Status", field: "paymentStatus" }]
    ),
    { headerName: "Status", field: "status" },
    { headerName: "View Document", field: "proofOfBill" },
    { headerName: "Action", field: "id" },
  ];

  // â”€â”€ Format helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const formatAmount = (amount) => (amount || 0).toLocaleString('en-US');
  const getBalanceRemainingColor = (balance) => (balance || 0) < 0 ? "#22c55e" : "#ef4444";
  const getPaymentStatus = (paymentStatus) => {
    const s = (paymentStatus || '').toUpperCase();
    if (s === 'FULLY_PAID') return 'Paid';
    if (s === 'PARTIALLY_PAID') return 'Partially Paid';
    return 'Balance';
  };

  // â”€â”€ Status chip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const statusColorMap = {
    APPROVED: "#22c55e", REJECTED: "#ef4444", PENDING: "#f59e42",
    PARTIALLY_APPROVED: "#eab308", PO_CREATED: "#8b5cf6", FULFILLED: "#0ea5e9",
    COMPLETED: "#22c55e", PARTIAL: "#eab308", ORDER_PLACED: "#f59e42",
    IN_TRANSIT: "#0ea5e9", IN_STORE: "#8b5cf6", CANCELLED: "#ef4444", default: "#0252AD",
  };
  const StatusChip = ({ value }) => {
    const status = (value || "PENDING").toUpperCase();
    const color = statusColorMap[status] || statusColorMap.default;
    return (
      <Chip
        label={status.replace(/_/g, " ")} size="small"
        sx={{ bgcolor: color, color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}
      />
    );
  };

  const PaymentStatusBadge = ({ value }) => {
    const bg = value === 'Paid' ? '#4CAF50' : value === 'Partially Paid' ? '#FFD700' : '#00BCD4';
    const color = value === 'Partially Paid' ? '#333' : '#fff';
    return (
      <span style={{ backgroundColor: bg, color, borderRadius: '12px', padding: '3px 12px', fontWeight: 600, fontSize: '12px', display: 'inline-block', whiteSpace: 'nowrap' }}>
        {value || 'Balance'}
      </span>
    );
  };

  const ViewDocument = ({ value }) => {
    if (!value) return <span className="text-gray-400">-</span>;
    return (
      <button onClick={() => window.open(value, '_blank')} className="text-orange-500 hover:text-orange-600 underline font-medium cursor-pointer">
        View Document
      </button>
    );
  };

  const ColorCodedAmount = ({ value }) => {
    if (!value || value === "-") return <span>{value}</span>;
    const n = parseFloat(value.replace(/,/g, ""));
    if (isNaN(n)) return <span>{value}</span>;
    const color = n < 0 ? "#22c55e" : n > 0 ? "#ef4444" : "#222222";
    return <span style={{ color, fontWeight: "600" }}>{value}</span>;
  };

  // â”€â”€ API fetch functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchVendorAccount = async () => {
    // For section accountants: fetch summary via the dedicated endpoint (role-scoped on backend)
    try {
      setLoading(true);
      const response = await apiClient.get("/vendor-account/payables-summary");
      if (response.ok) {
        const s = response.data.data || {};
        setPayablesSummary({
          totalCredited: s.totalPayables ?? 0,
          totalDebited: s.totalPaid ?? 0,
          totalBalance: s.balance ?? 0,
        });
      }
    } catch (error) {
      console.error("Error fetching vendor accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewPurchaseOrders = async () => {
    try {
      const response = await apiClient.get("/purchase-orders?hasAmount=false");
      if (response.ok) {
        const data = response.data.data.map((po, index) => ({
          id: po.id, no: index + 1,
          poReference: po.referenceNumber || po.id || "-",
          project: po.demand?.section?.project?.name || "-",
          material: po.material?.name || "-",
          vendor: po.vendor?.name || "-",
          section: po.demand?.section?.name || po.section?.name || "-",
          quantity: po.quantity || "-",
          unit: po.demand?.unit || "-",
          unitPrice: po.unitPrice ? parseFloat(po.unitPrice).toLocaleString('en-US') : "-",
          amount: po.totalAmount ? parseFloat(po.totalAmount).toLocaleString('en-US') : "-",
          status: po.status || "-",
          paymentStatus: getPaymentStatus(po.paymentStatus),
          hasAmount: false,
          poData: po,
        }));
        setPurchaseOrders(data);
      }
    } catch (error) { console.error("Error fetching purchase orders:", error); }
  };

  const fetchPurchaseOrdersWithAmount = async () => {
    try {
      const response = await apiClient.get("/purchase-orders?hasAmount=true");
      if (response.ok) {
        const data = response.data.data.map((po, index) => ({
          id: po.id, no: index + 1,
          poReference: po.referenceNumber || po.id || "-",
          project: po.demand?.section?.project?.name || "-",
          material: po.material?.name || "-",
          vendor: po.vendor?.name || "-",
          section: po.demand?.section?.name || po.section?.name || "-",
          quantity: po.quantity || "-",
          unit: po.demand?.unit || "-",
          unitPrice: po.unitPrice ? parseFloat(po.unitPrice).toLocaleString('en-US') : "-",
          amount: po.totalAmount ? parseFloat(po.totalAmount).toLocaleString('en-US') : "-",
          status: po.status || "-",
          paymentStatus: getPaymentStatus(po.paymentStatus),
          hasAmount: true,
          proofOfBill: po.proofOfBill || null,
          poData: po,
        }));
        setPurchaseOrdersWithAmount(data);
      }
    } catch (error) { console.error("Error fetching purchase orders with amounts:", error); }
  };

  // â”€â”€ HEAD ACCOUNTANT: Project summaries (Level 1) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchProjectSummaries = async () => {
    try {
      setDrillLoading(true);

      // Use dedicated summary endpoints to get accurate totals from PO amounts / payments
      const [summaryRes, byProjectRes, projRes] = await Promise.all([
        apiClient.get('/vendor-account/payables-summary'),
        apiClient.get('/vendor-account/payables-summary/by-project'),
        apiClient.get('/projects'),
      ]);

      if (projRes.ok) setProjects(projRes.data.projects || []);

      if (summaryRes.ok) {
        const s = summaryRes.data.data || {};
        setPayablesSummary({
          totalCredited: s.totalPayables ?? 0,
          totalDebited: s.totalPaid ?? 0,
          totalBalance: s.balance ?? 0,
        });
      }

      if (byProjectRes.ok) {
        const rows = byProjectRes.data.data || [];
        setProjectSummaries(
          rows.map((r, idx) => ({
            projectId: r.projectId,
            projectName: r.projectName,
            totalPayable: r.totalPayable,
            totalPaid: r.totalPaid,
            balance: r.balance,
            color: PROJECT_COLORS[idx % PROJECT_COLORS.length],
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching project summaries:", error);
      toast.error("Error fetching project data");
    } finally {
      setDrillLoading(false);
    }
  };

  // â”€â”€ HEAD ACCOUNTANT: Level 1 â†’ 2 (click a project card) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleProjectClick = async (project) => {
    try {
      setDrillLoading(true);
      const res = await apiClient.get(`/vendor-account/vendors?projectId=${project.projectId}`);
      if (res.ok) {
        const vendorData = res.data.data || [];
        const summary = res.data.summary || {};
        setVendorSummaries(vendorData.map(v => ({
          vendorId: v.vendorId,
          vendorName: v.vendor?.name || '-',
          totalPayable: v.totalCredited || 0,
          totalPaid: v.paidAmount || 0,
          balance: v.remainingAmount || 0,
        })));
        setScopedSummary(summary);
      }
      setSelectedProject(project);
      setDrillLevel('vendors');
    } catch (error) {
      console.error("Error loading vendor list:", error);
      toast.error("Error loading vendors for this project");
    } finally {
      setDrillLoading(false);
    }
  };

  // â”€â”€ HEAD ACCOUNTANT: Level 2 â†’ 3 (click a vendor card) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleVendorClick = async (vendor) => {
    try {
      setDrillLoading(true);
      const projectParam = selectedProject?.projectId ? `?projectId=${selectedProject.projectId}` : '';
      const res = await apiClient.get(`/vendor-account/vendors/${vendor.vendorId}/statement${projectParam}`);
      if (res.ok) {
        const data = res.data.data;
        setVendorTransactions(data.transactions || []);
      }
      // Use project-scoped totals already stored in vendor object (from Level 2 fetch)
      setScopedSummary({
        totalCredited: vendor.totalPayable,
        totalDebited: vendor.totalPaid,
        totalBalance: vendor.balance,
      });
      setSelectedVendor(vendor);
      setDrillLevel('payments');
    } catch (error) {
      console.error("Error loading vendor statement:", error);
      toast.error("Error loading payment details");
    } finally {
      setDrillLoading(false);
    }
  };

  // â”€â”€ Breadcrumb navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const goToProjects = () => {
    setDrillLevel('projects');
    setSelectedProject(null);
    setSelectedVendor(null);
    setVendorSummaries([]);
    setVendorTransactions([]);
  };

  const goToVendors = () => {
    setSelectedVendor(null);
    setVendorTransactions([]);
    setDrillLevel('vendors');
  };

  // â”€â”€ Level 3 computed data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const getVendorProjectPOs = () => {
    if (!selectedVendor || !selectedProject) return [];
    return [...purchaseOrders, ...purchaseOrdersWithAmount].filter(
      po => po.vendor === selectedVendor.vendorName && po.project === selectedProject.projectName
    );
  };

  const getVendorProjectPayments = () => {
    // The backend already returns only project-scoped transactions when projectId is passed.
    // Only surface DEBIT entries that are payment-linked (vendorPaymentId present).
    return vendorTransactions.filter(t => t.type === 'DEBIT' && t.vendorPaymentId);
  };

  const allMergedPOs = useMemo(() => {
    const seen = new Set();
    return [...purchaseOrders, ...purchaseOrdersWithAmount].filter((po) => {
      if (seen.has(po.id)) return false;
      seen.add(po.id);
      return true;
    });
  }, [purchaseOrders, purchaseOrdersWithAmount]);

  const poProjectObj = projects.find((p) => p.id === poProjectTab);

  const headAccountantFilteredPOs = useMemo(
    () =>
      allMergedPOs
        .filter(
          (po) => poProjectTab === "all" || po.project === poProjectObj?.name,
        )
        .filter((po) => !poStatusFilter || po.status === poStatusFilter)
        .map((po, idx) => ({ ...po, no: idx + 1 })),
    [allMergedPOs, poProjectTab, poProjectObj, poStatusFilter],
  );

  const headPoExportFileName = useMemo(
    () =>
      buildExportFileName("purchase-orders", {
        projectName:
          poProjectTab !== "all" ? poProjectObj?.name : undefined,
      }),
    [poProjectTab, poProjectObj],
  );

  const vendorPOsForLevel3 = useMemo(() => {
    if (!selectedVendor || !selectedProject) return [];
    return allMergedPOs.filter(
      (po) =>
        po.vendor === selectedVendor.vendorName &&
        po.project === selectedProject.projectName,
    );
  }, [allMergedPOs, selectedVendor, selectedProject]);

  const paymentsForLevel3 = useMemo(
    () =>
      vendorTransactions
        .filter((t) => t.type === "DEBIT" && t.vendorPaymentId)
        .map((t) => ({
          id: t.id,
          date: t.createdAt ? formatDateDMY(t.createdAt) : "-",
          amount: t.amount
            ? `PKR ${parseFloat(t.amount).toLocaleString("en-US")}`
            : "-",
          note: t.note || "-",
          proofOfPayment: t.proofOfPayment || null,
        })),
    [vendorTransactions],
  );

  // â”€â”€ Action components (section accountant table view) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const ActionComforRegPOs = ({ value: id }) => {
    const [open, setOpen] = useState(false);
    const handleSuccess = () => { fetchNewPurchaseOrders(); fetchPurchaseOrdersWithAmount(); };
    return (
      <>
        <DropdownButton items={[{ label: "Add Price", onClick: () => setOpen(true) }]}>
          <IconButton><BsThreeDotsVertical /></IconButton>
        </DropdownButton>
        <AddPriceModal open={open} onClose={() => setOpen(false)} poId={id} onSuccess={handleSuccess} />
      </>
    );
  };

  const ActionForPOsWithAmount = ({ value: id }) => {
    const handleViewDetails = () => {
      const po = purchaseOrdersWithAmount.find(p => p.id === id);
      if (po?.poData) { setSelectedPOForDetails(po.poData); setDetailsModalOpen(true); }
    };
    const handleEdit = () => {
      const po = purchaseOrdersWithAmount.find(p => p.id === id);
      if (po?.poData) { setSelectedPOForEdit(po.poData); setEditModalOpen(true); setDetailsModalOpen(false); }
    };
    const isWithin24Hours = () => {
      const po = purchaseOrdersWithAmount.find(p => p.id === id);
      if (!po?.poData?.amountAddedAt) return false;
      return (new Date() - new Date(po.poData.amountAddedAt)) / (1000 * 60 * 60) <= 24;
    };
    const items = [{ label: "View Details", onClick: handleViewDetails }];
    return (
      <DropdownButton items={items}>
        <IconButton><BsThreeDotsVertical /></IconButton>
      </DropdownButton>
    );
  };

  // Refresh Level 3 data after a payment is added (updates totals + payment list without leaving the view)
  const refreshVendorData = async () => {
    if (!selectedProject || !selectedVendor) return;
    try {
      setDrillLoading(true);
      const [vendorRes, statementRes] = await Promise.all([
        apiClient.get(`/vendor-account/vendors?projectId=${selectedProject.projectId}`),
        apiClient.get(`/vendor-account/vendors/${selectedVendor.vendorId}/statement?projectId=${selectedProject.projectId}`),
      ]);

      if (vendorRes.ok) {
        const vendorData = vendorRes.data.data || [];
        const updatedVendors = vendorData.map(v => ({
          vendorId: v.vendorId,
          vendorName: v.vendor?.name || '-',
          totalPayable: v.totalCredited || 0,
          totalPaid: v.paidAmount || 0,
          balance: v.remainingAmount || 0,
        }));
        setVendorSummaries(updatedVendors);

        const freshVendor = updatedVendors.find(v => v.vendorId === selectedVendor.vendorId);
        if (freshVendor) {
          setSelectedVendor(freshVendor);
          setScopedSummary({
            totalCredited: freshVendor.totalPayable,
            totalDebited: freshVendor.totalPaid,
            totalBalance: freshVendor.balance,
          });
        }

        // Update projectSummaries and top banner cards from fresh per-project data
        setProjectSummaries(prev => {
          const next = prev.map(ps =>
            ps.projectId === selectedProject.projectId
              ? { ...ps, totalPaid: vendorRes.data.summary?.totalDebited ?? ps.totalPaid, balance: vendorRes.data.summary?.totalBalance ?? ps.balance }
              : ps
          );
          // Recompute top-level payablesSummary from the updated list
          const combined = next.reduce((acc, r) => ({
            totalCredited: acc.totalCredited + r.totalPayable,
            totalDebited: acc.totalDebited + r.totalPaid,
            totalBalance: acc.totalBalance + r.balance,
          }), { totalCredited: 0, totalDebited: 0, totalBalance: 0 });
          setPayablesSummary(combined);
          return next;
        });
      }

      if (statementRes.ok) {
        setVendorTransactions(statementRes.data.data?.transactions || []);
      }

      // Re-fetch POs so paymentStatus badges reflect the new payment
      await Promise.all([fetchNewPurchaseOrders(), fetchPurchaseOrdersWithAmount()]);
    } catch (error) {
      console.error('Error refreshing vendor data:', error);
    } finally {
      setDrillLoading(false);
    }
  };

  // â”€â”€ Global summary card data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const payablesData = [
    { label: "Total Payables", icon: IoPeopleSharp, count: formatAmount(payablesSummary.totalCredited), countColor: "#ef4444" },
    { label: "Total Paid", icon: AccountBalance, count: formatAmount(payablesSummary.totalDebited), countColor: "#22c55e" },
    ...(isHeadAccountant ? [{
      label: "Balance Remaining", icon: Balance,
      count: formatAmount(payablesSummary.totalBalance),
      countColor: getBalanceRemainingColor(payablesSummary.totalBalance),
    }] : []),
  ];

  // â”€â”€ Effects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!user) return; // Wait for auth state to be populated before branching on role
    fetchNewPurchaseOrders();
    fetchPurchaseOrdersWithAmount();
    if (isHeadAccountant) {
      // fetchProjectSummaries also computes and sets payablesSummary for assigned projects only
      fetchProjectSummaries();
    } else {
      // For section accountant, fetch global summary and project list for filters
      fetchVendorAccount();
      apiClient.get('/projects').then(r => { if (r.ok) setProjects(r.data.projects || []); }).catch(() => {});
    }
  }, [isHeadAccountant]); // Re-run when the user/role is determined from Redux

  // â”€â”€ HEAD ACCOUNTANT RENDER FUNCTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // -- HEAD ACCOUNTANT: PO action cell (handles both with/without price) -------
  const HeadPOActionCell = ({ po }) => {
    const [addPriceOpen, setAddPriceOpen] = useState(false);
    const handleSuccess = () => { fetchNewPurchaseOrders(); fetchPurchaseOrdersWithAmount(); };

    if (!po.hasAmount) {
      return (
        <>
          <DropdownButton items={[{ label: "Add Price", onClick: () => setAddPriceOpen(true) }]}>
            <IconButton><BsThreeDotsVertical /></IconButton>
          </DropdownButton>
          <AddPriceModal open={addPriceOpen} onClose={() => setAddPriceOpen(false)} poId={po.id} onSuccess={handleSuccess} />
        </>
      );
    }
    const isWithin24h = () => {
      const refTime = po.poData?.amountLastEditedAt ?? po.poData?.amountAddedAt;
      if (!refTime) return false;
      return (new Date() - new Date(refTime)) / (1000 * 60 * 60) <= 24;
    };
    const items = [{ label: "View Details", onClick: () => { setSelectedPOForDetails(po.poData); setDetailsModalOpen(true); } }];
    if (isWithin24h()) items.push({ label: "Edit", onClick: () => { setSelectedPOForEdit(po.poData); setEditModalOpen(true); } });
    return (
      <DropdownButton items={items}>
        <IconButton><BsThreeDotsVertical /></IconButton>
      </DropdownButton>
    );
  };

  // -- HEAD ACCOUNTANT: single PO table row ---------------------------------
  const renderPOTableRow = (po, idx) => (
    <tr key={po.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-500">{po.no || idx + 1}</td>
      <td className="px-4 py-3 text-sm text-gray-800 font-medium whitespace-nowrap">{po.poReference || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{po.project || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{po.material || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{po.vendor || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{po.section || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700 text-center">{po.quantity || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{po.unit || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{po.unitPrice && po.unitPrice !== '-' ? `PKR ${po.unitPrice}` : '-'}</td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{po.amount && po.amount !== '-' ? `PKR ${po.amount}` : '-'}</td>
      <td className="px-4 py-3"><StatusChip value={po.status} /></td>
      <td className="px-4 py-3"><HeadPOActionCell po={po} /></td>
    </tr>
  );

  // -- HEAD ACCOUNTANT: Purchase Orders with project tab navigation ---------
  const renderHeadAccountantPOs = () => {
    const tabFiltered = headAccountantFilteredPOs;

    // Vendor grouping (only when a specific project tab is selected)
    const vendorGroups = poProjectTab !== 'all'
      ? tabFiltered.reduce((acc, po) => {
          const key = po.vendor || '-';
          if (!acc[key]) acc[key] = [];
          acc[key].push(po);
          return acc;
        }, {})
      : null;

    const colHeaders = ['No.', 'PO Reference', 'Project', 'Material', 'Vendor', 'Section', 'Qty', 'Unit', 'Unit Price', 'Amount (PKR)', 'Status', 'Action'];

    return (
      <div className="mt-10">
        <h1 className="text-xl md:text-2xl font-bold mb-5">Purchase Orders</h1>

        {/* Project pill tabs + Status filter + Export */}
        <div className="flex flex-row flex-wrap items-center justify-end gap-2 sm:gap-3 mb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
            {[{ id: 'all', name: 'All' }, ...projects].map(proj => (
              <button
                key={proj.id}
                onClick={() => setPoProjectTab(proj.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-colors flex-shrink-0 ${
                  poProjectTab === proj.id
                    ? 'bg-[#0252AD] text-white border-[#0252AD] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#0252AD] hover:text-[#0252AD]'
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>
          <select
            value={poStatusFilter}
            onChange={e => setPoStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#0252AD] flex-shrink-0"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ExportToExcelButton
            data={tabFiltered}
            columns={PO_EXPORT_COLUMNS}
            fileName={headPoExportFileName}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-10"><Loader /></div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {colHeaders.map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tabFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={colHeaders.length} className="text-center py-12 text-gray-400 text-sm">
                      No purchase orders found.
                    </td>
                  </tr>
                ) : vendorGroups ? (
                  // Grouped by vendor
                  Object.entries(vendorGroups).map(([vendorName, vendorPOs]) => {
                    const vendorTotal = vendorPOs.reduce((sum, po) => {
                      const amt = parseFloat((po.amount || '0').toString().replace(/,/g, ''));
                      return sum + (isNaN(amt) ? 0 : amt);
                    }, 0);
                    return (
                      <React.Fragment key={vendorName}>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <td colSpan={colHeaders.length} className="px-4 py-2.5">
                            <span className="font-bold text-gray-700 text-sm">Vendor: {vendorName}</span>
                            {vendorTotal > 0 && (
                              <span className="ml-3 text-gray-500 text-sm font-medium">
                                — Total: PKR {vendorTotal.toLocaleString('en-US')}
                              </span>
                            )}
                          </td>
                        </tr>
                        {vendorPOs.map((po, idx) => renderPOTableRow(po, idx))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  // Flat list (All tab)
                  tabFiltered.map((po, idx) => renderPOTableRow(po, idx))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Level 1: Project cards
  const renderLevel1 = () => (
    <div className="mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Projects</h2>
      {drillLoading ? (
        <div className="flex justify-center py-16"><Loader /></div>
      ) : projectSummaries.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-lg">No project payables data found.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {projectSummaries.map((project) => (
            <button
              key={project.projectId}
              onClick={() => handleProjectClick(project)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 flex items-center justify-between p-5 text-left w-full group"
              style={{ borderLeft: `5px solid ${project.color}` }}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-[#0252AD] transition-colors">
                  {project.projectName}
                </h3>
                <div className="flex flex-wrap gap-8 mt-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Payable Amount</p>
                    <p className="text-base font-semibold text-red-500">PKR {formatAmount(project.totalPayable)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Paid Amount</p>
                    <p className="text-base font-semibold text-green-600">PKR {formatAmount(project.totalPaid)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Balance Remaining</p>
                    <p className="text-base font-semibold text-blue-600">PKR {formatAmount(project.balance)}</p>
                  </div>
                </div>
              </div>
              <FiChevronRight className="text-gray-300 group-hover:text-[#0252AD] text-2xl ml-5 flex-shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Level 2: Vendor cards for selected project
  const renderLevel2 = () => (
    <div className="mt-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2 flex-wrap">
        <button onClick={goToProjects} className="hover:text-orange-500 transition-colors font-medium">Payables</button>
        <FiChevronRight className="text-gray-400 flex-shrink-0" />
        <span className="text-gray-800 font-semibold">{selectedProject?.projectName}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={goToProjects}
        className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-semibold mb-6 mt-0.5"
      >
        <FiChevronLeft /> Back to Projects
      </button>

      {/* Project-scoped summary cards */}
      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {[
          { label: "Total Payables", count: formatAmount(scopedSummary.totalCredited), color: "#ef4444" },
          { label: "Total Paid", count: formatAmount(scopedSummary.totalDebited), color: "#22c55e" },
          { label: "Balance Remaining", count: formatAmount(scopedSummary.totalBalance), color: getBalanceRemainingColor(scopedSummary.totalBalance) },
        ].map((card, i) => (
          <div key={i} className={i < 2 ? "relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 sm:last:after:hidden" : ""}>
            <AnalyticsCard label={card.label} icon={i === 0 ? IoPeopleSharp : i === 1 ? AccountBalance : Balance} count={card.count} countColor={card.color} />
          </div>
        ))}
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Vendors</h2>
      {drillLoading ? (
        <div className="flex justify-center py-16"><Loader /></div>
      ) : vendorSummaries.length === 0 ? (
        <div className="text-center text-gray-400 py-16 text-lg">No vendors found for this project.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {vendorSummaries.map((vendor) => (
            <button
              key={vendor.vendorId}
              onClick={() => handleVendorClick(vendor)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 flex items-center justify-between p-5 text-left w-full group"
              style={{ borderLeft: `5px solid ${selectedProject?.color || '#0252AD'}` }}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-[#0252AD] transition-colors">
                  {vendor.vendorName}
                </h3>
                <div className="flex flex-wrap gap-8 mt-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total PO Amount</p>
                    <p className="text-base font-semibold text-red-500">PKR {formatAmount(vendor.totalPayable)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total Paid</p>
                    <p className="text-base font-semibold text-green-600">PKR {formatAmount(vendor.totalPaid)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Balance</p>
                    <p className="text-base font-semibold text-blue-600">PKR {formatAmount(vendor.balance)}</p>
                  </div>
                </div>
              </div>
              <FiChevronRight className="text-gray-300 group-hover:text-[#0252AD] text-2xl ml-5 flex-shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Level 3: Payment detail view for selected vendor in selected project
  const renderLevel3 = () => {
    const vendorPOs = getVendorProjectPOs();
    const payments = getVendorProjectPayments();

    return (
      <div className="mt-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2 flex-wrap">
          <button onClick={goToProjects} className="hover:text-orange-500 transition-colors font-medium">Payables</button>
          <FiChevronRight className="text-gray-400 flex-shrink-0" />
          <button onClick={goToVendors} className="hover:text-orange-500 transition-colors font-medium">{selectedProject?.projectName}</button>
          <FiChevronRight className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-800 font-semibold">{selectedVendor?.vendorName}</span>
        </nav>

        {/* Back button + Add Payment */}
        <div className="flex items-center justify-between mt-0.5 mb-6">
          <button
            onClick={goToVendors}
            className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-semibold"
          >
            <FiChevronLeft /> Back to Vendors
          </button>
          <button
            onClick={() => setAddPaymentOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            + Add Payment
          </button>
        </div>

        {drillLoading ? (
          <div className="flex justify-center py-16"><Loader /></div>
        ) : (
          <>
            {/* Credit / Debit / Balance summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-600 rounded-xl p-5 text-white shadow-md">
                <p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Credit (Total Payable)</p>
                <p className="text-2xl font-bold mt-2">PKR {formatAmount(scopedSummary.totalCredited)}</p>
              </div>
              <div className="bg-red-500 rounded-xl p-5 text-white shadow-md">
                <p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Debit (Total Paid)</p>
                <p className="text-2xl font-bold mt-2">PKR {formatAmount(scopedSummary.totalDebited)}</p>
              </div>
              <div className="bg-green-600 rounded-xl p-5 text-white shadow-md">
                <p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Balance</p>
                <p className="text-2xl font-bold mt-2">PKR {formatAmount(scopedSummary.totalBalance)}</p>
              </div>
            </div>

            {/* Purchase Orders Table */}
            <div className="mb-10">
              <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Purchase Orders</h2>
                <ExportToExcelButton
                  data={vendorPOsForLevel3}
                  columns={VENDOR_PO_EXPORT_COLUMNS}
                  fileName="vendor-purchase-orders"
                />
              </div>
              {vendorPOs.length === 0 ? (
                <div className="text-gray-400 text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
                  No purchase orders found for this vendor in this project.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {['PO Reference', 'Material', 'Section', 'Qty', 'Unit', 'Unit Price', 'Amount (PKR)', 'Status', 'View Document'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vendorPOs.map((po, idx) => (
                        <tr key={po.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-800 font-medium whitespace-nowrap">{po.poReference || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{po.material || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{po.section || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">{po.quantity || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{po.unit || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{po.unitPrice ? `PKR ${po.unitPrice}` : '-'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{po.amount ? `PKR ${po.amount}` : '-'}</td>
                          <td className="px-4 py-3">
                            <StatusChip value={po.status} />
                          </td>
                          <td className="px-4 py-3">
                            {po.proofOfBill ? (
                              <button
                                onClick={() => window.open(po.proofOfBill, '_blank')}
                                className="text-orange-500 hover:text-orange-600 underline font-medium text-sm"
                              >
                                View Document
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Payments Made */}
            <div>
              <div className="flex flex-row flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Payments Made</h2>
                <ExportToExcelButton
                  data={paymentsForLevel3}
                  columns={PAYMENT_EXPORT_COLUMNS}
                  fileName="vendor-payments"
                />
              </div>
              {payments.length === 0 ? (
                <div className="text-gray-400 text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
                  No payments recorded yet for this vendor in this project.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        {['Date', 'Amount (PKR)', 'Note', 'Proof'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((t, idx) => (
                        <tr key={t.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                            {t.createdAt ? formatDateDMY(t.createdAt) : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600 whitespace-nowrap">
                            {t.amount ? `PKR ${parseFloat(t.amount).toLocaleString('en-US')}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{t.note || '-'}</td>
                          <td className="px-4 py-3">
                            {t.proofOfPayment ? (
                              <a
                                href={t.proofOfPayment} target="_blank" rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 underline text-sm font-medium"
                              >
                                View Proof
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // â”€â”€â”€ RENDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div>
      <TopBar title="Payables" />

      {/* Global summary cards â€” always visible */}
      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {payablesData.map((item, index) => (
          <div
            key={index}
            className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 lg:last:after:hidden"
          >
            <AnalyticsCard label={item.label} icon={item.icon} count={item.count} countColor={item.countColor} />
          </div>
        ))}
      </div>

      {/* HEAD ACCOUNTANT: 3-level drill-down */}
      {isHeadAccountant ? (
        <>
          {drillLevel === 'projects' && renderLevel1()}
          {drillLevel === 'projects' && renderHeadAccountantPOs()}
          {drillLevel === 'vendors' && renderLevel2()}
          {drillLevel === 'payments' && renderLevel3()}
        </>
      ) : (
        /* SECTION ACCOUNTANT: flat table views */
        <>
          <div className="mt-10">
            <h1 className="text-xl md:text-2xl font-bold mb-5">Purchase Orders</h1>
            <div className="overflow-x-auto">
              {loading ? <Loader /> : (
                <SimpleTable
                  columns={purchaseOrderColumns}
                  data={filteredPurchaseOrders}
                  tableFilters={[{ label: "Status", options: statusOptions.map(o => o.label) }]}
                  filterSelected={{ Status: filter.Status }}
                  onFilterChange={(s) => setFilter(prev => ({ ...prev, Status: s.Status || [] }))}
                  onFilterClear={() => setFilter(prev => ({ ...prev, Status: [] }))}
                  filterPlaceholder="Filter by status"
                  filterDropdownAlign="right"
                  exportFileName="purchase-orders"
                  cellComponents={{
                    id: ActionComforRegPOs,
                    status: StatusChip,
                    ...(isSectionAccountant ? { paymentStatus: PaymentStatusBadge } : {}),
                  }}
                />
              )}
            </div>
          </div>

          <div className="mt-10">
            <h1 className="text-xl md:text-2xl font-bold mb-5">Purchase Orders with Amounts</h1>
            <div className="overflow-x-auto">
              {loading ? <Loader /> : (
                <SimpleTable
                  columns={purchaseOrderWithAmountColumns}
                  data={filteredPurchaseOrdersWithAmount}
                  tableFilters={poWithAmountFilters}
                  filterSelected={poWithAmountFilter}
                  onFilterChange={handlePOWithAmountFilterChange}
                  onFilterClear={handlePOWithAmountFilterClear}
                  filterPlaceholder="Filter by project"
                  filterDropdownAlign="right"
                  exportFileName="purchase-orders-with-amount"
                  cellComponents={{
                    id: ActionForPOsWithAmount,
                    status: StatusChip,
                    proofOfBill: ViewDocument,
                    ...(isSectionAccountant
                      ? { paymentStatus: PaymentStatusBadge }
                      : { amount: ColorCodedAmount }
                    ),
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Price Details Modal */}
      <ViewPriceDetailsModal
        open={detailsModalOpen}
        onClose={() => { setDetailsModalOpen(false); setSelectedPOForDetails(null); }}
        poData={selectedPOForDetails}
        onEdit={isHeadAccountant ? () => {
          if (selectedPOForDetails) {
            setSelectedPOForEdit(selectedPOForDetails);
            setEditModalOpen(true);
            setDetailsModalOpen(false);
          }
        } : null}
      />

      {/* Edit Price Modal */}
      <EditPriceModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedPOForEdit(null); }}
        poId={selectedPOForEdit?.id}
        poData={selectedPOForEdit}
        onSuccess={() => { fetchPurchaseOrdersWithAmount(); setEditModalOpen(false); setSelectedPOForEdit(null); }}
      />

      {/* Level 3: Add Payment Modal */}
      {isHeadAccountant && selectedVendor && (
        <TransactionModal
          open={addPaymentOpen}
          onClose={() => setAddPaymentOpen(false)}
          vendorId={selectedVendor.vendorId}
          defaultVendorName={selectedVendor.vendorName}
          defaultProjectId={selectedProject?.projectId}
          onSuccess={() => {
            setAddPaymentOpen(false);
            // Re-fetch vendor totals + payment list while staying at Level 3
            refreshVendorData();
          }}
        />
      )}
    </div>
  );
};

export default AccPayables;
