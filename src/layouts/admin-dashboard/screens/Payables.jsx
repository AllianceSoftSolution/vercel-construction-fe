import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import DropdownButton from "../../../comments/components/DropdownButton";
import { Box, IconButton, Modal, Chip } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import CustomTextField from "../../../mui/CustomTextField";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import { IoPeopleSharp } from "react-icons/io5";
import { AccountBalance, Balance } from "@mui/icons-material";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import { formatDateDMY } from "../../../utils";

const PROJECT_COLORS = ['#0252AD', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

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

// â”€â”€â”€ Add Price Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AddPriceModal = ({ open, onClose, poId, onSuccess }) => {
  const [formData, setFormData] = useState({
    unitPrice: "",
    notes: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      toast.error("Please enter a valid unit price");
      return;
    }

    if (!formData.notes || formData.notes.trim() === "") {
      toast.error("Please enter notes");
      return;
    }

    try {
      setLoading(true);

      // Create form data for file upload
      const submitData = new FormData();
      submitData.append("unitPrice", formData.unitPrice);
      submitData.append("notes", formData.notes.trim());
      if (file) {
        submitData.append("proofOfBill", file);
      }

      const response = await apiClient.patch(
        `/purchase-orders/${poId}/amount`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.ok) {
        toast.success("Price added successfully!");
        handleClose();
        // Call onSuccess callback to refresh data
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.data?.message || "Failed to add price");
      }
    } catch (error) {
      console.error("Error adding price:", error);
      toast.error(error.response?.data?.message || "Error adding price");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ unitPrice: "", notes: "" });
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
            onChange={(e) => handleInputChange("unitPrice", e.target.value)}
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
            onChange={(e) => handleInputChange("notes", e.target.value)}
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

// â”€â”€â”€ Edit Price Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const EditPriceModal = ({ open, onClose, poId, poData, onSuccess }) => {
  const [formData, setFormData] = useState({
    unitPrice: poData?.unitPrice?.toString() || '',
    notes: poData?.notes || '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (poData) setFormData({ unitPrice: poData.unitPrice?.toString() || '', notes: poData.notes || '' });
  }, [poData]);

  const handleClose = () => {
    setFormData({ unitPrice: '', notes: '' });
    setFile(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) { toast.error('Please enter a valid unit price'); return; }
    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append('unitPrice', formData.unitPrice);
      if (formData.notes.trim()) submitData.append('notes', formData.notes.trim());
      if (file) submitData.append('proofOfBill', file);
      const response = await apiClient.put(`/purchase-orders/${poId}/amount`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.ok) { toast.success('Price updated successfully!'); handleClose(); if (onSuccess) onSuccess(); }
      else toast.error(response.data?.message || 'Failed to update price');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating price');
    } finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="bg-white p-5">
        <h1 className="text-3xl font-semibold mb-4">Edit Price Details</h1>
        <div className="flex flex-col gap-5">
          <CustomTextField label="Unit Price" placeholder="Enter Unit Price" value={formData.unitPrice}
            onChange={(e) => setFormData(p => ({ ...p, unitPrice: e.target.value }))} type="number" disabled={loading} required />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Upload New Document <span className="text-gray-500">(Optional)</span></label>
            <input type="file" className="border border-gray-300 rounded p-2 w-full" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])} disabled={loading} />
          </div>
          <CustomTextField label="Notes" placeholder="Enter notes" multiline rows={3} value={formData.notes}
            onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} disabled={loading} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={handleClose} className="bg-[#dddddd] px-6 py-3 rounded-xl text-lg font-medium" disabled={loading}>Cancel</button>
          <Button buttonText={loading ? 'Saving...' : 'Save Changes'} onClick={handleSubmit} disabled={loading || !formData.unitPrice} />
        </div>
      </Box>
    </Modal>
  );
};

