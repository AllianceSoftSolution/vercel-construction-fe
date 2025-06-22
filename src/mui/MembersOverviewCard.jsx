import React, { useState } from "react";
import DropdownButton from "../comments/components/DropdownButton";
import AddMemberModal from "../layouts/admin-dashboard/screens/users/modals/AddMemberModal";
import AssignProjectManagerModal from "../components/AssignProjectManagerModal";
import Button from "../components/Button";
import { Box, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  boxShadow: 24,
};
const MembersOverviewCard = ({
  title = "General Information",
  subTitle = "",
  linkText = "",
  onLinkClick = () => {},
  imageSrc = "",
  imageAlt = "",
  className = "",
  onManagerClick
}) => {
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div
      className={`border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 w-[50%] h-fit mt-6 ${className}`}
    >
      <div className="flex justify-between">
        <h3 className="text-[#BF1017] text-xl font-semibold">
          {title}
          {subTitle && ` - ${subTitle}`}
        </h3>
        {linkText && (
          // <button onClick={onLinkClick} className="text-primary underline">
          //   {linkText}
          // </button>
          <>
          
            <button onClick={handleOpen} className="text-primary underline" >{linkText}</button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <AssignProjectManagerModal onManagerClick={onManagerClick}  onCreateClick={(bool)=>{setShowModal(bool) ; setOpen(false)}}/>
              </Box>
            </Modal>
          </>
        )}
        {Boolean(showModal) && (
          <AddMemberModal onClose={() => setShowModal(false)} />
        )}
      </div>
      {imageSrc && (
        <div className="flex justify-center">
          <img src={imageSrc} alt={imageAlt} className="w-[40%] h-[40%]" />
        </div>
      )}
    </div>
  );
};

export default MembersOverviewCard;
