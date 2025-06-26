import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const navigate = useNavigate();
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        icon={
          <FaArrowLeftLong className="w-8 h-8 p-2 bg-[#EBEBEB] rounded-full" />
        }
        title="New Project"
        detail="Add New Project Information in Epos Software"
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* form */}
      <div className="flex justify-center">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <h3 className="text-xl font-semibold text-[#12141D] ">
            Project Information
          </h3>
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
            label={<span className="flex items-center gap-1">Sections</span>}
            fullWidth
            name="sections"
            placeholder="Enter Your Work Email"
            type="text"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Start Date</span>}
            fullWidth
            name="startDate"
            placeholder="Enter Start Date"
            type="date"
          />{" "}
          <CustomTextField
            label={
              <span className="flex items-center gap-1">Project Status</span>
            }
            fullWidth
            name="status"
            placeholder="Enter Project Status"
          />{" "}
          <h3 className="text-xl font-semibold text-[#12141D] ">
            Project Site Address Detail
          </h3>
          <CustomTextField
            label={
              <span className="flex items-center gap-1">Country/Region</span>
            }
            fullWidth
            name="country"
            placeholder="Enter Your Country/Region"
            type="text"
          />{" "}
          <CustomTextField
            label={
              <span className="flex items-center gap-1">Street Address</span>
            }
            fullWidth
            name="address"
            placeholder="Enter Street Address"
            type="text"
          />{" "}
          <CustomTextField
            label={
              <span className="flex items-center gap-1">
                Apt,Floor,bldg(if Applicable )
              </span>
            }
            fullWidth
            name="address"
            placeholder="Enter Apt,Floor,bldg"
            type="text"
          />{" "}
          <CustomTextField
            label={
              <span className="flex items-center gap-1">City/Town/Village</span>
            }
            fullWidth
            name="village"
            placeholder="Enter Your City/Town/Village"
            type="text"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Postal Code</span>}
            fullWidth
            name="code"
            placeholder="Enter Your Postal Code"
            type="number"
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
          Save Project
        </button>
      </div>
    </div>
  );
};

export default AddProject;
