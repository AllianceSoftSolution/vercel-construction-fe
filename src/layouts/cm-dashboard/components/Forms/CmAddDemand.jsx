import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../../../mui/CustomSelect";
import MenuItem from "@mui/material/MenuItem";

const CmAddUser = () => {
  const navigate = useNavigate();
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        icon={
          <FaArrowLeftLong className="w-8 h-8 p-2 bg-[#EBEBEB] rounded-full" />
        }
        title="Create Demand"
        detail="Add New Demand Information in Epos Software"
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* form */}
      <div className="flex justify-center">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          {/* <h3 className="text-xl font-semibold text-[#12141D] ">
            Premium Content
          </h3> */}
          <CustomTextField
            label={
              <span className="flex items-center gap-1">Project Name</span>
            }
            fullWidth
            name="name"
            placeholder="Enter Project Name"
            type="text"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Section</span>}
            fullWidth
            name="section"
            placeholder="Enter Your Section"
            type="text"
          />{" "}
          {/* <CustomSelect label="Vendor Name" fullWidth name="name" select>
            <MenuItem value="1">Option 1</MenuItem>
            <MenuItem value="2">Option 2</MenuItem>
          </CustomSelect> */}
          <CustomTextField
            label={<span className="flex items-center gap-1">Unit</span>}
            fullWidth
            name="unit"
            placeholder="Enter Unit"
            type="text"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Quantity</span>}
            fullWidth
            name="quantity"
            placeholder="Enter Quantity"
            type="text"
          />{" "}
        </div>
      </div>{" "}
      <div className="flex gap-4 w-full justify-center mt-8">
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
  );
};

export default CmAddUser;
