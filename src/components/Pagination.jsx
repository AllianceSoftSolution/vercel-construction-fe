import React from "react";
import { Box, Typography } from "@mui/material";
import clsx from "clsx";

export const getVisiblePaginationPages = (currentPage, totalPages, delta = 1) => {
  if (totalPages <= 1) return totalPages ? [1] : [];

  const pages = new Set([1, totalPages]);
  for (
    let page = Math.max(2, currentPage - delta);
    page <= Math.min(totalPages - 1, currentPage + delta);
    page += 1
  ) {
    pages.add(page);
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const visiblePages = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];
    if (previousPage && page - previousPage > 1) {
      visiblePages.push("ellipsis");
    }
    visiblePages.push(page);
  });

  return visiblePages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const visiblePages = getVisiblePaginationPages(currentPage, totalPages);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        flexWrap: "wrap",
        mt: 6,
        gap: 1,
      }}
    >
      <Typography sx={{ color: "#232638", fontSize: "14px", mr: 1 }}>
        Page {currentPage} of {totalPages}
      </Typography>
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
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
      {visiblePages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex aspect-square w-[35px] items-center justify-center text-sm text-[#505470]"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={clsx("aspect-square w-[35px] rounded-md", {
              "bg-[#0074bd] text-white": page === currentPage,
              "border-[2px] border-[#EFF0F4] text-[#505470]":
                page !== currentPage,
            })}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
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
