import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../comments/components/DropdownButton";
import AddMemberModal from "./users/modals/AddMemberModal";
import { IoPersonCircle } from "react-icons/io5";
import { RiAccountBox2Fill } from "react-icons/ri";
import apiClient from "../../../api/apiClient"; 
import toast from "react-hot-toast";
import DeleteModal from "../../../mui/DeleteModal";
import Loader from "../../../components/ui/Loader";
import { Chip } from "@mui/material";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";


const CmStores = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [store, setStore] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [filter, setFilter] = useState({ Type: [], Project: [], Section: [] });

  // Store type filter options
  const typeOptions = [
    { label: "Head Store", value: "HEAD_STORE" },
    { label: "CM Store", value: "CM_STORE" },
  ];
  // Project and Section filter options
  const filters = [
    { label: "Type", options: typeOptions.map(o => o.label) },
    { label: "Project", options: projectOptions },
    { label: "Section", options: sectionOptions },
  ];

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
        const uniqueProjects = Array.from(new Set(data.map(s => s.section?.project?.name).filter(Boolean)));
        const uniqueSections = Array.from(new Set(data.map(s => s.section?.name).filter(Boolean)));
        setProjectOptions(uniqueProjects);
        setSectionOptions(uniqueSections);

        // Apply frontend filters for project and section
        let filtered = data;
        if (filter.Project && filter.Project.length > 0) {
          filtered = filtered.filter(s => filter.Project.includes(s.section?.project?.name));
        }
        if (filter.Section && filter.Section.length > 0) {
          filtered = filtered.filter(s => filter.Section.includes(s.section?.name));
        }
        setStore(filtered);
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

  const deleteStore = async (storeId) => {
    try {
      const response = await apiClient.delete(`/stores/${storeId}`);
      if (response.ok) {
        fetchStore();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchStore();
    // eslint-disable-next-line
  }, [filter]);

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ Type: [], Project: [], Section: [] });

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
            onClick: () => navigate(`/construction-manager-dashboard/store/${id}`),
            icon: <FaEye />,
          },
          // {
          //   label: "Delete ",
          //   onClick: () => {
          //     setSelectedStoreId(id);
          //     setShowDeleteModal(true);
          //   },
          //   icon: <FaTrash />,
          // },
          // {
          //   label: "Assign Store Incharge",
          //   onClick: () => handleLinkClick(),
          //   icon: <IoPersonCircle />,
          // },
          // {
          //   label: "Assign Accountant",
          //   onClick: () => handleLinkClick(),
          //   icon: <RiAccountBox2Fill />,
          // },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  // Store type color mapping (updated for only CM STORE, HEAD STORE, default)
  const typeColorMap = {
    "CM_STORE": "#320d4a",
    "HEAD_STORE": "#e8a113",
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

  const columns = [
    { headerName: "Store Id", field: "storeId" },
    { headerName: "Store Name", field: "name" },
    { headerName: "Project Name", field: "section.project.name" },
    { headerName: "Type", field: "type" },
    { headerName: "Section Name", field: "section.name" },
    { headerName: "Action", field: "id" },
  ];

  return (
    <div className="h-full">
      <TopBar
        title="Stores"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // buttonText="Add New Store"
        // onButtonClick={() => navigate("/admin-dashboard/store/addStore")}
      />
      <div className="my-4 flex justify-end">
        <CustomFilterDropdown
          filters={filters}
          selected={filter}
          onChange={handleFilterChange}
          onClear={handleFilterClear}
          placeholder="Filter by type, project or section"
          dropdownAlign="right"
        />
      </div>
      {/* <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div> */}
      {/* table */}
      <div className="overflow-x-auto mt-4  ">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={store}
            cellComponents={{ action: CustomActionComponent, type: TypeChip }}
          />
        )}
      </div>
   
    </div>
  );
};

export default CmStores;