// â”€â”€â”€ View Price Details Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ViewPriceDetailsModal = ({ open, onClose, poData, onEdit }) => {
  if (!poData) return null;
  const isWithin24h = poData.amountAddedAt && (new Date() - new Date(poData.amountAddedAt)) / (1000 * 60 * 60) <= 24;
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} className="bg-white p-5">
        <h1 className="text-2xl font-semibold mb-4">PO Price Details</h1>
        <div className="flex flex-col gap-3 text-sm text-gray-700">
          <div><span className="font-medium">Reference:</span> {poData.referenceNumber || '-'}</div>
          <div><span className="font-medium">Unit Price:</span> PKR {poData.unitPrice ? parseFloat(poData.unitPrice).toLocaleString() : '-'}</div>
          <div><span className="font-medium">Total Amount:</span> PKR {poData.totalAmount ? parseFloat(poData.totalAmount).toLocaleString() : '-'}</div>
          <div><span className="font-medium">Notes:</span> {poData.notes || '-'}</div>
          {poData.proofOfBill && (
            <div><a href={poData.proofOfBill} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Document</a></div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          {isWithin24h && <Button buttonText="Edit" onClick={onEdit} />}
          <button onClick={onClose} className="bg-[#dddddd] px-6 py-3 rounded-xl text-lg font-medium">Close</button>
        </div>
      </Box>
    </Modal>
  );
};

// â”€â”€â”€ Add Payment Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TransactionModal = ({ open, onClose, vendorId, defaultVendorName, defaultProjectId, onSuccess }) => {
  const [formData, setFormData] = useState({ amount: '', note: '', vendorName: defaultVendorName || '', projectId: defaultProjectId || '', sectionId: '', file: null });
  const [modalLoading, setModalLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);

  useEffect(() => {
    if (open) setFormData(p => ({ ...p, vendorName: defaultVendorName || '', projectId: defaultProjectId || '' }));
  }, [open, defaultVendorName, defaultProjectId]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const [projRes, secRes] = await Promise.all([apiClient.get('/projects'), apiClient.get('/sections')]);
      if (projRes.ok) setProjects(projRes.data.projects || []);
      if (secRes.ok) setAllSections(secRes.data.sections || []);
    })();
  }, [open]);

  useEffect(() => {
    setFilteredSections(formData.projectId ? allSections.filter(s => s.projectId === formData.projectId) : []);
    setFormData(p => ({ ...p, sectionId: '' }));
  }, [formData.projectId, allSections]);

  const handleClose = () => {
    setFormData({ amount: '', note: '', vendorName: defaultVendorName || '', projectId: defaultProjectId || '', sectionId: '', file: null });
    onClose();
  };

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
      const response = await apiClient.post(`/vendor-account/vendors/${vendorId}/payments`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.ok) { toast.success('Payment added successfully!'); handleClose(); if (onSuccess) onSuccess(); }
      else toast.error(response.data?.message || 'Failed to add payment');
    } catch (error) {
      toast.error('Error adding payment');
    } finally { setModalLoading(false); }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="bg-white p-5 overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <h1 className="text-3xl font-semibold mb-4">Add Payment</h1>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomTextField label="Amount *" placeholder="Amount" value={formData.amount}
              onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))} disabled={modalLoading} type="number" />
            <CustomTextField label="Vendor Name *" placeholder="Enter vendor name" value={formData.vendorName}
              onChange={(e) => setFormData(p => ({ ...p, vendorName: e.target.value }))} disabled={modalLoading || !!defaultVendorName} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Project Name *</label>
              <select className="border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                value={formData.projectId} onChange={(e) => setFormData(p => ({ ...p, projectId: e.target.value }))} disabled={modalLoading || !!defaultProjectId}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Section Name *</label>
              <select className="border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                value={formData.sectionId} onChange={(e) => setFormData(p => ({ ...p, sectionId: e.target.value }))} disabled={modalLoading || !formData.projectId}>
                <option value="">{formData.projectId ? 'Select Section' : 'Select a project first'}</option>
                {filteredSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <CustomTextField label="Note *" placeholder="Note" value={formData.note}
            onChange={(e) => setFormData(p => ({ ...p, note: e.target.value }))} disabled={modalLoading} />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Upload Proof of Payment</label>
            <input type="file" className="border border-gray-300 rounded p-2 w-full"
              onChange={(e) => setFormData(p => ({ ...p, file: e.target.files[0] }))} disabled={modalLoading} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="bg-[#dddddd] px-6 py-2 rounded-xl text-lg font-medium" onClick={handleClose} disabled={modalLoading}>Cancel</button>
          <Button buttonText={modalLoading ? 'Submitting...' : 'Add Payment'} onClick={handleSubmit}
            disabled={modalLoading || !formData.amount || !formData.note || !formData.vendorName || !formData.projectId || !formData.sectionId} />
        </div>
      </Box>
    </Modal>
  );
};

