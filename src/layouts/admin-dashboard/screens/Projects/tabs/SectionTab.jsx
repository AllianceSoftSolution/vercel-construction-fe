import React from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import SectionDetailPage from "../SectionDetailPage";
import { useNavigate } from "react-router-dom";
const SectionTab = () => {
  const navigate = useNavigate();
  const actions = [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: () => navigate("123"),
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
    <div>
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonText="Create Project Section"
        onButtonClick={() =>
          navigate("/admin-dashboard/project-management/addProject")
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <div className="flex justify-between gap-x-2">
        <SectionCard
          sectionNo="01"
          sectionName="Piles"
          totalDemands="14"
          manager="Imran"
          linkedStores="01"
          dropdownActions={actions}
        />
        <SectionCard
          sectionNo="01"
          sectionName="Piles"
          totalDemands="14"
          manager="Imran"
          linkedStores="01"
          dropdownActions={actions}
        />
      </div>{" "}
      <SectionDetailPage />
    </div>
  );
};

export default SectionTab;
