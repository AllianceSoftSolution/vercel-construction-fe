import React from "react";
import { MdEdit } from "react-icons/md";

const ProjectDescriptionCard = ({ title, description, onEdit }) => {
  return (
    <div className="bg-[#F7F7F7] rounded-md h-fit mt-4 flex flex-col p-4 gap-y-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-[#444444]">{title}</h3>
        {/* <MdEdit
          onClick={onEdit}
          className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
        /> */}
      </div>

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <p className="text-[#979797] whitespace-pre-line">{description}</p>
    </div>
  );
};

export default ProjectDescriptionCard;
