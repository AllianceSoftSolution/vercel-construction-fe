import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import DropdownButton from "../../../comments/components/DropdownButton";
import { IconButton, Chip } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosEye } from "react-icons/io";
import { RiFileEditFill } from "react-icons/ri";
import ChangeVendor from "./users/modals/ChangeVendor";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";
import { formatStatusLabel } from "../../../utils/statusLabel";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import DeleteModal from "../../../mui/DeleteModal";
import { useReadOnly } from "../../../context/ReadOnlyContext";
import { buildExportFileName } from "../../../modules/tableExportHelpers";
// import { formatDate } from "../../../utils";

// Status color mapping for purchase order status
const statusColorMap = {
  COMPLETED: "#22c55e", // green
  PARTIAL: "#eab308", // yellow
  PENDING: "#f59e42", // orange
  REJECTED: "#ef4444", // red
  CONFIRMED: "#44085c", // purple 
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

// Date and time formatting functions
const formatDateOnly = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d)) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatTimeOnly = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return "";
  return d.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return `${formatDateOnly(dateString)}, ${formatTimeOnly(dateString)}`;
};

// Date component for table
const DateComponent = ({ value }) => {
  if (!value || value === "-") return <span>-</span>;
  return (
    <div style={{ minWidth: '140px' }}>
      <div className="text-gray-700 font-medium">{formatDateOnly(value)}</div>
      <div style={{ color: '#6B7280', fontSize: '12px' }}>{formatTimeOnly(value)}</div>
    </div>
  );
};
const PurchaseOrder = () => {
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const {id} = useParams();
  const isReadOnly = useReadOnly();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [filter, setFilter] = useState({ Status: [], Project: [], Section: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPOId, setSelectedPOId] = useState(null);
  const [activeProjectTab, setActiveProjectTab] = useState("All Projects");
  const navigate = useNavigate();

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

  // Fetch POs with filters
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      let query = [];
      if (filter.Status && filter.Status.length > 0) {
        // Map frontend labels to backend values
        const statusBackend = filter.Status.map(
          label => statusOptions.find(o => o.label === label)?.value
        ).filter(Boolean);
        if (statusBackend.length > 0) {
          query.push(`status=${encodeURIComponent(statusBackend.join(","))}`);
        }
      }
      if (filter.Project && filter.Project.length > 0) {
        const projectBackend = filter.Project.map(
          label => projectOptions.find(o => o.label === label)?.value
        ).filter(Boolean);
        if (projectBackend.length > 0) {
          query.push(`projectId=${encodeURIComponent(projectBackend.join(","))}`);
        }
      }
      const url = `/purchase-orders${query.length ? `?${query.join("&")}` : ""}`;
      const response = await apiClient.get(url);
      if (response.ok) {
        const data = response.data.data.map((po, index) => ({
          id: po.id,
          demandId: po.demand?.referenceNumber || "-",
          project: po.demand?.section?.project?.name || "-",
          demandName: po.demand?.referenceNumber || "-",
          material: po.material?.name || "-",
          vendorName: po.vendor?.name || po.vendorName || "-",
          section: po.demand?.section?.name || "-",
          qty: po.demand?.quantity != null ? po.demand.quantity : "-",
          unit: po.demand?.unit || "-",
          poQty: po.quantity != null ? po.quantity : "-",
          unitPrice: po.unitPrice ? `${po.unitPrice}` : "-",
          amount: po.totalAmount ? `${po.totalAmount}` : "-",
          createdAt: po.createdAt || "-",
          status: formatStatusLabel(po.status),
          assingedVendors: po.vendorId || "-",
          proofOfBill: po.proofOfBill || "-",
        }));
        const uniqueSections = [...new Set(data.map(po => po.section).filter(section => section && section !== "-"))];
        setSections(uniqueSections);

        let filteredData = data;
        if (filter.Section && filter.Section.length > 0) {
          filteredData = filteredData.filter(po =>
            filter.Section.includes(po.section)
          );
        }

        setPurchaseOrders(filteredData);
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
    fetchPurchaseOrders();
    // eslint-disable-next-line
  }, [filter]);

  const deletePurchaseOrder = async () => {
    try {
      const response = await apiClient.delete(`/purchase-orders/${selectedPOId}`);
      if (response.ok) {
        fetchPurchaseOrders();
        setShowDeleteModal(false);
        toast.success("Purchase Order deleted successfully");
      } else {
        toast.error(response.data?.message || "Failed to delete purchase order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Filter options
  const statusOptions = [
    { label: "Order Placed", value: "ORDER_PLACED" },
    { label: "Created", value: "CREATED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "In Transit", value: "IN_TRANSIT" },
    { label: "Partially completed", value: "IN_STORE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  
  ];
  const projectOptions = projects.map((p) => ({ label: p.name, value: p.id }));

  // CustomFilterDropdown expects filters: [{label, options: [...]}, ...]
  const filters = [
    { label: "Status", options: statusOptions.map(o => o.label) },
    { label: "Project", options: projectOptions.map(o => o.label) },
    { label: "Section", options: sections },
  ];

  // Multi-select filter change handler
  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Status: [], Project: [], Section: [] });

  // Compute displayed POs based on active project tab
  const displayedPOs = activeProjectTab === "All Projects"
    ? purchaseOrders
    : purchaseOrders.filter(po => po.project === activeProjectTab);

  // Always group POs by section for the right panel
  const purchaseOrdersExportFileName = React.useMemo(
    () =>
      buildExportFileName("purchase-orders", {
        projectName: activeProjectTab,
      }),
    [activeProjectTab],
  );

  const groupedBySection = displayedPOs.reduce((groups, po) => {
    const sectionName = po.section || "Unknown Section";
    if (!groups[sectionName]) groups[sectionName] = [];
    groups[sectionName].push(po);
    return groups;
  }, {});

  // Count POs per project for the left panel cards
  const projectPOCounts = React.useMemo(() => {
    const counts = {};
    purchaseOrders.forEach(po => {
      const pName = po.project;
      if (pName && pName !== "-") counts[pName] = (counts[pName] || 0) + 1;
    });
    return counts;
  }, [purchaseOrders]);

  const columns = [
    { headerName: "Demand ID", field: "demandId" },
    { headerName: "Project Name", field: "project" },
    // { headerName: "Demand", field: "demandName" },
    { headerName: "Materials", field: "material" },
    { headerName: "Vendor Name", field: "vendorName" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Unit Price", field: "unitPrice" },
    { headerName: "Amount (PKR)", field: "amount" },
    { headerName: "Proof of Bill", field: "proofOfBill" },
    { headerName: "Date", field: "createdAt" },
    { headerName: "Status", field: "status" },
    // { headerName: "Assigned Vendors", field: "assingedVendors" },
    { headerName: "Action", field: "id" },
  ];

  const CustomActionComponent = ({ value : id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          ...(!isReadOnly ? [
            {
              label: "Delete",
              onClick: () => {
                setSelectedPOId(id);
                setShowDeleteModal(true);
              },
              icon: <FaTrash />,
            },
          ] : []),
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const ProofOfBillComponent = ({ value }) => {
    if (!value || value === "-") {
      return <span>-</span>;
    }
    
    // Check if the value is a valid URL
    const isValidUrl = (string) => {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    };

    if (isValidUrl(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-primary underline cursor-pointer"
        >
          View Proof
        </a>
      );
    }
    
    return <span>{value}</span>;
  };
  console.log(purchaseOrders);
  return (
    <div className="h-full ">
      <TopBar
        title="Purchase Orders"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="flex flex-row flex-wrap items-center justify-end gap-2 sm:gap-3 mt-2 mb-4">
        <CustomFilterDropdown
          filters={filters}
          selected={filter}
          onChange={handleFilterChange}
          onClear={handleFilterClear}
          placeholder="Filter by status, project or section"
          exportData={displayedPOs}
          exportColumns={columns}
          exportFileName={purchaseOrdersExportFileName}
        />
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4" style={{ minHeight: 0 }}>
        {/* LEFT PANEL — Project list */}
        <div className="w-[220px] flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Projects</h3>
          <div
            onClick={() => setActiveProjectTab("All Projects")}
            className={`rounded-lg px-4 py-3 mb-2 cursor-pointer border transition-all ${
              activeProjectTab === "All Projects"
                ? "border-l-4 border-l-[#F97316] border-[#F97316] bg-[#FFF7ED]"
                : "border-gray-200 bg-white hover:bg-[#FFF7ED] hover:border-[#F97316]"
            }`}
          >
            <span className={`block text-sm font-bold ${activeProjectTab === "All Projects" ? "text-[#F97316]" : "text-[#111827]"}`}>
              All Projects
            </span>
            <span className="block text-xs text-gray-400 mt-0.5">{purchaseOrders.length} PO{purchaseOrders.length !== 1 ? 's' : ''}</span>
          </div>
          {projectOptions.map((o) => (
            <div
              key={o.label}
              onClick={() => setActiveProjectTab(o.label)}
              className={`rounded-lg px-4 py-3 mb-2 cursor-pointer border transition-all ${
                activeProjectTab === o.label
                  ? "border-l-4 border-l-[#F97316] border-[#F97316] bg-[#FFF7ED]"
                  : "border-gray-200 bg-white hover:bg-[#FFF7ED] hover:border-[#F97316]"
              }`}
            >
              <span className={`block text-sm font-bold ${activeProjectTab === o.label ? "text-[#F97316]" : "text-[#111827]"}`}>
                {o.label}
              </span>
              <span className="block text-xs text-gray-400 mt-0.5">{projectPOCounts[o.label] || 0} PO{(projectPOCounts[o.label] || 0) !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL — Section-grouped POs */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          {loading ? (
            <Loader />
          ) : Object.keys(groupedBySection).length > 0 ? (
            Object.entries(groupedBySection).map(([sectionName, sectionPOs]) => (
              <div key={sectionName} className="mb-6">
                <div className="bg-[#F9FAFB] border-l-[3px] border-l-[#F97316] px-4 py-2.5 mb-2 flex justify-between items-center rounded-r-lg">
                  <span className="font-bold text-[#374151]">{sectionName}</span>
                  <span className="text-sm text-gray-500">{sectionPOs.length} PO{sectionPOs.length !== 1 ? 's' : ''}</span>
                </div>
                <SimpleTable
                  columns={columns}
                  data={sectionPOs}
                  exportable={false}
                  cellComponents={{
                    id: CustomActionComponent,
                    status: StatusChip,
                    proofOfBill: ProofOfBillComponent,
                    createdAt: DateComponent
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">No purchase orders found{activeProjectTab !== "All Projects" ? ` for ${activeProjectTab}` : ''}.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ChangeVendor
        open={isVendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
      />
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deletePurchaseOrder}
        />
      )}
    </div>
  );
};

export default PurchaseOrder;
