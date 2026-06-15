import React, { useEffect, useMemo, useState } from "react";
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
import ExportToExcelButton from "./ExportToExcelButton";
import CustomFilterDropdown from "./ui/CustomFilterDropdown";
import { resolveExportFileName } from "../modules/tableExportHelpers";

// Custom styling for the Table component
const StyledTable = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-head": {
    color: "#444444",
    fontWeight: "600",
    whiteSpace: "nowrap",
    backgroundColor: "#EBEBEB",
    border: "1px solid #EBEBEB",
    borderRadius: "7px",
    "&:first-of-type": {
      borderTopLeftRadius: "7px",
      borderBottomLeftRadius: "7px",
    },
    "&:last-of-type": {
      borderTopRightRadius: "7px",
      borderBottomRightRadius: "7px",
    },
  },
  "& .MuiTableRow-root": {
    backgroundColor: "transparent",
    border: "1px solid #ccc",
    borderRadius: "7px",
  },
  "& .MuiTableCell-root": {
    // borderBottom: "none", // remove default bottom border on cells if needed
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
const CellContent = ({ value, index, CustomComponent, row }) => {
  if (CustomComponent) {
    return <CustomComponent value={value} index={index} row={row} />;
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
  cellComponents = {},
  showCheckbox,
  headBodySpace,
  headerStyles,
  showNA,
  config,
  recordsPerPage = 10,
  exportable = true,
  exportFileName = "table-export",
  tableTitle,
  exportContext,
  tableFilters = null,
  filterSelected = {},
  onFilterChange,
  onFilterClear,
  filterPlaceholder = "Filter",
  filterDropdownAlign = "right",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const rowsPerPage = recordsPerPage;
  const isServerPaginated = Boolean(config);

  const safeData = useMemo(() => (data || []).filter(Boolean), [data]);

  const resolvedExportFileName = useMemo(
    () =>
      resolveExportFileName({
        exportFileName,
        tableTitle,
        exportContext,
      }),
    [exportFileName, tableTitle, exportContext],
  );

  const totalPages = useMemo(() => {
    if (isServerPaginated && config?.totalPages) {
      return config.totalPages;
    }
    if (!safeData.length) return 0;
    return Math.max(1, Math.ceil(safeData.length / rowsPerPage));
  }, [isServerPaginated, config?.totalPages, safeData.length, rowsPerPage]);

  const displayData = useMemo(() => {
    if (!safeData.length) return [];
    if (isServerPaginated) return safeData;
    const start = (currentPage - 1) * rowsPerPage;
    return safeData.slice(start, start + rowsPerPage);
  }, [safeData, isServerPaginated, currentPage, rowsPerPage]);

  useEffect(() => {
    if (isServerPaginated && config?.currentPage) {
      setCurrentPage(config.currentPage);
    }
  }, [isServerPaginated, config?.currentPage]);

  useEffect(() => {
    if (!isServerPaginated) {
      setCurrentPage(1);
    }
  }, [safeData.length, isServerPaginated]);

  useEffect(() => {
    if (!isServerPaginated && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, isServerPaginated]);

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    if (config?.onPageChange) {
      await config.onPageChange(page);
      config?.setPage?.(page);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(new Set(safeData.map((row) => row.id)));
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
    displayData.length > 0 &&
    displayData.every((row) => selectedRows.has(row.id));

  const isIndeterminate =
    showCheckbox &&
    displayData.length > 0 &&
    displayData.some((row) => selectedRows.has(row.id)) &&
    !isAllSelected;

  const showFilter = tableFilters && tableFilters.length > 0;
  const showToolbar = exportable || showFilter;

  const renderRow = (row, rowIndex) => (
    <React.Fragment key={row.id ?? rowIndex}>
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
              value={getNestedValue(row, column.field, showNA)}
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
          {headBodySpace || !isServerPaginated ? (
            <DashedLineSVG
              width="100%"
              height="0.8px"
              dashWidth="7"
              spaceWidth="5"
            />
          ) : null}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );

  return (
    <Box sx={{ ...customStyles }}>
      {showToolbar && (
        <div className="flex flex-row flex-wrap items-center justify-end gap-2 sm:gap-3 mb-2">
          {showFilter && (
            <CustomFilterDropdown
              filters={tableFilters}
              selected={filterSelected}
              onChange={onFilterChange}
              onClear={onFilterClear}
              placeholder={filterPlaceholder}
              dropdownAlign={filterDropdownAlign}
              exportData={exportable ? safeData : []}
              exportColumns={exportable ? columns : []}
              exportFileName={resolvedExportFileName}
              exportCellComponents={cellComponents}
            />
          )}
          {exportable && !showFilter && (
            <ExportToExcelButton
              data={safeData}
              columns={columns}
              fileName={resolvedExportFileName}
              cellComponents={cellComponents}
              showNA={showNA}
            />
          )}
        </div>
      )}
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
            {displayData.length > 0 &&
              displayData.map((row, rowIndex) => renderRow(row, rowIndex))}
          </TableBody>
        </StyledTable>
      </CustomTableContainer>
      {safeData.length === 0 && <NoTableDataFound />}
      {safeData.length > 0 && totalPages > 0 && (
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
