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
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import DeleteModal from "../../../mui/DeleteModal";

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

const PurchaseOrder = () => {
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const {id} = useParams();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState({ Status: [], Project: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPOId, setSelectedPOId] = useState(null);
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
          section: po.demand?.section?.name || "-",
          qty: po.demand?.quantity || "-",
          unit: po.demand?.unit || "-",
          poQty: po.quantity || "-",
          amount: po.totalAmount ? `${po.totalAmount}` : "-",
          status: po.status || "-",
          assingedVendors: po.vendorId || "-",
          proofOfBill: po.proofOfBill || "-",
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
    { label: "In Store", value: "IN_STORE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  
  ];
  const projectOptions = projects.map((p) => ({ label: p.name, value: p.id }));

  // CustomFilterDropdown expects filters: [{label, options: [...]}, ...]
  const filters = [
    { label: "Status", options: statusOptions.map(o => o.label) },
    { label: "Project", options: projectOptions.map(o => o.label) },
  ];

  // Multi-select filter change handler
  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Status: [], Project: [] });

  // Pass the filter state directly as selected
  let selected = null;
  if (filter.Status && filter.Status.length > 0) {
    selected = { group: "Status", value: filter.Status.join(", ") };
  } else if (filter.Project && filter.Project.length > 0) {
    selected = { group: "Project", value: filter.Project.join(", ") };
  }

  const columns = [
    { headerName: "Demand ID", field: "demandId" },
    { headerName: "Project Name", field: "project" },
    // { headerName: "Demand", field: "demandName" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Amount (PKR)", field: "amount" },
    { headerName: "Proof of Bill", field: "proofOfBill" },
    { headerName: "Status", field: "status" },
    // { headerName: "Assigned Vendors", field: "assingedVendors" },
    { headerName: "Action", field: "id" },
  ];

  const CustomActionComponent = ({ value : id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          // {
          //   label: "View",
          //   onClick: () => navigate(`/admin-dashboard/pOS/${id}`),
          //   icon: <IoIosEye />,
          // },
          // {
          //   label: "Edit",
          //   icon: <FaUserEdit />,
          // },
          // {  
          //   label: "Change Vendor",
          //   onClick: () => setVendorModalOpen(true),
          //   icon: <RiFileEditFill />,
          // },
          {
            label: "Delete",
            onClick: () => {
              setSelectedPOId(id);
              setShowDeleteModal(true);
            },
            icon: <FaTrash />,
          },
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
      <div className="flex justify-end items-center gap-4 mt-2 mb-6">
        <CustomFilterDropdown
          filters={filters}
          selected={filter}
          onChange={handleFilterChange}
          onClear={handleFilterClear}
          placeholder="Filter by status or project"
        />
      </div>
      {/* <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div> */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={purchaseOrders}
            cellComponents={{ id: CustomActionComponent, status: StatusChip, proofOfBill: ProofOfBillComponent }}
          />
        )}
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
