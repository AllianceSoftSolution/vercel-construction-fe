import React from "react";

const MembersOverviewCard = ({
  title = "General Information",
  subTitle = "",
  linkText = "",
  onLinkClick = () => {},
  imageSrc = "",
  imageAlt = "",
  className = "",
}) => {
  return (
    <div
      className={`border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 w-[50%] h-fit mt-6 ${className}`}
    >
      <div className="flex justify-between">
        <h3 className="text-[#BF1017] text-xl font-semibold">
          {title}
          {subTitle && ` - ${subTitle}`}
        </h3>
        {linkText && (
          <button onClick={onLinkClick} className="text-primary underline">
            {linkText}
          </button>
        )}
      </div>
      {imageSrc && (
        <div className="flex justify-center">
          <img src={imageSrc} alt={imageAlt} className="w-[40%] h-[40%]" />
        </div>
      )}
    </div>
  );
};

export default MembersOverviewCard;
