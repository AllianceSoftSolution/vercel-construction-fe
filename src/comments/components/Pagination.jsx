import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import clsx from "clsx";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      // alert(currentPage)
      onPageChange(page);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        mt: 6,
        gap: 1,
      }}
    >
      <Typography sx={{ color: "#232638", fontSize: "14px" }}>
        {currentPage} - {totalPages} of items
      </Typography>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "aspect-square w-[35px] rounded-md border-[2px] border-[#EFF0F4]",
          {
            "text-[#C4C4C4]": currentPage === 1,
            "text-[#353849]": currentPage !== 1,
          }
        )}
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          variant={index + 1 === currentPage ? "contained" : "outlined"}
          className={clsx("aspect-square w-[35px] rounded-md ", {
            "bg-[#0074bd] text-white": index + 1 === currentPage,
            "border-[2px] border-[#EFF0F4] text-[#505470]":
              index + 1 !== currentPage,
          })}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          "aspect-square w-[35px] rounded-md border-[2px] border-[#EFF0F4] ",
          {
            "text-[#C4C4C4]": currentPage === totalPages,
            "text-[#353849]": currentPage !== totalPages,
          }
        )}
      >
        &gt;
      </button>
    </Box>
  );
};

export default Pagination;
