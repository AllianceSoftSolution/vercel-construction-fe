import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DashedLineSVG from "./DashedLineSVG";
import Pagination from "./Pagination";
import NoTableDataFound from "./NoTableDataFound";

// Custom styling for the Table component
const StyledTable = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-head": {
    color: "#130901",
    fontWeight: "600",
    textWrap: "nowrap",
    backgroundColor: "#fff",
    "&:first-of-type": {
      borderTopLeftRadius: "0px",
      borderBottomLeftRadius: "0px",
    },
    "&:last-of-type": {
      borderTopRightRadius: "0px",
      borderBottomRightRadius: "0px",
    },
  },
  "& .MuiTableRow-root": {
    backgroundColor: "transparent",
  },
  "& .MuiTableCell-root": {
    borderBottom: `none`,
  },
  "& .MuiTableCell-body": {
    color: "#130901",
  },
}));

// Custom styling for the TableContainer component
const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  overflowX: "auto",
  borderRadius: 0,
  "@media (max-width: 900px)": {
    "& .MuiTable-root": {
      minWidth: "900px",
    },
  },
}));

// Custom checkbox styles
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: "#D4D4D4",
  "&.Mui-checked": {
    color: "#0074bd",
  },
  "&.MuiCheckbox-indeterminate": {
    color: "#0074bd",
  },
}));

// Helper function to access nested values using dot notation
const getNestedValue = (obj, path, showNA) => {
  const value = path.split(".").reduce((acc, part) => acc && acc[part], obj);
  return value === undefined || value === null ? (showNA ? "N/A" : "") : value;
};

// Component for rendering custom cell content
const CellContent = ({ value, index, CustomComponent }) => {
  if (CustomComponent) {
    return <CustomComponent value={value} index={index} />;
  } else if (typeof value === "object" && value !== null) {
    return <div>{JSON.stringify(value)}</div>;
  } else {
    return <div>{value}</div>;
  }
};

const SimpleTable = ({
  data,
  columns,
  customStyles,
  cellComponents,
  showCheckbox,
  headBodySpace,
  headerStyles,
  showNA, // New prop to control "N/A" display
  config,
  recordsPerPage = 10,
}) => {
  console.log("Data ssstttt", data);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const rowsPerPage = recordsPerPage;
  let totalPages = 0;
  let paginatedData =
    data?.length > 0 &&
    data?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  if (config?.totalPages) {
    totalPages = config.totalPages;
  } else {
    totalPages = Math.ceil((data?.length || 0) / rowsPerPage);
  }
  useEffect(() => {
    console.log("i am current page from , simple table", config?.currentPage);
    if (config) {
      setCurrentPage(config?.currentPage);
    }
    paginatedData = data;
  }, [data]);

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    if (config?.onPageChange) {
      await config.onPageChange(page);
      config?.setPage(page);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(new Set(data.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(id)) {
        newSelectedRows.delete(id);
      } else {
        newSelectedRows.add(id);
      }
      return newSelectedRows;
    });
  };

  const isAllSelected =
    showCheckbox &&
    paginatedData?.length > 0 &&
    paginatedData?.every((row) => selectedRows.has(row.id));

  const isIndeterminate =
    showCheckbox &&
    paginatedData?.length > 0 &&
    paginatedData?.some((row) => selectedRows.has(row.id)) &&
    !isAllSelected;

  return (
    <Box sx={{ ...customStyles }}>
      <CustomTableContainer component={Paper} elevation={0}>
        <StyledTable
          sx={{
            "& .MuiTableCell-head": headerStyles,
          }}
        >
          <TableHead>
            <TableRow>
              {showCheckbox && (
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {headBodySpace && (
              <TableRow
                sx={{ height: "25px", backgroundColor: "transparent" }}
              ></TableRow>
            )}
            {config &&
              data.length > 0 &&
              data?.map((row, rowIndex) => (
                <React.Fragment key={row.id}>
                  <TableRow>
                    {showCheckbox && (
                      <TableCell padding="checkbox">
                        <CustomCheckbox
                          checked={selectedRows.has(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        <CellContent
                          index={rowIndex}
                          value={getNestedValue(
                            row,
                            column.field,
                            showNA // Pass showNA prop to getNestedValue
                          )}
                          CustomComponent={cellComponents[column.field]}
                          row={row}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (showCheckbox ? 1 : 0)}
                      padding="none"
                    >
                      <DashedLineSVG
                        width="100%"
                        height="0.8px"
                        dashWidth="7"
                        spaceWidth="5"
                      />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}

            {!config &&
              paginatedData.length > 0 &&
              paginatedData?.map((row, rowIndex) => (
                <React.Fragment key={row.id}>
                  <TableRow>
                    {showCheckbox && (
                      <TableCell padding="checkbox">
                        <CustomCheckbox
                          checked={selectedRows.has(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        <CellContent
                          index={rowIndex}
                          value={getNestedValue(
                            row,
                            column.field,
                            showNA // Pass showNA prop to getNestedValue
                          )}
                          CustomComponent={cellComponents[column.field]}
                          row={row}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (showCheckbox ? 1 : 0)}
                      padding="none"
                    >
                      <DashedLineSVG
                        width="100%"
                        height="0.8px"
                        dashWidth="7"
                        spaceWidth="5"
                      />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </StyledTable>
      </CustomTableContainer>
      {totalPages === 0 && <NoTableDataFound />}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default React.memo(SimpleTable);
