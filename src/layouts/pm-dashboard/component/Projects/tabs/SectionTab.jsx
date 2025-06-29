import React, { useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import SectionDetailPage from "../SectionDetailPage";

const SectionTab = () => {
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: () => navigate("/project-manager-dashboard/project-management/sections/:id"),
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
    <div className="p-2 sm:p-4">
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonText="Create Project Section"
        onButtonClick={() =>
          navigate("/project-manager-dashboard/project-management/addProject")
        }
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <div className="flex gap-5 lg:flex-row flex-col ">
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

export default SectionTab;
