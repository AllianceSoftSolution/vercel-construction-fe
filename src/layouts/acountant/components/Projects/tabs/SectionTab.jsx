import React, { useEffect, useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../../../../api/apiClient";

const SectionTab = () => {
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [hasMemberInfo, sethasMemberInfo] = useState(false);

  // const [showModal, setShowModal] = useState(false);

  // const handleLinkClick = () => {
  //   setShowModal(true);
  // };
  const navigate = useNavigate();

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

  // const actions = [
  //   // {
  //   //   label: "View Section Detail",
  //   //   icon: <FaEye />,
  //   //   // onClick: () => navigate("/accountant-dashboard/sections/:id"),
  //   // },
  //   {
  //     label: "Edit Project Section",
  //     icon: <FaUserEdit />,
  //     onClick: () => console.log("Edit clicked"),
  //   },
  //   {
  //     label: "Delete Project Section",
  //     icon: <FaTrash />,
  //     onClick: () => console.log("Delete clicked"),
  //   },
  // ];
  return (
    <div>
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <div className="flex justify-between gap-x-2">
        <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {section.map((sec, index) => (
            <SectionCard
              key={sec.id}
              sectionNo={index + 1}
              sectionName={sec.name}
              code={sec.code}
              description={sec.description}
              projectId={sec.projectId}
              // dropdownActions={actions}
            />
          ))}
        </div>
      </div>{" "}
      {/* Modal */}
      {/* {showModal && <AddMemberModal onClose={() => setShowModal(false)} />} */}
    </div>
  );
};

export default SectionTab;
