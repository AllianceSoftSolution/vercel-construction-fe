import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const BackButton = () => {
  const nav = useNavigate();
  return (
    <IconButton
      onClick={() => {
        nav(-1);
      }}
    >
      <IoArrowBack />
    </IconButton>
  );
};

export default BackButton;
