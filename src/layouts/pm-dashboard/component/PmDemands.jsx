import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Demands = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const data = [
    {
      id: 1,
      no: "REF001",
      project: "Bridge Construction",
      material: "Cement",
      section: "A1",
      qty: 120,
      unit: "ton",
      poQty: 100,
      status: "Pending",
      approvedBy: "Owner",
      fulfilled: 12,
      date: "2023-01-01",
      action: "id-here",
    },
    {
      id: 2,
      no: "REF002",
      project: "Highway Expansion",
      material: "Steel",
      section: "B2",
      qty: 250,
      unit: "ton",
      poQty: 100,
      status: "Approved",
      approvedBy: "Site Manager",
      fulfilled: 13,
      date: "2023-01-01",
      action: "id-here",
    },
    {
      id: 3,
      no: "REF003",
      project: "Metro Rail",
      material: "Concrete",
      section: "C3",
      qty: 300,
      unit: "ton",
      poQty: 100,
      status: "In Progress",
      approvedBy: "Owner",
      fulfilled: 12,
      date: "2023-01-01",
      action: "id-here",
    },
  ];

  const fetchDemand = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/demands");
      if (response.ok) {
        const data = response.data.demands.map((demand, index) => ({
          no: `REF-${index + 1}`,
          materialId: materialsMap[demand.materialId] || "N/A",
          sectionId: sectionsMap[demand.sectionId] || "N/A",
          action: demand._id,
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
    { headerName: "Action", field: "action" },
  ];
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate("123"),
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
          data={data}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>
    </div>
  );
};

export default Demands;
