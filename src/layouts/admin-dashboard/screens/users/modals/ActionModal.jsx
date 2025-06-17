import React, { useState } from "react";
import Profile from "../../../../../assets/construction/profile.png";
import { FaEye } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaBan } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { RiFileEditFill } from "react-icons/ri";
import AddNoteModal from "../modals/AddNoteModal";
const ActionModal = () => {
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

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
        <button
          className="bg-buttonColor text-white py-2 w-full rounded-3xl"
          onClick={() => setShowAddNoteModal(true)}
        >
          Add Note
        </button>
      </div>
      <div className="h-[1px] bg-[#CDCDCD]"></div>
      <div className="flex items-center gap-x-2">
        <FaUserEdit />
        <p className="font-medium">Edit</p>
      </div>
      <div className="h-[1px] bg-[#CDCDCD]"></div>
      <div className="flex items-center gap-x-2">
        <RiDeleteBin5Fill />
        <p className="font-medium">Delete</p>
      </div>{" "}
      <div className="h-[1px] bg-[#CDCDCD]"></div>
      <div className="flex items-center gap-x-2">
        <IoPersonCircle />
        <p className="font-medium">Ban</p>
      </div>
      <div className="h-[1px] bg-[#CDCDCD]"></div>
      <div className="flex items-center gap-x-2">
        <FaBan />
        <p className="font-medium">Suspend Account</p>
      </div>
      <div className="h-[1px] bg-[#CDCDCD]"></div>
      <div className="flex items-center justify-between gap-x-2">
        <p className="font-medium text-[#222222]">Note</p>
        <RiFileEditFill className="text-primary" />
      </div>
      <div className="flex justify-center">
        <p className="text-[#B0B0B0]">Note is empty</p>
      </div>
      {showAddNoteModal && (
        <AddNoteModal onClose={() => setShowAddNoteModal(false)} />
      )}
    </div>
  );
};

export default ActionModal;
