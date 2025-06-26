import React, { useState } from "react";
import Profile from "../../../../../assets/construction/profile.png";
import { FaEye, FaUserEdit, FaBan } from "react-icons/fa";
import { RiDeleteBin5Fill, RiFileEditFill } from "react-icons/ri";
import { IoPersonCircle } from "react-icons/io5";
import AddNoteModal from "../modals/AddNoteModal";

// ActionModal component accepts a dynamic list of actions
const ActionModal = ({
  user = {},
  actions = [],
  showProfile = {},
  buttonText = "",
  onButtonClick,
}) => {
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  const handleAction = (action) => {
    if (action.type === "addNote") {
      setShowAddNoteModal(true);
    } else if (action.onClick) {
      action.onClick();
    }
  };

  return (
    <div className="flex flex-col gap-y-3">
      {showProfile && (
        <div className="flex items-center justify-between gap-x-7">
          <div className="flex items-center gap-x-2">
            <img src={Profile} alt="Profile" />
            <h3>{user?.name || "John Smith"}</h3>
          </div>
          <FaEye className="cursor-pointer" />
        </div>
      )}
      <button
        className="bg-[#222222]  px-12 py-2 rounded-full font-medium text-white "
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
      {actions.map((action, index) => (
        <React.Fragment key={action.type}>
          {index !== 0 && <div className="h-[1px] bg-[#CDCDCD]"></div>}
          <div
            className="flex items-center gap-x-2 cursor-pointer"
            onClick={() => handleAction(action)}
          >
            {action.icon}
            <p className="font-medium">{action.label}</p>
          </div>
        </React.Fragment>
      ))}

      {actions.some((a) => a.type === "note") && (
        <>
          <div className="h-[1px] bg-[#CDCDCD]"></div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#222222]">Note</p>
            <RiFileEditFill className="text-primary" />
          </div>
          <div className="flex justify-center">
            <p className="text-[#B0B0B0]">Note is empty</p>
          </div>
        </>
      )}

      {showAddNoteModal && (
        <AddNoteModal onClose={() => setShowAddNoteModal(false)} />
      )}
    </div>
  );
};

export default ActionModal;
