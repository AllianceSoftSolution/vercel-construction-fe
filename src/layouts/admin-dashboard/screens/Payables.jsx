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
import GroupedProjectSectionBarChart from "../../../charts/GroupedProjectSectionBarChart";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { FaEye } from "react-icons/fa";

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

const CustomActionComponent = ({ value: id }) => {
  const navigate = useNavigate();

  const onNavigation = () => {
    navigate(`/admin-dashboard/payables/details/${id}`);
  };

  return (
    <DropdownButton
      items={[{ label: "Details", onClick: onNavigation, icon: <FaEye /> }]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );
};

const Payables = () => {
  const [loading, setLoading] = useState(false);
  const [vendorAccounts, setVendorAccounts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [payablesSummary, setPayablesSummary] = useState({
    totalVendors: 0,
    totalCredited: 0,
    totalDebited: 0,
    totalBalance: 0,
    vendorsWithOverdue: 0,
    vendorsWithAdvance: 0,
  });
  const [filter, setFilter] = useState({
    Status: [],
    Project: [],
  });
  const [paymentsByProjectSection, setPaymentsByProjectSection] = useState([]);
  const [globalProjectFilter, setGlobalProjectFilter] = useState([]);

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

  const filters = [
    { label: "Status", options: statusOptions.map((o) => o.label) },
    { label: "Project", options: projectOptions.map((o) => o.label) },
  ];

  // Global project filter options
  const globalProjectFilters = [
    { label: "Project", options: projectOptions.map((o) => o.label) },
  ];

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Status: [], Project: [] });

  const handleGlobalProjectFilterChange = (newSelected) => {
    setGlobalProjectFilter(newSelected);
    
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
    
    // Fetch chart data with project filter
    fetchPaymentsByProjectSection(selectedProjectId);
  };

  const handleGlobalProjectFilterClear = () => {
    setGlobalProjectFilter([]);
    // Fetch all vendor accounts when filter is cleared
    fetchVendorAccount();
    // Fetch all chart data when filter is cleared
    fetchPaymentsByProjectSection();
  };

  // Filter purchase orders by status, project, and global project filter
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

    // Global project filter
    const globalProjectMatch =
      !globalProjectFilter.Project ||
      globalProjectFilter.Project.length === 0 ||
      globalProjectFilter.Project.includes(po.project);

    return statusMatch && projectMatch && globalProjectMatch;
  });

  // Filter vendor accounts by global project filter
  // Note: This filtering is now handled at the API level, so we just return all vendor accounts
  // The API will return only the vendors for the selected project
  const filteredVendorAccounts = vendorAccounts;

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
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Amount (PKR)", field: "amount" },
    { headerName: "Status", field: "status" },
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
            totalBalance: account.totalCredited
              ? `${account.totalCredited.toLocaleString()}`
              : "-",
            remainingBalance: account.remainingAmount
              ? `${account.remainingAmount.toLocaleString()}`
              : "-",
            paidAmount: account.paidAmount
              ? `${account.paidAmount.toLocaleString()}`
              : "-",
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
            quantity: po.quantity || "-",
            unit: po.demand?.unit || "-",
            amount: po.totalAmount ? `${po.totalAmount.toLocaleString()}` : "-",
            status: po.status || "-",
            // Complete PO data for modal
            poData: po, // Store complete PO data separately
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

  // Fetch payments by project/section for grouped bar chart
  const fetchPaymentsByProjectSection = async (projectId = null) => {
    try {
      let url = "/analytics/payments-by-project-section";
      if (projectId) {
        url += `?projectId=${projectId}`;
      }
      
      const response = await apiClient.get(url);
      if (response.ok) {
        setPaymentsByProjectSection(response.data.data || []);
      } else {
        toast.error("Failed to fetch payments by project/section");
      }
    } catch (error) {
      toast.error("Error fetching payments by project/section");
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
    {
      label: "Balance Remaining",
      icon: Balance,
      count: formatAmount(payablesSummary.totalBalance),
      countColor: getBalanceRemainingColor(payablesSummary.totalBalance),
    },
  ];

  useEffect(() => {
    fetchVendorAccount();
  }, []);

  useEffect(() => {
    fetchNewPurchaseOrders();
  }, []);

  useEffect(() => {
    fetchPaymentsByProjectSection();
  }, []);

  // ActionComforRegPOs component with access to fetchNewPurchaseOrders
  const ActionComforRegPOs = ({ value: id }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSuccess = () => {
      // Refresh the purchase orders list
      fetchNewPurchaseOrders();
    };

    return (
      <>
        <DropdownButton
          items={[{ label: "Add Price", onClick: () => setOpen(true) }]}
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
        sx={{
          bgcolor: color,
          color: "#fff",
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      />
    );
  };

  // Color-coded amount component for vendor accounts
  const ColorCodedAmount = ({ value, field }) => {
    if (!value || value === "-") return <span>{value}</span>;

    // Remove commas and convert to number
    const numericValue = parseFloat(value.replace(/,/g, ""));

    if (isNaN(numericValue)) return <span>{value}</span>;

    const color = numericValue >= 0 ? "#ef4444" : "#22c55e"; // red for positive, green for negative
    const fontWeight = "font-semibold";

    return (
      <span style={{ color, fontWeight }} className={fontWeight}>
        {value}
      </span>
    );
  };

  return (
    <div className=" ">
      <div className="flex justify-between items-center">
        <TopBar
          title="Payables"
          // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          // showFilter={true}
          // filterOptions={["Assigned", "Not-Assigned"]}
          // onFilterChange={(selected) =>
          //   console.log("Selected Filters:", selected)
          // }
        />
        <div className="flex items-center gap-4">
          <CustomFilterDropdown
            filters={globalProjectFilters}
            selected={globalProjectFilter}
            onChange={handleGlobalProjectFilterChange}
            onClear={handleGlobalProjectFilterClear}
            placeholder="Filter by project"
            dropdownAlign="right"
          />
        </div>
      </div>
  {/* Payments by Project & Section Chart */}
  <div className="mt-10">
        <GroupedProjectSectionBarChart apiData={paymentsByProjectSection} />
      </div>
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
        <h1 className="text-xl md:text-2xl font-bold mb-5">Purchase Orders</h1>
        <div className="my-4 flex justify-end">
          <CustomFilterDropdown
            filters={filters}
            selected={filter}
            onChange={handleFilterChange}
            onClear={handleFilterClear}
            placeholder="Filter by status or project"
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
                status: StatusChip,
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
    </div>
  );
};

export default Payables;
