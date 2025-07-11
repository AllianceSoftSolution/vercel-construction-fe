import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const Demands = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDemand = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/demands");
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
  }, []);

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
        <SimpleTable
          columns={columns}
          data={demands}
          loading={loading}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>
    </div>
  );
};

export default Demands;
