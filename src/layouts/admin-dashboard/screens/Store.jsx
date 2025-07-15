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


const Stores = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [store, setStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");

  const handleLinkClick = () => {
    setShowModal(true);
  };

  const fetchStore = async () => {
    try {
      setLoading(true);
      const filterQuery = selectedFilter ? `?status=${encodeURIComponent(selectedFilter)}` : "";
      const response = await apiClient.get(`/stores`);
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
  }, [selectedFilter]);

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
            onClick: () => navigate(`/admin-dashboard/store/${id}`),
            icon: <FaEye />,
          },
          {
            label: "Delete ",
            onClick: () => {
              setSelectedStoreId(id);
              setShowDeleteModal(true);
            },
            icon: <FaTrash />,
          },
          {
            label: "Assign Store Incharge",
            onClick: () => handleLinkClick(),
            icon: <IoPersonCircle />,
          },
          {
            label: "Assign Accountant",
            onClick: () => handleLinkClick(),
            icon: <RiAccountBox2Fill />,
          },
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

  const columns = [
    { headerName: "Store Id", field: "storeId" },
    { headerName: "Store Name", field: "name" },
    { headerName: "Type", field: "type" },
    { headerName: "Section Id", field: "sectionId" },
    { headerName: "Action", field: "id" },
  ];

  const filterOptions = ["CM STORE", "HEAD STORE"];

  return (
    <div className="h-full">
      <TopBar
        title="Stores"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonText="Add New Store"
        onButtonClick={() => navigate("/admin-dashboard/store/addStore")}
      />
      <div className="my-4 flex justify-end">
        <CustomFilterDropdown
          options={filterOptions}
          value={selectedFilter}
          onChange={setSelectedFilter}
          label="Select Store Status"
          placeholder="Filter"
          dropdownAlign="left"
        />
      </div>
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={store}
            cellComponents={{ id: CustomActionComponent, type: TypeChip }}
          />
        )}
      </div>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await deleteStore(selectedStoreId);
            setShowDeleteModal(false);
            setSelectedStoreId(null);
          }}
        />
      )}
    </div>
  );
};

export default Stores;
