import React, { useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CmSectionTab = ({ data }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Placeholder for delete logic
  const handleDelete = (sectionId) => {
    setSelectedSectionId(sectionId);
    setShowDeleteModal(true);
    // Here you would call your API to delete the section
    // and refresh the list after successful deletion
  };

  return (
    <div className="w-full">
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {data?.map((sec, index) => {
          const actions = [
            {
              label: "View Section Detail",
              icon: <FaEye />,
              onClick: () => navigate(`/construction-manager-dashboard/sections/${sec.id}`),
            },
            {
              label: "Edit Project Section",
              icon: <FaUserEdit />,
              onClick: () => console.log(`Edit clicked for section ${sec.id}`),
            },
            {
              label: "Delete Project Section",
              icon: <FaTrash />,
              onClick: () => handleDelete(sec.id),
            },
          ];
          return (
            <SectionCard
              key={sec.id}
              sectionNo={index + 1}
              sectionName={sec.name}
              code={sec.code}
              description={sec.description}
              dropdownActions={actions}
            />
          );
        })}
      </div>
      {/*
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            // await deleteSection(selectedSectionId);
            setShowDeleteModal(false);
            setSelectedSectionId(null);
          }}
        />
      )}
      */}
    </div>
  );
};

export default CmSectionTab;
