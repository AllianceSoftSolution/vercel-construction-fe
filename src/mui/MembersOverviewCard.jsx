import React, { useState } from "react";
import DropdownButton from "../comments/components/DropdownButton";
import AddMemberModal from "../layouts/admin-dashboard/screens/users/modals/AddMemberModal";

const MembersOverviewCard = ({
  title = "General Information",
  subTitle = "",
  linkText = "",
  onLinkClick = () => {},
  imageSrc = "",
  imageAlt = "",
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);

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
          // <button onClick={onLinkClick} className="text-primary underline">
          //   {linkText}
          // </button>
          <DropdownButton
            className=" "
            items={[
              { _id: "1234", name: "Ahad Ali" },
              { _id: "12324", name: "Hassan" },
              { _id: "12234", name: "Ahmad" },
            ].map(({ _id, name }) => ({
              label: name,
              onClick: () => setShowModal(_id),
            }))}
          >
            {linkText}
          </DropdownButton>
        )}
        {Boolean(showModal) && (
          <AddMemberModal onClose={() => setShowModal(false)} />
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
