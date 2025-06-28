import React from "react";
import TopBar from "../../../../../components/ui/TopBar";
import CustomTextField from "../../../../../mui/CustomTextField";
import { MenuItem, Modal, Box } from "@mui/material";
import CustomSelect from "../../../../../mui/CustomSelect";
import { useNavigate } from "react-router-dom";

const ChangeVendor = ({ open, onClose }) => {
  const navigate = useNavigate();
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <TopBar title="Assign Vendor" detail="Add New Vendor" />
        <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
        <div className="flex flex-col gap-4">
          <CustomSelect label="Vendor Name" fullWidth name="name" select>
            <MenuItem value="1">Option 1</MenuItem>
            <MenuItem value="2">Option 2</MenuItem>
          </CustomSelect>
          <CustomSelect label="Add Product" fullWidth name="product" select>
            <MenuItem value="1">Option 1</MenuItem>
            <MenuItem value="2">Option 2</MenuItem>
          </CustomSelect>
          <CustomTextField label="Quantity" fullWidth name="code" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium">
            Cancel
          </button>{" "}
          <button className="bg-primary px-8 py-2 rounded-lg font-medium text-white">
            Save
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ChangeVendor;
