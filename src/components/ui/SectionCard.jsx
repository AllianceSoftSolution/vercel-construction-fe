import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";

const SectionCard = ({
  title = "Section Details",
  sectionNo,
  sectionName,
  totalDemands,
  totalAmount,
  paidAmount,
  remainingAmount,
  manager,
  linkedStores,
  dropdownActions = [],
}) => {
  const CustomActionComponent = () => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={dropdownActions}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  return (
    <div className="bg-[#F7F7F7] rounded-md mt-4 flex flex-col p-4 gap-y-4 w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] ">
      <div className="flex justify-between items-start flex-wrap gap-y-2">
        <h3 className="text-lg sm:text-xl font-semibold text-[#444444]">
          {title}
        </h3>
        <CustomActionComponent />
      </div>
      <div className="h-[1px] bg-[#CDCDCD] w-full"></div>
      <div className="flex justify-between flex-wrap text-sm sm:text-base">
        <h3 className="text-[#444444] font-semibold">Section No:</h3>
        <p className="text-[#444444]">{sectionNo}</p>
      </div>
      <div className="flex justify-between flex-wrap text-sm sm:text-base">
        <h3 className="text-[#444444] font-semibold">Section Name:</h3>
        <p className="text-[#444444]">{sectionName}</p>
      </div>
      <div className="flex justify-between flex-wrap text-sm sm:text-base">
        <h3 className="text-[#444444] font-semibold">Total Amount:</h3>
        <p className="text-[#444444]">{totalAmount}</p>
      </div>{" "}
      <div className="flex justify-between flex-wrap text-sm sm:text-base">
        <h3 className="text-[#444444] font-semibold">Paid Amount:</h3>
        <p className="text-[#444444]">{paidAmount}</p>
      </div>{" "}
      <div className="flex justify-between flex-wrap text-sm sm:text-base">
        <h3 className="text-[#444444] font-semibold">Remaining Amount:</h3>
        <p className="text-[#444444]">{remainingAmount}</p>
      </div>{" "}
      <div className="flex justify-between flex-wrap text-sm sm:text-base">
        <h3 className="text-[#444444] font-semibold">Total Demands:</h3>
        <p className="text-[#444444]">{totalDemands}</p>
      </div>
      <div className="flex justify-between flex-wrap text-sm sm:text-base">
        <h3 className="text-[#444444] font-semibold">
          Assigned Construction Manager:
        </h3>
        <p className="text-[#444444]">{manager}</p>
      </div>
      <div className="flex justify-between flex-wrap text-sm sm:text-base">
        <h3 className="text-[#444444] font-semibold">Linked Stores:</h3>
        <p className="text-[#444444]">{linkedStores}</p>
      </div>
    </div>
  );
};

export default SectionCard;
