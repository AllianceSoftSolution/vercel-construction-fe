import React from "react";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";

const CustomCardComponent = ({
  icon: Icon,
  label,
  count,
  countColor,
  percentage,
  percentageColor,
}) => {
  return (
    <div className="bg-[#FFFFFF] border-[0.5px] border-[#CDC9C9] rounded-2xl p-2">
      <div className="flex flex-col justify-center items-center gap-x-3 p-3 gap-y-4 bg-white rounded-lg">
        <div className="flex gap-x-5 items-center">
          <div className="flex h-12 w-12 border-[0.5px] border-[#CDC9C9] rounded-lg items-center justify-center p-3 shadow-inner drop-shadow-lg">
            {Icon && <Icon className="text-black text-xl" />}
          </div>
          <p className="font-bold text-[20px]">{label}</p>
        </div>
        <div className="flex gap-x-6 justify-center items-center">
          <p
            className="font-bold text-[14px]"
            style={{ color: percentageColor }}
          >
            {/* <ArrowUpwardOutlinedIcon className="mr-1" style={{ fontSize: "20px" }} /> */}
            {percentage}
          </p>
          <p
            className="font-bold text-[15px] flex justify-end"
            style={{ color: countColor }}
          >
            {count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomCardComponent;
