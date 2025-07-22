import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";
import { FaUserEdit, FaTrash } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IconButton } from "@mui/material";
import DropdownButton from "../../../comments/components/DropdownButton";
import DeleteModal from '../../../mui/DeleteModal';

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/materials");
      if (response.ok) {
        const data = response.data.materials.map((material, index) => ({
          ...material,
        }));
        setMaterials(data);
      } else {
        toast.error("Failed to fetch materials");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Error fetching materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  const handleEdit = (id) => {
    const material = materials.find(m => m.id === id);
    navigate("/admin-dashboard/materials/addProduct", { state: { material } });
  };

  const handleDelete = async () => {
    if (!selectedMaterialId) return;
    try {
      setLoading(true);
      const response = await apiClient.delete(`/materials/${selectedMaterialId}`);
      if (response.ok) {
        toast.success('Material deleted successfully');
        setShowDeleteModal(false);
        setSelectedMaterialId(null);
        fetchMaterial();
      } else {
        toast.error(response.data?.message || 'Failed to delete material');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting material');
    } finally {
      setLoading(false);
    }
  };

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "Edit",
            onClick: () => handleEdit(id),
            icon: <FaUserEdit />,
          },
          {
            label: "Delete ",
            onClick: () => {
              setSelectedMaterialId(id);
              setShowDeleteModal(true);
            },
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

  const columns = [
    // { headerName: "ID", field: "id" },
    { headerName: "Product Name", field: "name" },
    { headerName: "Description", field: "description" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Action", field: "id" },
    // { headerName: "Category", field: "category" },
  ];

  return (
    <div className="h-full">
      <TopBar
        title="Materials"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        buttonText="Add Product"
        onButtonClick={() => navigate("/admin-dashboard/materials/addProduct")}
      />
      {/* <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div> */}

      {/* table */}
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={materials}
            cellComponents={{ id: CustomActionComponent }}
          />
        )}
      </div>
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Materials;
