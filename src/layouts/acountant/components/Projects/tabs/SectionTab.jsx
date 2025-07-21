import React, { useEffect, useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../../../../api/apiClient";
import Loader from "../../../../../components/ui/Loader";
const SectionTab = ({ data }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

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

  // Set pageLoading to false when data is available
  React.useEffect(() => {
    if (data) {
      setPageLoading(false);
    }
  }, [data]);

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <TopBar
        title="Project Sections"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      <div className="flex justify-between gap-x-2">
        <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {data?.sections?.map((sec, index) => (
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
      </div>
      {/* Modal */}
      {/* {showModal && <AddMemberModal onClose={() => setShowModal(false)} />} */}
    </div>
  );
};

export default SectionTab;
