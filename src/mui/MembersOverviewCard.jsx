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
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: 24,
  borderRadius: "1.5rem",
};

const MembersOverviewCard = ({
  title = "General Information",
  subTitle = "",
  linkText = "",
  onLinkClick = () => {},
  imageSrc = "",
  imageAlt = "",
  className = "",
  onManagerClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={`border-[0.5px] border-[#CDC9C9] rounded-2xl p-4 w-full sm:w-[90%] md:w-[75%] lg:w-[50%] lg:h-80 h-full  mt-6 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <h3 className="text-[#BF1017] text-lg sm:text-xl font-semibold">
          {title}
          {subTitle && ` - ${subTitle}`}
        </h3>
        {linkText && (
          <>
            <button onClick={handleOpen} className="text-primary underline text-sm sm:text-base">
              {linkText}
            </button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="bg-white p-4">
                <AssignProjectManagerModal
                  onManagerClick={onManagerClick}
                  onCreateClick={(bool) => {
                    setShowModal(bool);
                    setOpen(false);
                  }}
                />
              </Box>
            </Modal>
          </>
        )}
        {Boolean(showModal) && <AddMemberModal onClose={() => setShowModal(false)} />}
      </div>

      {imageSrc && (
        <div className="flex justify-center mt-4">
          <img src={imageSrc} alt={imageAlt} className="w-2/3 sm:w-1/2 md:w-[40%] h-auto" />
        </div>
      )}
    </div>
  );
};

export default MembersOverviewCard;
