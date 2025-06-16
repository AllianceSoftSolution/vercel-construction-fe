import { Box, Typography } from "@mui/material";
import React from "react";

export default function DashboardCard({ title, value, subTitle }) {
  return (
    <Box className="w-full bg-white h-[170px] p-4 border rounded-[8px]">
      <div className="mb-5">
        <Typography className=" text-[14px]">{title}</Typography>
      </div>
      <h1 className="text-[22px] font-[700]">{value}</h1>
      <div className="mt-5">
        <Typography className="text-[#00000080] overflow-hidden overflow-ellipsis">
          {subTitle}
        </Typography>
      </div>
    </Box>
  );
}
