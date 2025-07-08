import React, { useEffect, useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../../api/apiClient";
import toast from "react-hot-toast";

const SectionTab = () => {
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const navigate = useNavigate();
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSection = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/sections");
      if (response.ok) {
        const data = response.data.sections.map((section, index) => ({
          ...section,
        }));
        setSection(data);
      } else {
        toast.error("Failed to fetch section");
      }
    } catch (error) {
      console.error("Error fetching section:", error);
      toast.error("Error fetching section");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const actions = [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: () =>
        navigate("/admin-dashboard/project-management/sections/123"),
    },
  ];

  return (
    <div className="w-full">
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />
      <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {section.map((sec, index) => (
          <SectionCard
            key={sec.id}
            sectionNo={index + 1}
            sectionName={sec.name}
            code={sec.code}
            description={sec.description}
            projectId={sec.projectId}
            dropdownActions={actions}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionTab;
