import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../comments/components/DropdownButton";
import AddMemberModal from "./users/modals/AddMemberModal";
import { IoPersonCircle } from "react-icons/io5";
import { RiAccountBox2Fill } from "react-icons/ri";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import { Chip } from "@mui/material";

const typeOptions = [
  { label: "Head Store", value: "HEAD_STORE" },
  { label: "CM Store", value: "CM_STORE" },
];
const filters = [
  { label: "Type", options: typeOptions.map(o => o.label) },
];

// Store type color mapping
const typeColorMap = {
  "CM STORE": "#0ea5e9", // blue
  "HEAD STORE": "#22c55e", // green
  default: "#6b7280", // gray
};

const TypeChip = ({ value }) => {
  const type = (value || "").toUpperCase();
  const color = typeColorMap[type] || typeColorMap.default;
  return (
    <Chip
      label={type.replace(/_/g, " ")}
      size="small"
      sx={{ bgcolor: color, color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}
    />
  );
};

const PmStores = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [filter, setFilter] = useState({ Type: [] });

  const handleLinkClick = () => {
    setShowModal(true);
  };

  const fetchStore = async () => {
    try {
      setLoading(true);
      let url = "/stores";
      if (filter.Type && filter.Type.length > 0) {
        const backendTypes = filter.Type.map(
          label => typeOptions.find(o => o.label === label)?.value
        ).filter(Boolean);
        if (backendTypes.length > 0) {
          url += `?type=${encodeURIComponent(backendTypes.join(","))}`;
        }
      }
      const response = await apiClient.get(url);
      if (response.status === 200) {
        const data = response.data.stores.map((store, index) => ({
          storeId: index + 1,
          action: store.id,
          ...store,
        }));
        setStore(data);
      } else {
        toast.error("Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Error fetching stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
    // eslint-disable-next-line
  }, [filter]);

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Type: [] });

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
            onClick: () => navigate(`/project-manager-dashboard/store/${id}`),

            icon: <FaEye />,
          },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  const columns = [
    { headerName: "Store Id", field: "storeId" },
    { headerName: "Store Name", field: "name" },
    { headerName: "Type", field: "type" },
    { headerName: "Section Id", field: "sectionId" },
    { headerName: "Action", field: "id" },
  ];

  return (
    <div className="h-full">
      <TopBar
        title="Stores"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="my-4 flex justify-end">
        <CustomFilterDropdown
          filters={filters}
          selected={filter}
          onChange={handleFilterChange}
          onClear={handleFilterClear}
          placeholder="Filter by type"
          dropdownAlign="left"
        />
      </div>
      {/* <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div> */}
      {/* table */}
      <div className="overflow-x-auto mt-4  ">
        {loading ? (
          <Loader/>
        ) : (
        <SimpleTable
          columns={columns}
          data={store}
          cellComponents={{ id: CustomActionComponent, type: TypeChip }}
          />
        )}
      </div>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default PmStores;
