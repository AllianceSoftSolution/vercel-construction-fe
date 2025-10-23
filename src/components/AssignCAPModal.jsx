import React, { useState, useEffect } from "react";
import { Modal, Box, Button, IconButton, MenuItem } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import CustomTextField from "../mui/CustomTextField";
import CustomSelect from "../mui/CustomSelect";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
  borderRadius: "16px",
  background: "white",
  p: 4,
};

const AssignCAPModal = ({ open, onClose, onSubmit, loading = false, sectionId, onCapDeleted }) => {
  const [items, setItems] = useState([
    { materialId: "", materialName: "", qty: "", unit: "" }
  ]);
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [existingCaps, setExistingCaps] = useState([]);
  const [deletingCaps, setDeletingCaps] = useState([]);

  const handleInputChange = (index, field, value) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  // Fetch materials and existing CAPs when modal opens
  useEffect(() => {
    if (open) {
      fetchMaterials();
      if (sectionId) {
        fetchExistingCaps();
      }
    }
  }, [open, sectionId]);

  // Populate form with existing CAPs when they are fetched
  useEffect(() => {
    if (existingCaps.length > 0) {
      const existingItems = existingCaps.map(cap => ({
        id: cap.id, // Include the CAP ID for deletion
        materialId: cap.materialId,
        materialName: cap.material?.name || "",
        qty: cap.quantity,
        unit: cap.unit,
        isExisting: true // Flag to identify existing CAPs
      }));
      setItems(existingItems);
    }
  }, [existingCaps]);

  const fetchMaterials = async () => {
    try {
      setMaterialsLoading(true);
      const response = await apiClient.get("/materials");
      if (response.ok) {
        setMaterials(response.data.materials || []);
      } else {
        toast.error("Failed to load materials");
      }
    } catch (error) {
      console.error("Error loading materials:", error);
      toast.error("Error loading materials");
    } finally {
      setMaterialsLoading(false);
    }
  };

  const fetchExistingCaps = async () => {
    try {
      const response = await apiClient.get(`/material-caps/section/${sectionId}`);
      if (response.ok) {
        setExistingCaps(response.data.caps || []);
      } else {
        console.error("Failed to fetch existing CAPs");
      }
    } catch (error) {
      console.error("Error fetching existing CAPs:", error);
    }
  };

  const addNewItem = () => {
    setItems(prev => ([...prev, { materialId: "", materialName: "", qty: "", unit: "" }]));
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDeleteCap = async (capId, materialName) => {
    if (!capId) {
      // For new items that haven't been saved yet
      removeItem(items.findIndex(item => item.materialName === materialName));
      return;
    }

    try {
      setDeletingCaps(prev => [...prev, capId]);
      
      // Use PATCH to delete the CAP
      const response = await apiClient.patch(`/material-caps/section/${sectionId}`, {
        capId: capId,
        action: "delete"
      });
      
      if (response.ok) {
        toast.success("CAP deleted successfully!");
        // Remove from items and existingCaps
        setItems(prev => prev.filter(item => item.id !== capId));
        setExistingCaps(prev => prev.filter(cap => cap.id !== capId));
        
        // Notify parent component to refresh CAP table
        if (onCapDeleted) {
          onCapDeleted();
        }
      } else {
        toast.error("Failed to delete CAP");
      }
    } catch (error) {
      console.error("Error deleting CAP:", error);
      toast.error("Error deleting CAP");
    } finally {
      setDeletingCaps(prev => prev.filter(id => id !== capId));
    }
  };

  const handleMaterialChange = (index, materialId) => {
    const selectedMaterial = materials.find(m => m.id === materialId);
    
    // Check if this material is already added
    const isDuplicate = items.some((item, i) => 
      i !== index && item.materialId === materialId
    );
    
    if (isDuplicate) {
      toast.error("This material is already added");
      return;
    }
    
    // Check if this material already exists in CAPs
    const existingCap = existingCaps.find(cap => cap.materialId === materialId);
    if (existingCap) {
      toast.error("This material already has a CAP defined");
      return;
    }
    
    setItems(prev => prev.map((item, i) => 
      i === index ? { 
        ...item, 
        materialId: materialId,
        materialName: selectedMaterial?.name || "",
        unit: selectedMaterial?.unit || ""
      } : item
    ));
  };

  const handleSubmit = () => {
    // Filter out existing CAPs and only submit new ones
    const newItems = items.filter(item => !item.isExisting);
    
    if (newItems.length === 0) {
      toast.info("No new CAPs to add");
      return;
    }
    
    const valid = newItems.every(item => item.materialId && item.qty.trim() && item.unit.trim());
    if (!valid) {
      alert("Please fill all fields for every new item");
      return;
    }
    onSubmit(newItems);
  };

  const handleClose = () => {
    setItems([{ materialId: "", materialName: "", qty: "", unit: "" }]);
    setExistingCaps([]);
    setDeletingCaps([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-primary">
              Add Material Cap
            </h2>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {items.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 ">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-primary font-bold">
                    {item.isExisting ? `Existing CAP - ${item.materialName}` : `Item ${idx + 1}`}
                  </span>
                  <button
                    onClick={() => handleDeleteCap(item.id, item.materialName)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                    type="button"
                    disabled={deletingCaps.includes(item.id)}
                  >
                    {deletingCaps.includes(item.id) ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaTrash size={16} />
                    )}
                  </button>
                </div>
                <div className="flex gap-4 flex-col">
                  <CustomSelect
                    label="Material"
                    value={item.materialId}
                    onChange={(e) => handleMaterialChange(idx, e.target.value)}
                    disabled={materialsLoading || item.isExisting}
                    fullWidth
                  >
                    <MenuItem value="">Select Material</MenuItem>
                    {materials.map((material) => {
                      const isExistingCap = existingCaps.some(cap => cap.materialId === material.id);
                      const isAlreadySelected = items.some((item, i) => 
                        i !== idx && item.materialId === material.id
                      );
                      return (
                        <MenuItem 
                          key={material.id} 
                          value={material.id}
                          disabled={isExistingCap || isAlreadySelected}
                        >
                          {material.name}
                          {isExistingCap && " (Already has CAP)"}
                          {isAlreadySelected && " (Already selected)"}
                        </MenuItem>
                      );
                    })}
                  </CustomSelect>
                  <CustomTextField
                    label="QTY"
                    value={item.qty}
                    placeholder="Enter qty"
                    onChange={(e) => handleInputChange(idx, "qty", e.target.value)}
                    type="number"
                    disabled={item.isExisting}
                  />
                  <CustomTextField
                    label="Unit"
                    value={item.unit}
                    placeholder="Enter Unit"
                    onChange={(e) => handleInputChange(idx, "unit", e.target.value)}
                    type="text"
                    disabled={item.materialId || item.isExisting} // Disable if material is selected or if existing CAP
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addNewItem}
            className="flex items-center w-[50%] gap-3 rounded-xl px-4 py-4 bg-white border-2 border-[#fc8908]  hover:bg-[#fff8f0] "
            type="button"
          >
            <div className="bg-[#fc8908] text-white px-2 rounded-sm text-center">
              <IoMdAdd size={16} />
            </div>
            Add Another Item
          </button>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
              disabled={loading}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary px-8 py-2 rounded-lg font-medium text-white"
              disabled={loading}
              type="button"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AssignCAPModal;  