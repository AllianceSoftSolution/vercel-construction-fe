import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../comments/components/DropdownButton";

const ProjectInfoCard = ({
  title,

  projectName,
  projectCode,
  sections,
  totalAmountSpent,
  // paidAmount,
  // remainingAmount,
  startDate,
  endDate,
  // projectLocation,
  // projectStatus,
  showIcons = true,
  showStatusDropdown = false,
}) => {
  const StatusDropdown = () => (
    <DropdownButton
      className="bg-white border border-gray-300"
      items={[
        { label: "Pending" },
        { label: "Approved" },
        { label: "Rejected" },
      ]}
    >
      <IconButton size="small">
        <BsThreeDotsVertical className="text-white" />
      </IconButton>
    </DropdownButton>
  );

  return (
    <div className="bg-[#F7F7F7] rounded-md mt-4 p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h3 className="text-xl font-semibold text-[#444444]">{title}</h3>
        {/* <div className="flex flex-wrap gap-2 items-center">
          {status && (
            <div className="bg-[#0252AD] text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm">
              {status}
              {showStatusDropdown && <StatusDropdown />}
            </div>
          )}
          {showIcons && (
            <>
              <MdDelete
                onClick={onDelete}
                className="text-white bg-[#EF0404] w-9 h-9 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
              />
              <MdEdit
                onClick={onEdit}
                className="text-white bg-primary w-9 h-9 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
              />
            </>
          )}
        </div> */}
      </div>

      <div className="h-[1px] bg-[#CDCDCD] w-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
        <Info label="Project Name" value={projectName} />
        <Info label="Project Code" value={projectCode} />
        <Info label="No of Sections" value={sections} />
        <Info label="Start Date" value={startDate} />
        <Info label="End Date" value={endDate} />
        <Info label="Expenditure" value={totalAmountSpent} />
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        <Info label="Project Location" value={projectLocation} />
        <Info label="Project Status" value={projectStatus} />
      </div> */}
    </div>
  );
};

const Info = ({ label, value }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <p className="text-[#444444] font-semibold">{label}:</p>
      <p className="text-[#979797] break-words">{value}</p>
    </div>
  );
};

export default ProjectInfoCard;
