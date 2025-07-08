import React, { useEffect, useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../../../api/apiClient";
import toast from "react-hot-toast";

const SectionTab = ({ data }) => {
  const { id } = useParams();
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const navigate = useNavigate();
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(false);

  const actions = [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: () =>
        navigate("/admin-dashboard/project-management/sections/123"),
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
    <div className="w-full">
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonText="Create Project Section"
        onButtonClick={() =>
          navigate(`/admin-dashboard/project-management/createProject?id=${id}`)
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />
      <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {data?.map((sec, index) => (
          <SectionCard
            key={sec?.id}
            sectionNo={index + 1}
            sectionName={sec?.name}
            code={sec?.code}
            description={sec.description}
            dropdownActions={actions}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionTab;
