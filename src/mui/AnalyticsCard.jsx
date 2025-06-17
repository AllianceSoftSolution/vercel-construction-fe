import React from "react";

const AnalyticsCard = ({
  icon: Icon,
  label,
  count,
  countColor,
  percentage,
  percentageColor = "#008A05",
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-x-3 p-3 gap-y-4 bg-white rounded-lg w-full ">
      <div className="flex gap-x-5 items-center justify-start w-full">
        <div className="flex h-12 w-12 border-[0.5px] border-[#CDC9C9] rounded-lg items-center justify-center p-3 shadow-inner drop-shadow-lg">
          {Icon && <Icon className="text-black text-xl" />}
        </div>
        <p className="font-bold text-[20px]">{label}</p>
      </div>
      <div className="flex justify-between items-center w-full ">
        <p className="font-bold text-[14px]" style={{ color: percentageColor }}>
          {percentage} %
        </p>
        <p
          className="font-bold text-[15px] flex justify-end"
          style={{ color: countColor }}
        >
          {count}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsCard;
