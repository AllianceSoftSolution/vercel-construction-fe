import React, { useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SInchargeSectionTab = () => {
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: () => navigate("/siteincharge-dashboard/project-management/sections/23232"),
    },
    {
      label: "Edit Project Section",
      icon: <FaUserEdit />,
      onClick: () => console.log("Edit clicked"),
    },
    {
      label: "Delete Project Section",
      icon: <FaTrash />,
      onClick: () => console.log("Delete clicked"),
    },
  ];

  return (
    <div className="px-4 py-4 md:px-6 w-full">
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonText="Create Project Section"
        onButtonClick={() =>
          navigate("/siteincharge-dashboard/project-management/createSection")
        }
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <SectionCard
          sectionNo="01"
          sectionName="Piles"
          totalDemands="14"
          totalAmount="340$"
          paidAmount="567$"
          remainingAmount="9384$"
          manager="Imran"
          linkedStores="01"
          dropdownActions={actions}
        />
        <SectionCard
          sectionNo="01"
          sectionName="Piles"
          totalDemands="14"
          totalAmount="340$"
          paidAmount="567$"
          remainingAmount="9384$"
          manager="Imran"
          linkedStores="01"
          dropdownActions={actions}
        />
      </div>
    </div>
  );
};

export default SInchargeSectionTab;
