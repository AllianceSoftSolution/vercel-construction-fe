import React from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SectionTab = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />
      <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {data?.map((sec, index) => {
          const actions = [
            {
              label: "View Section Detail",
              icon: <FaEye />,
              onClick: () =>
                navigate(`/project-manager-dashboard/project-Management/sections/${sec.id}`),
            },
          ];
          return (
            <SectionCard
              key={sec.id}
              sectionNo={index + 1}
              sectionName={sec.name}
              code={sec.code}
              description={sec.description}
              projectId={sec.projectId}
              dropdownActions={actions}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SectionTab;
