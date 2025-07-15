import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { IconButton, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { date } from "zod";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";

// Status color mapping
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [demands, setDemands] = useState([]);

  const columns = [
    { headerName: "Id", field: "id" },
    { headerName: "Material", field: "material.name" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Qty", field: "quantity" },
    { headerName: "Date", field: "createdAt" },
    { headerName: "Fulfilled", field: "fulfilled" },
    { headerName: "Created By", field: "creator.name" },
    { headerName: "Project", field: "section.projectName" },
    { headerName: "Section", field: "section.name" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "demandId" },
  ];

  const fetchDemands = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          ...demand,
          demandId: demand.id,
          id: index + 1,
        }));

        setDemands(data);
      } else {
        toast.error("Failed to fetch Demands");
      }
    } catch (error) {
      console.error("Error fetching demands:", error);
      toast.error("Error fetching demands");
    } finally {   
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  const CustomActionComponent = ({ value: demandId }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => {
              if (demandId) {
                navigate(`/admin-dashboard/demands/${demandId}`);
              } else {
                console.error("Demand ID is undefined.");
              }
            },
            icon: <FaEye />,
          },
          {
            label: "Edit",
            onClick: () => alert("Edit"),
            icon: <FaUserEdit />,
          },
          {
            label: "Delete ",
            onClick: () => alert("Delete"),
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

  return (
    <div className=" h-full ">
      <TopBar
        title="Demands"
        detail="Lorem Ipsumis simply dummy text of the printing and typesetting industry."
        // showExport={true}
        showFilter={true}
        filterOptions={["Approved", "Rejected", "Pending"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={demands}
            cellComponents={{ demandId: CustomActionComponent, status: StatusChip }}
          />
        )}
      </div>
    </div>
  );
};

export default Demands;
