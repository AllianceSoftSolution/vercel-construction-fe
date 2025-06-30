import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate } from "react-router-dom";

const CmAddUser = () => {
  const navigate = useNavigate();
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        icon={
          <FaArrowLeftLong className="w-8 h-8 p-2 bg-[#EBEBEB] rounded-full" />
        }
        title="New User"
        detail="Add New User Information in Epos Software"
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
            label={<span className="flex items-center gap-1">User Name</span>}
            fullWidth
            name="name"
            placeholder="Enter Your Name"
            type="text"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Enter Email</span>}
            fullWidth
            name="Email"
            placeholder="Enter Your Work Email"
            type="email"
          />{" "}
          <CustomTextField
            label={
              <span className="flex items-center gap-1">Phone Number</span>
            }
            fullWidth
            name="phoneNumber"
            placeholder="Enter Your Phone Number"
            type="number"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">User Role</span>}
            fullWidth
            name="role"
            placeholder="Enter Role"
            type="text"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Password</span>}
            fullWidth
            name="password"
            placeholder="Enter Password"
            type="password"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Add Note</span>}
            fullWidth
            name="note"
            placeholder="Enter Your Note"
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
          Save User
        </button>
      </div>
    </div>
  );
};

export default CmAddUser;
