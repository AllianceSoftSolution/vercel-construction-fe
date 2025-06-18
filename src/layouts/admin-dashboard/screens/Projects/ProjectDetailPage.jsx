import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import ProjectInfoCard from "../../../../components/ui/ProjectInfoCard";
import ProjectDescriptionCard from "../../../../components/ui/ProjectDescriptionCard";
import MemebersOverviewCard from "../../../../mui/MembersOverviewCard";
import Search from "../../../../assets/construction/Search.png";
import MemberInfoCard from "../../../../mui/MemberInfoCard";
import manager from "../../../../assets/construction/manager.png";

const ProjectDetailPage = () => {
  const navigate = useNavigate();

  const hasMemberInfo = false;

  return (
    <div>
      <TopBar
        title="Project Details"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
        buttonText="Create Project"
        onButtonClick={() =>
          navigate("/admin-dashboard/project-management/addProject")
        }
      />

      <ProjectInfoCard
        title="Project Information"
        status="IN-PROGRESS"
        onDelete={() => console.log("delete")}
        onEdit={() => console.log("edit")}
        projectName="Project Name Here"
        projectCode="123"
        section="4"
        amount="$12333"
        date="12/04/2025"
        projectLocation="United Kingdom 11 street Real Estate London"
        projectStatus="IN-PROGRESS"
      />

      <ProjectDescriptionCard
        title="Project Description"
        description={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...`}
        onEdit={() => console.log("edit description")}
      />

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
          // flag={ukFlag}
          linkedStores={["Store A", "Store B", "Store C"]}
        />
      ) : (
        <MemebersOverviewCard
          title="General Information"
          subTitle="Project Manager"
          linkText="Assign Project Manager"
          onLinkClick={() => alert("Link clicked!")}
          imageSrc={Search}
          imageAlt="Search Illustration"
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;
