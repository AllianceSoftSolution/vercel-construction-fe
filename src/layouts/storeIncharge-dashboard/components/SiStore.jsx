import React, { useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import Loader from "../../../components/ui/Loader";
import { useNavigate } from "react-router-dom";
import { IconButton, Chip } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../comments/components/DropdownButton";
import AddMemberModal from "./users/modals/AddMemberModal";
import { IoPersonCircle } from "react-icons/io5";
import { RiAccountBox2Fill } from "react-icons/ri";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";

const SiStore = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const typeOptions = [
    { label: "Head Store", value: "HEAD_STORE" },
    { label: "CM Store", value: "CM_STORE" },
  ];
  const filters = [
    { label: "Type", options: typeOptions.map(o => o.label) },
  ];
  const [filter, setFilter] = useState({ Type: [] });

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

  React.useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        let url = "/stores";
        if (filter.Type && filter.Type.length > 0) {
          const backendTypes = filter.Type.map(
            label => typeOptions.find(o => o.label === label)?.value
          ).filter(Boolean);
          if (backendTypes.length > 0) {
            url += `?type=${encodeURIComponent(backendTypes.join(","))}`;
          }
        }
        const res = await apiClient.get(url);
        if (res.ok) {
          setStores(res.data.stores || []);
        } else {
          toast.error("Failed to fetch stores");
        }
      } catch (err) {
        toast.error("Error fetching stores");
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    fetchStores();
    // eslint-disable-next-line
  }, [filter]);

  const handleLinkClick = () => {
    setShowModal(true);
  };

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
            onClick: () => navigate(`/store-incharge-dashboard/store/${id}`),
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

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };

  const handleFilterClear = () => setFilter({ Type: [] });

  const columns = [
    { headerName: "Store Id", field: "storeId" },
    { headerName: "Store Name", field: "storeName" },
    { headerName: "Project", field: "project" },
    { headerName: "Store Head", field: "storeHead" },
    { headerName: "Store Incharge", field: "storeIncharge" },
    { headerName: "Manager", field: "manager" },
    { headerName: "Accountant", field: "accountant" },
    { headerName: "Type", field: "type" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "id" },
  ];

  // Map API data to table data
  const tableData = stores.map((store) => ({
    id: store.id,
    storeId: store.code || store.id,
    storeName: store.name,
    project: store.section?.name?.split(" of ")[1] || "-",
    storeHead: store.storeHeadAssignments?.[0]?.user?.name || "-",
    storeIncharge: store.storeInchargeAssignments?.[0]?.user?.name || "-",
    manager: store.managerAssignments?.[0]?.user?.name || "-",
    accountant: store.accountantAssignments?.[0]?.user?.name || "-",
    type: store.type || "-",
    status: store.status || (store.isActive ? "Active" : "Inactive"),
    action: store, // pass full store for action component
  }));

  return (
    <div className="h-full">
      <TopBar
        title="Stores"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
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
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={tableData}
          loading={loading}
          cellComponents={{ id: CustomActionComponent, type: TypeChip }}
        />
      </div>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SiStore;
