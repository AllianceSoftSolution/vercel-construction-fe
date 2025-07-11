import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

const CmDemands = () => {
  const [loading, setLoading] = useState(false);
  const [demands, setDemands] = useState([]);
  const [materialsMap, setMaterialsMap] = useState({});
  const [sectionsMap, setSectionsMap] = useState({});
  const navigate = useNavigate();

  const fetchMaterialAndSections = async () => {
    try {
      const [materialsRes, sectionsRes] = await Promise.all([
        apiClient.get("/materials"),
        apiClient.get("/sections"),
      ]);

      const materialMap = {};
      if (materialsRes.ok) {
        materialsRes.data.materials.forEach((m) => {
          materialMap[m._id] = m.name;
        });
      }

      const sectionMap = {};
      if (sectionsRes.ok) {
        sectionsRes.data.sections.forEach((s) => {
          sectionMap[s._id] = s.name;
        });
      }

      setMaterialsMap(materialMap);
      setSectionsMap(sectionMap);
    } catch (error) {
      toast.error("Failed to fetch materials or sections");
      console.error(error);
    }
  };

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
    const init = async () => {
      await fetchMaterialAndSections();
    };
    init();
  }, []);

  useEffect(() => {
    if (Object.keys(materialsMap).length && Object.keys(sectionsMap).length) {
      fetchDemand();
    }
  }, [materialsMap, sectionsMap]);

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

  const CustomActionComponent = ({ value }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail",
          onClick: () =>
            navigate(`/construction-manager-dashboard/demands/${value}`),
          icon: <FaEye />,
        },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  return (
    <div className="w-full">
      <TopBar
        title="Demands"
        detail="View and manage construction material demands."
        showFilter={true}
        filterOptions={["Approved", "Rejected", "Pending"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
        buttonText="Create Demand"
        onButtonClick={() =>
          navigate("/construction-manager-dashboard/demands/addDemand")
        }
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />

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

export default CmDemands;
