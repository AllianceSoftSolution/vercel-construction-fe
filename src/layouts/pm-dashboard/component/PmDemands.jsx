import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import Loader from "../../../components/ui/Loader";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import { Chip } from "@mui/material";

const statusColorMap = {
  APPROVED: "#22c55e", // green
  REJECTED: "#ef4444", // red
  PENDING: "#f59e42", // orange
  PARTIALLY_APPROVED: "#eab308", // yellow
  PO_CREATED: "#8b5cf6", // purple
  FULFILLED: "#0ea5e9", // blue
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

const Demands = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ Status: [] });

  // Status options
  const statusOptions = [
    { label: "Request Sent", value: "REQUEST_SENT" },
    { label: "Partially Approved", value: "PARTIALLY_APPROVED" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Fulfilled From Store", value: "FULFILLED_FROM_STORE" },
    { label: "PO In Progress", value: "PO_IN_PROGRESS" },
    { label: "PO Created", value: "PO_CREATED" },
    { label: "Order Placed", value: "ORDER_PLACED" },
    { label: "In Store", value: "IN_STORE" },
    { label: "Completed", value: "COMPLETED" },
  ];
  const filters = [
    { label: "Status", options: statusOptions.map(o => o.label) },
  ];

  const fetchDemand = async () => {
    try {
      setLoading(true);
      let url = "/demands";
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
        const data = response.data.demands.map((demand, index) => ({
          no: demand.referenceNumber || `REF-${index + 1}`,
          activity: demand.activity || "N/A",
          materialId: demand.material?.name || "N/A",
          quantity: demand.quantity || "N/A",
          unit: demand.unit || "N/A",
          sectionId: demand.section?.name || "N/A",
          notes: demand.notes || "N/A",
          status: demand.status || "N/A",
          action: demand.id,
        }));
        setDemands(data);
      } else {
        toast.error("Failed to fetch demands");
      }
    } catch (error) {
      toast.error("Error fetching demands");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemand();
    // eslint-disable-next-line
  }, [filter]);

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Status: [] });

  const columns = [
    { headerName: "No", field: "no" },
    { headerName: "Activity", field: "activity" },
    { headerName: "Material", field: "materialId" },
    { headerName: "Quantity", field: "quantity" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Section", field: "sectionId" },
    { headerName: "Notes", field: "notes" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "action" },
  ];
  const CustomActionComponent = ({ value }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate(`/project-manager-dashboard/demands/${value}`),
            icon: <FaEye />,
          },
          // {
          //   label: "Edit",
          //   onClick: () => alert("Edit"),
          //   icon: <FaUserEdit />,
          // },
          // {
          //   label: "Delete ",
          //   onClick: () => alert("Delete"),
          //   icon: <FaTrash />,
          // },
        ]}
        // onClick={handleActionClick}
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
        title="Demands"
        // detail="Lorem Ipsumis simply dummy text of the printing and typesetting industry."
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
      {/* table */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loader/>
        ) : (
          <SimpleTable
            columns={columns}
            data={demands}
            loading={loading}
            cellComponents={{ action: CustomActionComponent, status: StatusChip }}
          />
        )}
      </div>
    </div>
  );
};

export default Demands;
