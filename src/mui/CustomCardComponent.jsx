import React from "react";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";

const CustomCardComponent = ({ cards = [] }) => {
  return (
    <div className="bg-[#FFFFFF] border-[0.5px] border-[#CDC9C9] rounded-2xl p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center gap-x-3 p-3 gap-y-4 bg-white rounded-lg"
          >
            <div className="flex gap-x-5 items-center">
              <div className="flex h-12 w-12 border-[0.5px] border-[#CDC9C9] rounded-lg items-center justify-center p-3 shadow-inner drop-shadow-lg">
                {/* Render icon as component */}
                <card.icon className="text-black text-xl" />
              </div>
              <p className="font-bold text-[20px]">{card.label}</p>
            </div>
            <div className="flex gap-x-6 justify-center items-center">
              <p
                className="font-bold text-[14px] "
                style={{ color: card.percentageColor }}
              >
                {/* <ArrowUpwardOutlinedIcon
                  style={{ fontSize: "20px" }}
                  className="mr-1"
                /> */}
                {card.percentage}
              </p>
              <p
                className="font-bold text-[15px] flex justify-end"
                style={{ color: card.countColor }}
              >
                {card.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCardComponent;
