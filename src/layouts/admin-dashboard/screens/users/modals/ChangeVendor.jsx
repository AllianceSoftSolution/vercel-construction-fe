import React from "react";
import TopBar from "../../../../../components/ui/TopBar";
import CustomTextField from "../../../../../mui/CustomTextField";
import { MenuItem, Modal, Box } from "@mui/material";
import CustomSelect from "../../../../../mui/CustomSelect";

const ChangeVendor = ({ open, onClose }) => {
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
          <CustomSelect label="Vendor Name" fullWidth name="name" select>
            <MenuItem value="1">Option 1</MenuItem>
            <MenuItem value="2">Option 2</MenuItem>
          </CustomSelect>
          <CustomSelect label="Add Product" fullWidth name="product" select>
            <MenuItem value="1">Option 1</MenuItem>
            <MenuItem value="2">Option 2</MenuItem>
          </CustomSelect>
          <CustomTextField
            label="Quantity"
            fullWidth
            name="code"
            placeholder="Enter Quantity"
          />
          <div className="flex gap-4 w-full mt-8">
            <button
              className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000] "
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              className="bg-primary  px-10 py-2 rounded-lg font-medium text-white "
              onClick={() => navigate(-1)}
            >
              Save
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ChangeVendor;
