import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import Loader from "../../../components/ui/Loader";
import DropdownButton from "../../../comments/components/DropdownButton";
import { IconButton, Chip } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosEye } from "react-icons/io";
import { RiFileEditFill } from "react-icons/ri";
import ChangeVendor from "./users/modals/ChangeVendor";
import { useNavigate } from "react-router-dom";
import  apiClient  from "../../../api/apiClient";
import toast from "react-hot-toast";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";

const statusColorMap = {
  COMPLETED: "#22c55e", // green
  PARTIAL: "#eab308", // yellow
  PENDING: "#f59e42", // orange
  REJECTED: "#ef4444", // red
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

const SiPos = () => {
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [filter, setFilter] = useState({ Status: [] });

  const columns = [
    { headerName: "Demand ID", field: "demandId" },
    { headerName: "Project Name", field: "project" },
    { headerName: "Demand ", field: "demandName" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Status", field: "status" },
    { headerName: "Assigned Vendors", field: "assingedVendors" },
    { headerName: "Action", field: "id" },
  ];

  const statusOptions = [
    { label: "Order Placed", value: "ORDER_PLACED" },
    { label: "Created", value: "CREATED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "In Transit", value: "IN_TRANSIT" },
    { label: "In Store", value: "IN_STORE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const filters = [
    { label: "Status", options: statusOptions.map(o => o.label) },
  ];

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      let url = "/purchase-orders";
      if (filter.Status && filter.Status.length > 0) {
        const backendStatus = filter.Status.map(
          label => statusOptions.find(o => o.label === label)?.value
        ).filter(Boolean);
        if (backendStatus.length > 0) {
          url += `?status=${encodeURIComponent(backendStatus.join(","))}`;
        }
      }
      const response = await apiClient.get(url);
      if (response.ok) {
        const data = response.data.data.map((po, index) => ({
          id: po.id,
          demandId: po.demand?.referenceNumber || "-",
          project: po.demand?.section?.project?.name || "-",
          demandName: po.demand?.referenceNumber || "-",
          material: po.materialId,
          section: po.demand?.section?.name || "-",
          qty: po.demand?.quantity || "-",
          unit: po.demand?.unit || "-",
          poQty: po.quantity || "-",
          status: po.status || "-",
          assingedVendors: po.vendorId,
        }));
        setPurchaseOrders(data);
      } else {
        toast.error("Failed to fetch purchase orders");
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
    // eslint-disable-next-line
  }, [filter]);

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };

  const handleFilterClear = () => setFilter({ Status: [] });

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
            onClick: () => navigate(`/store-incharge-dashboard/pos/${id}`),
            icon: <IoIosEye />,
          },
          // {
          //   label: "Change Vendor",
          //   onClick: () => setVendorModalOpen(true),
          //   icon: <RiFileEditFill />,
          // },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  return (
    <div className="h-full">
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
          placeholder="Filter by status"
        />
      </div>
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={purchaseOrders}
          cellComponents={{ id: CustomActionComponent, status: StatusChip }}
        />
      </div>

      {/* Modal */}
      <ChangeVendor
        open={isVendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
      />
    </div>
  );
};

export default SiPos;
