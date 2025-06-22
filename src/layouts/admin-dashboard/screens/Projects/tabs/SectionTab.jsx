import React, { useState } from "react";
import TopBar from "../../../../../components/ui/TopBar";
import SectionCard from "../../../../../components/ui/SectionCard";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import SectionDetailPage from "../SectionDetailPage";
import { useNavigate } from "react-router-dom";
import MemebersOverviewCard from "../../../../../mui/MembersOverviewCard";
import MemberInfoCard from "../../../../../mui/MemberInfoCard";
import manager from "../../../../../assets/construction/manager.png";
import Search from "../../../../../assets/construction/Search.png";
import AddMemberModal from "../../users/modals/AddMemberModal";
import DropdownButton from "../../../../../comments/components/DropdownButton";
import CustomModal from "../../../../../comments/components/CustomModal";
import { Box, Modal, Typography } from "@mui/material";
import Button from "../../../../../components/Button";
import AssignProjectManagerModal from "../../../../../components/AssignProjectManagerModal";
import { Height } from "@mui/icons-material";


const SectionTab = () => {
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
      onClick: () => navigate("/admin-dashboard/sections/:id"),
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
      <h4 className="mt-8 text-[#12141D] font-semibold text-xl">
        Members Overview
      </h4>
      {hasMemberInfo ? (
        <MemberInfoCard
          title="General information - Store Head"
          image={manager}
          name="Manager name here"
          phone="+92 300 000 090"
          role="Store Head"
          email="example@gmail.com"
          joiningDate="January 8, 2001"
          id="9090"
          address="addresshere"
          country="United State"
          linkedStores={["Store A", "Store B", "Store C"]}
        />
      ) : (
        <MemebersOverviewCard
          title="General Information"
          subTitle="Project Manager"
          linkText="Assign Project Manager"
          // onLinkClick={handleLinkClick}
          imageSrc={Search}
          imageAlt="Search Illustration"
          onManagerClick={(id)=>sethasMemberInfo(id)}
        />
      )}
      {/* Modal */}
      {/* {showModal && <AddMemberModal onClose={() => setShowModal(false)} />} */}
      {/* <SectionDetailPage /> */}
    </div>
  );
};

export default SectionTab;
