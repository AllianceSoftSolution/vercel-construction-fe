import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../comments/components/DropdownButton";

const ProjectInfoCard = ({
  title,
  status,
  onDelete,
  onEdit,
  projectName,
  projectCode,
  section,
  amount,
  date,
  projectLocation,
  projectStatus,
  showIcons = true,
  showStatusDropdown = false,
}) => {
  const StatusDropdown = () => (
    <DropdownButton
      className="bg-white border border-gray-300"
      items={[
        {
          label: "Pending",
        },
        {
          label: "Approved",
        },
        {
          label: "Rejected",
        },
      ]}
    >
      <IconButton size="small">
        <BsThreeDotsVertical className="text-white" />
      </IconButton>
    </DropdownButton>
  );

  return (
    <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-[#444444]">{title}</h3>
        <div className="flex gap-x-4 items-center">
          {status && (
            <div className="bg-[#0252AD] text-white px-6 py-2 rounded-full flex items-center gap-2">
              {status}
              {showStatusDropdown && <StatusDropdown />}
            </div>
          )}
          {showIcons && (
            <>
              <MdDelete
                onClick={onDelete}
                className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
              />
              <MdEdit
                onClick={onEdit}
                className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
              />
            </>
          )}
        </div>
      </div>

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <div className="flex justify-between gap-x-4 flex-wrap">
        <div className="flex gap-x-4 items-center">
          <p className="text-[#444444] font-semibold text-xl">Project Name:</p>
          <p className="text-[#979797]">{projectName}</p>
        </div>
        <div className="flex gap-x-4 items-center">
          <p className="text-[#444444] font-semibold text-xl">Project Code:</p>
          <p className="text-[#979797]">{projectCode}</p>
        </div>
        <div className="flex gap-x-4 items-center">
          <p className="text-[#444444] font-semibold text-xl">Section:</p>
          <p className="text-[#979797]">{section}</p>
        </div>
        <div className="flex gap-x-4 items-center">
          <p className="text-[#444444] font-semibold text-xl">Amount:</p>
          <p className="text-[#979797]">{amount}</p>
        </div>
        <div className="flex gap-x-4 items-center">
          <p className="text-[#444444] font-semibold text-xl">Date:</p>
          <p className="text-[#979797]">{date}</p>
        </div>
      </div>

      <div className="flex justify-start gap-x-14 flex-wrap">
        <div className="flex gap-x-4 items-center mt-2">
          <p className="text-[#444444] font-semibold text-xl">
            Project Location:
          </p>
          <p className="text-[#979797]">{projectLocation}</p>
        </div>
        <div className="flex gap-x-4 items-center mt-2">
          <p className="text-[#444444] font-semibold text-xl">
            Project Status:
          </p>
          <p className="text-[#979797]">{projectStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoCard;
