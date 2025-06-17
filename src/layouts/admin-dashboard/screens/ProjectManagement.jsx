import React from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";

const ProjectManagement = () => {
  const data = [
    {
      id: 1,
      no: "1",
      projectName: "Bridge Construction",
      code: 9909,
      location: "London",
      section: "A1",
      amount: 120000,
      status: "Pending",

      date: "2025-06-15",
    },
    {
      id: 2,
      no: "2",
      projectName: "Highway Expansion",
      code: 9909,
      location: "New York",
      section: "B2",
      amount: 2500000,
      status: "Approved",
      date: "2025-06-14",
    },
    {
      id: 3,
      no: "3",
      projectName: "Metro Rail",
      code: 9909,
      location: "Paris",
      section: "C3",
      amount: 3000000,
      status: "In Progress",
      date: "2025-06-13",
    },
  ];
  const columns = [
    { headerName: "No", field: "no" },
    { headerName: "Project Name", field: "projectName" },
    { headerName: "Code", field: "code" },
    { headerName: "Location", field: "location" },
    { headerName: "Sections", field: "section" },
    { headerName: "Construction Amount", field: "amount" },
    { headerName: "Status", field: "status" },
    { headerName: "Date", field: "date" },
  ];
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        title="Project Management"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        showFilter={true}
        buttonText="Create Project"
        onButtonClick={() =>
          navigate("/admin-dashboard/user-management/addUser")
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
    </div>
  );
};

export default ProjectManagement;