// â”€â”€â”€ STATUS CHIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const statusColorMap = {
  APPROVED: '#22c55e', REJECTED: '#ef4444', PENDING: '#f59e42',
  PARTIALLY_APPROVED: '#eab308', PO_CREATED: '#8b5cf6', FULFILLED: '#0ea5e9',
  COMPLETED: '#22c55e', PARTIAL: '#eab308', ORDER_PLACED: '#f59e42',
  IN_TRANSIT: '#0ea5e9', IN_STORE: '#8b5cf6', CANCELLED: '#ef4444', default: '#0252AD',
};
const StatusChip = ({ value }) => {
  const status = (value || 'PENDING').toUpperCase();
  return <Chip label={status.replace(/_/g, ' ')} size="small"
    sx={{ bgcolor: statusColorMap[status] || statusColorMap.default, color: '#fff', fontWeight: 600, letterSpacing: 0.5 }} />;
};

const statusOptions = [
  { label: 'Order Placed', value: 'ORDER_PLACED' }, { label: 'Created', value: 'CREATED' },
  { label: 'Confirmed', value: 'CONFIRMED' }, { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'In Store', value: 'IN_STORE' }, { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' }, { label: 'Approved', value: 'APPROVED' },
  { label: 'PO Created', value: 'PO_CREATED' },
];

// â”€â”€â”€ MAIN COMPONENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Payables = () => {
  const [loading, setLoading] = useState(false);
  const [drillLoading, setDrillLoading] = useState(false);

  // PO data (used in drill-down Level 3 PO table & project-tab PO table)
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrdersWithAmount, setPurchaseOrdersWithAmount] = useState([]);

  // Drill-down state
  const [drillLevel, setDrillLevel] = useState('projects'); // 'projects' | 'vendors' | 'payments'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [projectSummaries, setProjectSummaries] = useState([]);
  const [vendorSummaries, setVendorSummaries] = useState([]);
  const [scopedSummary, setScopedSummary] = useState({});
  const [vendorTransactions, setVendorTransactions] = useState([]);
  const [payablesSummary, setPayablesSummary] = useState({ totalCredited: 0, totalDebited: 0, totalBalance: 0 });
  const [projects, setProjects] = useState([]);

  // Project-tab PO filter state
  const [poProjectTab, setPoProjectTab] = useState('all');
  const [poStatusFilter, setPoStatusFilter] = useState('');

  // Modal state
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPOForDetails, setSelectedPOForDetails] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPOForEdit, setSelectedPOForEdit] = useState(null);

  const formatAmount = (n) => (n || 0).toLocaleString('en-US');
  const getBalanceColor = (b) => (b || 0) < 0 ? '#22c55e' : '#ef4444';

  // â”€â”€ FETCH: all POs (no amount) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchNewPurchaseOrders = async () => {
    try {
      const res = await apiClient.get('/purchase-orders?hasAmount=false');
      if (res.ok) {
        setPurchaseOrders(res.data.data.map((po, i) => ({
          id: po.id, no: i + 1,
          poReference: po.referenceNumber || po.id || '-',
          project: po.demand?.section?.project?.name || '-',
          material: po.material?.name || '-',
          vendor: po.vendor?.name || '-',
          section: po.demand?.section?.name || po.section?.name || '-',
          quantity: po.quantity || '-',
          unit: po.demand?.unit || '-',
          unitPrice: po.unitPrice ? parseFloat(po.unitPrice).toLocaleString('en-US') : '-',
          amount: po.totalAmount ? parseFloat(po.totalAmount).toLocaleString('en-US') : '-',
          status: po.status || '-',
          hasAmount: false,
          poData: po,
        })));
      }
    } catch (e) { console.error(e); }
  };

  // â”€â”€ FETCH: all POs (with amount) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchPurchaseOrdersWithAmount = async () => {
    try {
      const res = await apiClient.get('/purchase-orders?hasAmount=true');
      if (res.ok) {
        setPurchaseOrdersWithAmount(res.data.data.map((po, i) => ({
          id: po.id, no: i + 1,
          poReference: po.referenceNumber || po.id || '-',
          project: po.demand?.section?.project?.name || '-',
          material: po.material?.name || '-',
          vendor: po.vendor?.name || '-',
          section: po.demand?.section?.name || po.section?.name || '-',
          quantity: po.quantity || '-',
          unit: po.demand?.unit || '-',
          unitPrice: po.unitPrice ? parseFloat(po.unitPrice).toLocaleString('en-US') : '-',
          amount: po.totalAmount ? parseFloat(po.totalAmount).toLocaleString('en-US') : '-',
          status: po.status || '-',
          hasAmount: true,
          proofOfBill: po.proofOfBill || null,
          poData: po,
        })));
      }
    } catch (e) { console.error(e); }
  };

  // â”€â”€ FETCH: Level 1 â€” project summaries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchProjectSummaries = async () => {
    try {
      setDrillLoading(true);
      const projRes = await apiClient.get('/projects');
      if (!projRes.ok) return;
      const allProjects = projRes.data.projects || [];
      setProjects(allProjects);

      const results = await Promise.all(
        allProjects.map(async (proj, idx) => {
          try {
            const res = await apiClient.get(`/vendor-account/vendors?projectId=${proj.id}`);
            const summary = res.ok ? (res.data.summary || {}) : {};
            return {
              projectId: proj.id, projectName: proj.name,
              totalPayable: summary.totalCredited || 0,
              totalPaid: summary.totalDebited || 0,
              balance: summary.totalBalance || 0,
              color: PROJECT_COLORS[idx % PROJECT_COLORS.length],
            };
          } catch {
            return { projectId: proj.id, projectName: proj.name, totalPayable: 0, totalPaid: 0, balance: 0, color: PROJECT_COLORS[idx % PROJECT_COLORS.length] };
          }
        })
      );
      setProjectSummaries(results.filter(r => r.totalPayable > 0 || r.totalPaid > 0));

      const combined = results.reduce((acc, r) => ({
        totalCredited: acc.totalCredited + r.totalPayable,
        totalDebited: acc.totalDebited + r.totalPaid,
        totalBalance: acc.totalBalance + r.balance,
      }), { totalCredited: 0, totalDebited: 0, totalBalance: 0 });
      setPayablesSummary(combined);
    } catch (e) {
      toast.error('Error fetching project data');
    } finally { setDrillLoading(false); }
  };

  // â”€â”€ Level 1 â†’ 2: project click â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleProjectClick = async (project) => {
    try {
      setDrillLoading(true);
      const res = await apiClient.get(`/vendor-account/vendors?projectId=${project.projectId}`);
      if (res.ok) {
        setVendorSummaries((res.data.data || []).map(v => ({
          vendorId: v.vendorId,
          vendorName: v.vendor?.name || '-',
          totalPayable: v.totalCredited || 0,
          totalPaid: v.paidAmount || 0,
          balance: v.remainingAmount || 0,
        })));
        setScopedSummary(res.data.summary || {});
      }
      setSelectedProject(project);
      setDrillLevel('vendors');
    } catch (e) {
      toast.error('Error loading vendors for this project');
    } finally { setDrillLoading(false); }
  };

  // â”€â”€ Level 2 â†’ 3: vendor click â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleVendorClick = async (vendor) => {
    try {
      setDrillLoading(true);
      const projectParam = selectedProject?.projectId ? `?projectId=${selectedProject.projectId}` : '';
      const res = await apiClient.get(`/vendor-account/vendors/${vendor.vendorId}/statement${projectParam}`);
      if (res.ok) setVendorTransactions(res.data.data?.transactions || []);
      setScopedSummary({ totalCredited: vendor.totalPayable, totalDebited: vendor.totalPaid, totalBalance: vendor.balance });
      setSelectedVendor(vendor);
      setDrillLevel('payments');
    } catch (e) {
      toast.error('Error loading payment details');
    } finally { setDrillLoading(false); }
  };

  // â”€â”€ Breadcrumb navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const goToProjects = () => { setDrillLevel('projects'); setSelectedProject(null); setSelectedVendor(null); setVendorSummaries([]); setVendorTransactions([]); };
  const goToVendors = () => { setSelectedVendor(null); setVendorTransactions([]); setDrillLevel('vendors'); };

  // â”€â”€ Refresh Level 3 after payment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const refreshVendorData = async () => {
    if (!selectedProject || !selectedVendor) return;
    try {
      setDrillLoading(true);
      const [vendorRes, statementRes] = await Promise.all([
        apiClient.get(`/vendor-account/vendors?projectId=${selectedProject.projectId}`),
        apiClient.get(`/vendor-account/vendors/${selectedVendor.vendorId}/statement?projectId=${selectedProject.projectId}`),
      ]);
      if (vendorRes.ok) {
        const updatedVendors = (vendorRes.data.data || []).map(v => ({
          vendorId: v.vendorId, vendorName: v.vendor?.name || '-',
          totalPayable: v.totalCredited || 0, totalPaid: v.paidAmount || 0, balance: v.remainingAmount || 0,
        }));
        setVendorSummaries(updatedVendors);
        const fresh = updatedVendors.find(v => v.vendorId === selectedVendor.vendorId);
        if (fresh) {
          setSelectedVendor(fresh);
          setScopedSummary({ totalCredited: fresh.totalPayable, totalDebited: fresh.totalPaid, totalBalance: fresh.balance });
        }
        setProjectSummaries(prev => {
          const next = prev.map(ps =>
            ps.projectId === selectedProject.projectId
              ? { ...ps, totalPaid: vendorRes.data.summary?.totalDebited ?? ps.totalPaid, balance: vendorRes.data.summary?.totalBalance ?? ps.balance }
              : ps
          );
          setPayablesSummary(next.reduce((acc, r) => ({
            totalCredited: acc.totalCredited + r.totalPayable,
            totalDebited: acc.totalDebited + r.totalPaid,
            totalBalance: acc.totalBalance + r.balance,
          }), { totalCredited: 0, totalDebited: 0, totalBalance: 0 }));
          return next;
        });
      }
      if (statementRes.ok) setVendorTransactions(statementRes.data.data?.transactions || []);
    } catch (e) { console.error(e); }
    finally { setDrillLoading(false); }
  };

  // â”€â”€ Level 3: POs for this vendor/project â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const getVendorProjectPOs = () => {
    if (!selectedVendor || !selectedProject) return [];
    return [...purchaseOrders, ...purchaseOrdersWithAmount].filter(
      po => po.vendor === selectedVendor.vendorName && po.project === selectedProject.projectName
    );
  };

  const getVendorProjectPayments = () =>
    vendorTransactions.filter(t => t.type === 'DEBIT' && t.vendorPaymentId);

  // â”€â”€ PO action cell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const POActionCell = ({ po }) => {
    const [addPriceOpen, setAddPriceOpen] = useState(false);
    const handleSuccess = () => { fetchNewPurchaseOrders(); fetchPurchaseOrdersWithAmount(); };
    if (!po.hasAmount) {
      return (
        <>
          <DropdownButton items={[{ label: 'Add Price', onClick: () => setAddPriceOpen(true) }]}>
            <IconButton><BsThreeDotsVertical /></IconButton>
          </DropdownButton>
          <AddPriceModal open={addPriceOpen} onClose={() => setAddPriceOpen(false)} poId={po.id} onSuccess={handleSuccess} />
        </>
      );
    }
    const isWithin24h = po.poData?.amountAddedAt && (new Date() - new Date(po.poData.amountAddedAt)) / (1000 * 60 * 60) <= 24;
    const items = [{ label: 'View Details', onClick: () => { setSelectedPOForDetails(po.poData); setDetailsModalOpen(true); } }];
    if (isWithin24h) items.push({ label: 'Edit', onClick: () => { setSelectedPOForEdit(po.poData); setEditModalOpen(true); } });
    return <DropdownButton items={items}><IconButton><BsThreeDotsVertical /></IconButton></DropdownButton>;
  };

  // â”€â”€ PO table row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderPORow = (po, idx) => (
    <tr key={po.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-500">{po.no || idx + 1}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{po.poReference || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{po.project || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{po.material || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{po.vendor || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{po.section || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700 text-center">{po.quantity || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{po.unit || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{po.unitPrice && po.unitPrice !== '-' ? `PKR ${po.unitPrice}` : '-'}</td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{po.amount && po.amount !== '-' ? `PKR ${po.amount}` : '-'}</td>
      <td className="px-4 py-3"><StatusChip value={po.status} /></td>
      <td className="px-4 py-3"><POActionCell po={po} /></td>
    </tr>
  );

  // â”€â”€ Project-tab PO section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderPOSection = () => {
    const seen = new Set();
    const allPOs = [...purchaseOrders, ...purchaseOrdersWithAmount].filter(po => {
      if (seen.has(po.id)) return false;
      seen.add(po.id); return true;
    });
    const projectObj = projects.find(p => p.id === poProjectTab);
    const tabFiltered = allPOs
      .filter(po => poProjectTab === 'all' || po.project === projectObj?.name)
      .filter(po => !poStatusFilter || po.status === poStatusFilter)
      .map((po, idx) => ({ ...po, no: idx + 1 }));

    const vendorGroups = poProjectTab !== 'all'
      ? tabFiltered.reduce((acc, po) => { const k = po.vendor || '-'; if (!acc[k]) acc[k] = []; acc[k].push(po); return acc; }, {})
      : null;

    const colHeaders = ['No.', 'PO Reference', 'Project', 'Material', 'Vendor', 'Section', 'Qty', 'Unit', 'Unit Price', 'Amount (PKR)', 'Status', 'Action'];

    return (
      <div className="mt-10">
        <h1 className="text-xl md:text-2xl font-bold mb-5">Purchase Orders</h1>
        <div className="flex flex-wrap items-start gap-3 mb-5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
            {[{ id: 'all', name: 'All' }, ...projects].map(proj => (
              <button key={proj.id} onClick={() => setPoProjectTab(proj.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-colors flex-shrink-0 ${
                  poProjectTab === proj.id ? 'bg-[#0252AD] text-white border-[#0252AD] shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:border-[#0252AD] hover:text-[#0252AD]'
                }`}>{proj.name}</button>
            ))}
          </div>
          <select value={poStatusFilter} onChange={e => setPoStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#0252AD] flex-shrink-0">
            <option value="">All Statuses</option>
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        {loading ? <div className="flex justify-center py-10"><Loader /></div> : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {colHeaders.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tabFiltered.length === 0 ? (
                  <tr><td colSpan={colHeaders.length} className="text-center py-12 text-gray-400 text-sm">No purchase orders found.</td></tr>
                ) : vendorGroups ? (
                  Object.entries(vendorGroups).map(([vendorName, vPOs]) => {
                    const total = vPOs.reduce((s, po) => { const n = parseFloat((po.amount || '0').replace(/,/g, '')); return s + (isNaN(n) ? 0 : n); }, 0);
                    return (
                      <React.Fragment key={vendorName}>
                        <tr className="bg-gray-100 border-b">
                          <td colSpan={colHeaders.length} className="px-4 py-2.5">
                            <span className="font-bold text-gray-700 text-sm">Vendor: {vendorName}</span>
                            {total > 0 && <span className="ml-3 text-gray-500 text-sm">â€” Total: PKR {total.toLocaleString('en-US')}</span>}
                          </td>
                        </tr>
                        {vPOs.map((po, idx) => renderPORow(po, idx))}
                      </React.Fragment>
                    );
                  })
                ) : tabFiltered.map((po, idx) => renderPORow(po, idx))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // â”€â”€ Level 1: Project cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderLevel1 = () => (
    <div className="mt-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Projects</h2>
      {drillLoading ? <div className="flex justify-center py-16"><Loader /></div>
        : projectSummaries.length === 0 ? <div className="text-center text-gray-400 py-16 text-lg">No project payables data found.</div>
        : (
          <div className="flex flex-col gap-3">
            {projectSummaries.map(project => (
              <button key={project.projectId} onClick={() => handleProjectClick(project)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 flex items-center justify-between p-5 text-left w-full group"
                style={{ borderLeft: `5px solid ${project.color}` }}>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-[#0252AD] transition-colors">{project.projectName}</h3>
                  <div className="flex flex-wrap gap-8 mt-3">
                    <div><p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Payable Amount</p><p className="text-base font-semibold text-red-500">PKR {formatAmount(project.totalPayable)}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Paid Amount</p><p className="text-base font-semibold text-green-600">PKR {formatAmount(project.totalPaid)}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Balance Remaining</p><p className="text-base font-semibold text-blue-600">PKR {formatAmount(project.balance)}</p></div>
                  </div>
                </div>
                <FiChevronRight className="text-gray-300 group-hover:text-[#0252AD] text-2xl ml-5 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        )}
    </div>
  );

  // â”€â”€ Level 2: Vendor cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderLevel2 = () => (
    <div className="mt-4">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2 flex-wrap">
        <button onClick={goToProjects} className="hover:text-orange-500 font-medium">Payables</button>
        <FiChevronRight className="text-gray-400 flex-shrink-0" />
        <span className="text-gray-800 font-semibold">{selectedProject?.projectName}</span>
      </nav>
      <button onClick={goToProjects} className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-semibold mb-6 mt-0.5">
        <FiChevronLeft /> Back to Projects
      </button>
      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Total Payables', count: formatAmount(scopedSummary.totalCredited), color: '#ef4444', icon: IoPeopleSharp },
          { label: 'Total Paid', count: formatAmount(scopedSummary.totalDebited), color: '#22c55e', icon: AccountBalance },
          { label: 'Balance Remaining', count: formatAmount(scopedSummary.totalBalance), color: getBalanceColor(scopedSummary.totalBalance), icon: Balance },
        ].map((card, i) => (
          <div key={i} className={i < 2 ? 'relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 sm:last:after:hidden' : ''}>
            <AnalyticsCard label={card.label} icon={card.icon} count={card.count} countColor={card.color} />
          </div>
        ))}
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Vendors</h2>
      {drillLoading ? <div className="flex justify-center py-16"><Loader /></div>
        : vendorSummaries.length === 0 ? <div className="text-center text-gray-400 py-16 text-lg">No vendors found for this project.</div>
        : (
          <div className="flex flex-col gap-3">
            {vendorSummaries.map(vendor => (
              <button key={vendor.vendorId} onClick={() => handleVendorClick(vendor)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 flex items-center justify-between p-5 text-left w-full group"
                style={{ borderLeft: `5px solid ${selectedProject?.color || '#0252AD'}` }}>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-[#0252AD] transition-colors">{vendor.vendorName}</h3>
                  <div className="flex flex-wrap gap-8 mt-3">
                    <div><p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total PO Amount</p><p className="text-base font-semibold text-red-500">PKR {formatAmount(vendor.totalPayable)}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total Paid</p><p className="text-base font-semibold text-green-600">PKR {formatAmount(vendor.totalPaid)}</p></div>
                    <div><p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Balance</p><p className="text-base font-semibold text-blue-600">PKR {formatAmount(vendor.balance)}</p></div>
                  </div>
                </div>
                <FiChevronRight className="text-gray-300 group-hover:text-[#0252AD] text-2xl ml-5 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        )}
    </div>
  );

  // â”€â”€ Level 3: Payment detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderLevel3 = () => {
    const vendorPOs = getVendorProjectPOs();
    const payments = getVendorProjectPayments();
    return (
      <div className="mt-4">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2 flex-wrap">
          <button onClick={goToProjects} className="hover:text-orange-500 font-medium">Payables</button>
          <FiChevronRight className="text-gray-400 flex-shrink-0" />
          <button onClick={goToVendors} className="hover:text-orange-500 font-medium">{selectedProject?.projectName}</button>
          <FiChevronRight className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-800 font-semibold">{selectedVendor?.vendorName}</span>
        </nav>
        <div className="flex items-center justify-between mt-0.5 mb-6">
          <button onClick={goToVendors} className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-semibold">
            <FiChevronLeft /> Back to Vendors
          </button>
          <button onClick={() => setAddPaymentOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm">
            + Add Payment
          </button>
        </div>
        {drillLoading ? <div className="flex justify-center py-16"><Loader /></div> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-600 rounded-xl p-5 text-white shadow-md"><p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Credit (Total Payable)</p><p className="text-2xl font-bold mt-2">PKR {formatAmount(scopedSummary.totalCredited)}</p></div>
              <div className="bg-red-500 rounded-xl p-5 text-white shadow-md"><p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Debit (Total Paid)</p><p className="text-2xl font-bold mt-2">PKR {formatAmount(scopedSummary.totalDebited)}</p></div>
              <div className="bg-green-600 rounded-xl p-5 text-white shadow-md"><p className="text-xs uppercase tracking-wider opacity-80 font-semibold">Balance</p><p className="text-2xl font-bold mt-2">PKR {formatAmount(scopedSummary.totalBalance)}</p></div>
            </div>
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Orders</h2>
              {vendorPOs.length === 0
                ? <div className="text-gray-400 text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">No purchase orders found for this vendor in this project.</div>
                : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {['PO Reference', 'Material', 'Section', 'Qty', 'Unit', 'Unit Price', 'Amount (PKR)', 'Status', 'View Document'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {vendorPOs.map((po, idx) => (
                          <tr key={po.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{po.poReference || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{po.material || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{po.section || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-center">{po.quantity || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{po.unit || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{po.unitPrice ? `PKR ${po.unitPrice}` : '-'}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{po.amount ? `PKR ${po.amount}` : '-'}</td>
                            <td className="px-4 py-3"><StatusChip value={po.status} /></td>
                            <td className="px-4 py-3">
                              {po.proofOfBill
                                ? <button onClick={() => window.open(po.proofOfBill, '_blank')} className="text-orange-500 hover:text-orange-600 underline font-medium text-sm">View Document</button>
                                : <span className="text-gray-400 text-sm">-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payments Made</h2>
              {payments.length === 0
                ? <div className="text-gray-400 text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">No payments recorded yet for this vendor in this project.</div>
                : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {['Date', 'Amount (PKR)', 'Note', 'Proof'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((t, idx) => (
                          <tr key={t.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{t.createdAt ? formatDateDMY(t.createdAt) : '-'}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600 whitespace-nowrap">{t.amount ? `PKR ${parseFloat(t.amount).toLocaleString('en-US')}` : '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{t.note || '-'}</td>
                            <td className="px-4 py-3">
                              {t.proofOfPayment
                                ? <a href={t.proofOfPayment} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline text-sm font-medium">View Proof</a>
                                : <span className="text-gray-400 text-sm">-</span>}
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

  // â”€â”€ Effects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    fetchProjectSummaries();
    fetchNewPurchaseOrders();
    fetchPurchaseOrdersWithAmount();
  }, []);

  // â”€â”€ Top-level summary cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const payablesData = [
    { label: 'Total Payables', icon: IoPeopleSharp, count: formatAmount(payablesSummary.totalCredited), countColor: '#ef4444' },
    { label: 'Total Paid', icon: AccountBalance, count: formatAmount(payablesSummary.totalDebited), countColor: '#22c55e' },
    { label: 'Balance Remaining', icon: Balance, count: formatAmount(payablesSummary.totalBalance), countColor: getBalanceColor(payablesSummary.totalBalance) },
  ];

  return (
    <div>
      <TopBar title="Payables" />

      {/* Global summary cards */}
      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {payablesData.map((item, index) => (
          <div key={index} className="relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-gray-300 last:after:hidden">
            <AnalyticsCard label={item.label} icon={item.icon} count={item.count} countColor={item.countColor} />
          </div>
        ))}
      </div>

      {/* 3-level drill-down (same as Head Accountant) */}
      {drillLevel === 'projects' && renderLevel1()}
      {drillLevel === 'projects' && renderPOSection()}
      {drillLevel === 'vendors' && renderLevel2()}
      {drillLevel === 'payments' && renderLevel3()}

      {/* Price Details Modal */}
      <ViewPriceDetailsModal
        open={detailsModalOpen}
        onClose={() => { setDetailsModalOpen(false); setSelectedPOForDetails(null); }}
        poData={selectedPOForDetails}
        onEdit={() => { if (selectedPOForDetails) { setSelectedPOForEdit(selectedPOForDetails); setEditModalOpen(true); setDetailsModalOpen(false); } }}
      />

      {/* Edit Price Modal */}
      <EditPriceModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedPOForEdit(null); }}
        poId={selectedPOForEdit?.id}
        poData={selectedPOForEdit}
        onSuccess={() => { fetchPurchaseOrdersWithAmount(); setEditModalOpen(false); setSelectedPOForEdit(null); }}
      />

      {/* Add Payment Modal */}
      {selectedVendor && (
        <TransactionModal
          open={addPaymentOpen}
          onClose={() => setAddPaymentOpen(false)}
          vendorId={selectedVendor.vendorId}
          defaultVendorName={selectedVendor.vendorName}
          defaultProjectId={selectedProject?.projectId}
          onSuccess={() => { setAddPaymentOpen(false); refreshVendorData(); }}
        />
      )}
    </div>
  );
};

export default Payables;
