import React from "react";
import TopBar from "@/components/ui/TopBar";
import CustomTextField from "@/mui/CustomTextField";
import { useNavigate } from "react-router-dom";

const SiAddVendor = () => {
  const navigate = useNavigate();
  return (
    <div>
      <TopBar title="Add Vendor" detail="Add New Vendor" showIcon={true} />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <div className="flex justify-center items-center gap-4">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <CustomTextField
            label={<span className="flex items-center gap-1">Vendor Name</span>}
            fullWidth
            name="vendorName"
            placeholder="Enter Vendor Name"
            type="text"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Email</span>}
            fullWidth
            name="email"
            placeholder="Enter Email "
            type="email"
          />{" "}
          <CustomTextField
            label={
              <span className="flex items-center gap-1">Phone Number</span>
            }
            fullWidth
            name="phoneNumber"
            placeholder="Enter Phone Number"
            type="number"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Address</span>}
            fullWidth
            name="address"
            placeholder="Enter Address"
            type="text"
          />{" "}
        </div>
      </div>{" "}
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
  );
};

export default SiAddVendor;
