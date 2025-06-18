import React from "react";
import TopBar from "../../../../../components/ui/TopBar";
import CustomTextField from "../../../../../mui/CustomTextField";
import { MenuItem } from "@mui/material";
import CustomSelect from "../../../../../mui/CustomSelect";

const ChangeVendor = () => {
  return (
    <div>
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
        <CustomTextField label="Quantity" fullWidth name="code" />
      </div>
    </div>
  );
};

export default ChangeVendor;
