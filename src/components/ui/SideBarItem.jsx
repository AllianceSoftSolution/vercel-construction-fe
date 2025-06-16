import React from "react";

function CustomSidebarItem({
  iconSrc,
  text,
  iconSize = "5",
  textSize = "text-sm",
  bgColor = "",
  textColor = "black",
  onClick,
  isActive = false,
}) {
  const baseBgColor = isActive ? "bg-primary" : "bg-[#EBEBEB]";
  const hoverBgColor = bgColor ? `hover:bg-[${bgColor}]` : "hover:bg-primary  ";
  const baseTextColor = isActive ? "text-white" : `text-${textColor}`;
  // const hoverTextColor = "hover:text-white";

  return (
    <div
      className={`rounded-[10px] mt-6 p-4 flex items-center justify-between cursor-pointer ${baseBgColor} ${hoverBgColor} ${baseTextColor}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div
          className={`h-${iconSize} w-${iconSize} flex items-center justify-center`}
        >
          {iconSrc}
        </div>

        <span
          className={`ml-3 font-medium text-[18px] ${textSize} ${baseTextColor}`}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

export default CustomSidebarItem;
