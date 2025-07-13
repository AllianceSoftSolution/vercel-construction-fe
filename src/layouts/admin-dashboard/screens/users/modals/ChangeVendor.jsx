import React, { useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import CustomTextField from "../../../../../mui/CustomTextField";
import { MenuItem, Modal, Box } from "@mui/material";
import CustomSelect from "../../../../../mui/CustomSelect";

const ChangeVendor = ({ open, onClose, onSave, loading = false }) => {
  const [form, setForm] = useState({
    vendorName: "",
    product: "",
    quantity: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(form);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 400,
          maxWidth: "90%",
          outline: "none",
        }}
      >
        <TopBar title="Assign Vendor" detail="Add New Vendor" />
        <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
        <div>
          <CustomSelect 
            label="Vendor Name" 
            fullWidth 
            name="vendorName" 
            select
            value={form.vendorName}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="1">Option 1</MenuItem>
            <MenuItem value="2">Option 2</MenuItem>
          </CustomSelect>
          <CustomSelect 
            label="Add Product" 
            fullWidth 
            name="product" 
            select
            value={form.product}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="1">Option 1</MenuItem>
            <MenuItem value="2">Option 2</MenuItem>
          </CustomSelect>
          <CustomTextField
            label="Quantity"
            fullWidth
            name="quantity"
            placeholder="Enter Quantity"
            value={form.quantity}
            onChange={handleChange}
            disabled={loading}
          />
          <div className="flex gap-4 w-full mt-8">
            <button
              className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000] "
              onClick={onClose}
              disabled={loading}
            >
              Back
            </button>
            <button
              className="bg-primary  px-10 py-2 rounded-lg font-medium text-white "
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ChangeVendor;
