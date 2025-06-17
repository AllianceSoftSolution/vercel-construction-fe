import React from "react";
import Profile from "../../../../../assets/construction/profile.png";
import { FaEye } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaBan } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";

const ActionModal = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-10">
        <div className="flex items-center gap-x-2">
          <img src={Profile} alt="" />
          <h3>John Smith</h3>
        </div>
        <FaEye />
      </div>
      <div className="flex justify-center">
        <button className="bg-buttonColor text-white py-2 w-full rounded-3xl">
          Add Note
        </button>
      </div>
      <div className="h-[1px] bg-[#CDCDCD]"></div>
      <div className="flex">
        <FaUserEdit />
        <p>Edit</p>
      </div>
    </div>
  );
};

export default ActionModal;
