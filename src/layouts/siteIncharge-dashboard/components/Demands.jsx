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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [demands, setDemands] = useState([]);

  const fetchDemand = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          no: demand.referenceNumber || `REF-${index + 1}`,
          project: demand.section?.project?.name || "N/A",
          material: demand.material?.name || "N/A",
          section: demand.section?.name || "N/A",
          qty: demand.quantity || "N/A",
          unit: demand.unit || "N/A",
          poQty: demand.poQuantity || "0",
          status: demand.status || "N/A",
          approvedBy: demand.approvedBy || "N/A",
          fulfilled: demand.quantityFulfilled || "0",
          date: demand.createdAt ? new Date(demand.createdAt).toLocaleDateString() : "N/A",
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
    { headerName: "Project Name", field: "project" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Status", field: "status" },
    { headerName: "Approved By", field: "approvedBy" },
    { headerName: "Fulfilled", field: "fulfilled" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];
  const CustomActionComponent = ({ value }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate(`/siteincharge-dashboard/demands/${value}`),
            icon: <FaEye />,
          },
    
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
    <div className="md:px-2 mx-2 h-full md:mx-0">
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
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading ...</p>
          </div>
        ) : (
          <SimpleTable
            columns={columns}
            data={demands}
            cellComponents={{ action: CustomActionComponent }}
          />
        )}
      </div>
    </div>
  );
};

export default Demands;
