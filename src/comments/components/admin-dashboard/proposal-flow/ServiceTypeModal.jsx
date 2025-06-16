import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import recurringIcon from "@/assets/icons/RecurringIcon.png";
import OneOffIcon from "@/assets/icons/OneOffIcon.png";
import DepositIcon from "@/assets/icons/DepositIcon.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 2,
};

const ServiceTypeModal = ({ open, handleClose, setserviceType }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <div className="w-full flex items-center justify-between">
          <p className="text-[18px] font-medium">What type of Service ?</p>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="w-full grid grid-cols-3 gap-x-1">
          <ServiceTypeCard
            title={"Recurring"}
            bodyText={"Service billed regularly"}
            icon={recurringIcon}
            onSelect={()=>{
              setserviceType('depositServices')
              handleClose()
            }}
          />
          <ServiceTypeCard
            title={"One-Off"}
            bodyText={"Service billed once"}
            icon={OneOffIcon}
            onSelect={()=>{
              setserviceType('oneOffServices')
              handleClose()
            }}
          />
          <ServiceTypeCard
            title={"Deposit"}
            bodyText={"Service billed in multiple schedule"}
            icon={DepositIcon}
            onSelect={()=>{
              setserviceType('recurringServices')
              handleClose()
            }}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default ServiceTypeModal;

const ServiceTypeCard = ({ title, bodyText, icon, onSelect }) => {
  return (
    <div className="col-span-1 flex flex-col items-center text-center leading-tight gap-y-4 cursor-pointer" onClick={()=>onSelect()}>
      <img src={icon} alt="icon" className="w-[30%]" />
      <div>
        <p className="font-semibold">{title}</p>
        <p>{bodyText}</p>
      </div>
    </div>
  );
};
