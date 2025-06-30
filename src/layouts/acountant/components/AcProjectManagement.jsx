import React, { useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import ActionModal from "./users/modals/ActionModal";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";

const AcProjectManagement = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleActionClick = () => {
    setShowModal(true);
  };
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
      action: "id-here",
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
      action: "id-here",
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
      action: "id-here",
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
    { headerName: "Action", field: "action" },
  ];
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail Page",
            onClick: () => navigate("123"),
            icon: <FaEye />,
          },
        ]}
        // onClick={handleActionClick}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };
  return (
    <div className="h-full">
      <TopBar
        title="Project Management"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        showFilter={true}
        filterOptions={["Completed", "In-Progress", "Cancelled"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={data}
          cellComponents={{ action: CustomActionComponent }}
          // showCheckbox={true}
        />
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl relative">
            <button
              className="absolute top-2 right-3 text-lg font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <ActionModal
              showProfile={false}
              buttonText="View Project Details"
              onButtonClick={() => navigate("123")}
              actions={[
                {
                  type: "edit",
                  icon: <FaUserEdit />,
                  label: "Edit",
                  onClick: () => console.log("Edit clicked"),
                },
                {
                  type: "delete",
                  icon: <RiDeleteBin5Fill />,
                  label: "Delete",
                  onClick: () => console.log("Delete clicked"),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AcProjectManagement;
