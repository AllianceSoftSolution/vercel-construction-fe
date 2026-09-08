import React from "react";

const AnalyticsCard = ({
  icon: Icon,
  label,
  detail,
  count,
  // percentage,
  // percentageColor = "#008A05",
  countColor = "#FC8908",
  onClick,
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-x-3 p-3 gap-y-4 bg-white rounded-lg w-full cursor-pointer" onClick={onClick}>
      <div className="flex gap-x-5 items-center justify-start w-full">
        <div className="flex h-12 w-12 border-[0.5px] border-[#CDC9C9] rounded-lg items-center justify-center p-3 shadow-inner drop-shadow-lg shrink-0">
          {Icon && <Icon className="text-black text-xl cursor-pointer" />}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[20px] leading-tight">{label}</p>
          {detail ? (
            <p className="text-xs text-gray-500 mt-1 leading-snug">{detail}</p>
          ) : null}
        </div>
      </div>
      <div className="flex justify-between items-center w-full gap-x-20  ">
        {/* <p className="font-bold text-[14px]" style={{ color: percentageColor }}>
          {percentage}
        </p> */}
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
