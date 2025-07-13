import React, { useEffect, useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import Loader from "../../../../../components/ui/Loader";
import { FaTrash, FaUserEdit, FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../../../api/apiClient";
import toast from "react-hot-toast";
import DeleteModal from "../../../../../mui/DeleteModal";

const SectionTab = ({ data, onSectionDeleted }) => {
  const { id } = useParams();
  const [hasMemberInfo, sethasMemberInfo] = useState(false);
  const navigate = useNavigate();
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const deleteSection = async (sectionId) => {
    try {
      setLoading(true);
      const response = await apiClient.delete(`/sections/${sectionId}`);
      if (response.ok) {
        if (typeof onSectionDeleted === 'function') onSectionDeleted();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {loading && <Loader />}
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
        {data?.map((sec, index) => {
          const actions = [
            {
              label: "View Section Detail",
              icon: <FaEye />,
              onClick: () =>
                navigate(
                  `/admin-dashboard/project-management/sections/${sec.id}`
                ),
            },
            {
              label: "Edit Project Section",
              icon: <FaUserEdit />,
              onClick: () => console.log(`Edit clicked for section ${sec.id}`),
            },
            {
              label: "Delete Project Section",
              icon: <FaTrash />,
              onClick: () => {
                setSelectedSectionId(sec.id);
                setShowDeleteModal(true);
              },
            },
          ];

          return (
            <SectionCard
              key={sec?.id}
              sectionNo={index + 1}
              sectionName={sec?.name}
              code={sec?.code}
              description={sec.description}
              dropdownActions={actions}
            />
          );
        })}
      </div>
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await deleteSection(selectedSectionId);
            setShowDeleteModal(false);
            setSelectedSectionId(null);
          }}
        />
      )}
    </div>
  );
};

export default SectionTab;
