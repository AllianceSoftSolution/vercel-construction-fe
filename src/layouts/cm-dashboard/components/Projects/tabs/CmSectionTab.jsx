import React, { useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import SectionDetailPage from "../CmSectionDetailPage";
import { useNavigate } from "react-router-dom";

const CmSectionTab = () => {
  const [hasMemberInfo, sethasMemberInfo] = useState(false);

  // const [showModal, setShowModal] = useState(false);

  // const handleLinkClick = () => {
  //   setShowModal(true);
  // };
  const navigate = useNavigate();
  const actions = [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: () => navigate("/construction-manager-dashboard/sections/23232"),
    },
  ];
  return (
    <div>
      <TopBar
        title="Project Sections"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
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
      {/* Modal */}
      {/* {showModal && <AddMemberModal onClose={() => setShowModal(false)} />} */}
      {/* <SectionDetailPage /> */}
    </div>
  );
};

export default CmSectionTab;
