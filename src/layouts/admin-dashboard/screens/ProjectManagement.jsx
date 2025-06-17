import React from "react";
import TopBar from "../../../components/ui/TopBar";

const ProjectManagement = () => {
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        title="User Management"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
        showFilter={true}
        buttonText="Create New User"
        onButtonClick={() =>
          navigate("/admin-dashboard/user-management/addUser")
        }
      />
    </div>
  );
};

export default ProjectManagement;
