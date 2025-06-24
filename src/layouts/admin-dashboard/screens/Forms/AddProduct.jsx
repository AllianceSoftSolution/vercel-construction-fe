import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import uploadIcon from "../../../../assets/construction/upload 1.png";
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  const navigate = useNavigate();
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        icon={
          <FaArrowLeftLong className="w-8 h-8 p-2 bg-[#EBEBEB] rounded-full" />
        }
        title="New Material"
        detail="Add New User Information in Epos Software"
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* Upload Image Section */}
      <div className="flex flex-col gap-y-2">
        <h4 className="text-[#12141D] font-semibold">Upload Image</h4>
      </div>
      {/* form */}
      <div className="flex flex-col gap-4">
        <div className="relative w-[100px] h-[100px]">
          <div className="w-full h-full bg-white border-[0.5px] border-[#CDC9C9] rounded-full overflow-hidden"></div>
          <label
            htmlFor="upload"
            className="absolute -bottom-2 right-1 cursor-pointer"
          >
            <div className="w-10 h-10 bg-white  rounded-2xl flex items-center justify-center">
              <img src={uploadIcon} size={25} />
            </div>
          </label>
          <input
            id="upload"
            type="file"
            className="hidden"
            onChange={(e) => console.log(e.target.files[0])}
          />
        </div>
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <CustomTextField
            label={
              <span className="flex items-center gap-1">Product Name</span>
            }
            fullWidth
            name="productName"
            placeholder="Enter Product Name"
            type="text"
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Unit</span>}
            fullWidth
            name="unit"
            placeholder="Enter Unit "
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

export default AddProduct;
