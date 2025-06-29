import React, { useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SectionTab = () => {
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: () => navigate("/admin-dashboard/project-management/sections/:id"),
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
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 w-full">
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonText="Create Project Section"
        onButtonClick={() =>
          navigate("/admin-dashboard/project-management/addProject")
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SectionCard
          sectionNo="01"
          sectionName="Piles"
          totalDemands="14"
          manager="Imran"
          linkedStores="01"
          dropdownActions={actions}
        />
        <SectionCard
          sectionNo="02"
          sectionName="Beams"
          totalDemands="10"
          manager="Ali"
          linkedStores="02"
          dropdownActions={actions}
        />
        <SectionCard
          sectionNo="03"
          sectionName="Columns"
          totalDemands="9"
          manager="Sara"
          linkedStores="03"
          dropdownActions={actions}
        />
      </div>
    </div>
  );
};

export default SectionTab;
