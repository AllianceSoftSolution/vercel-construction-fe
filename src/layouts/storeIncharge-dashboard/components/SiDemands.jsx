import React, { useState, useMemo } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";

const SiDemands = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ Project: [], Section: [] });
  const data = [
    {
      id: 1,
      no: "REF001",
      project: "Bridge Construction",
      material: "Cement",
      section: "A1",
      qty: 120,
      unit: "ton",
      poQty: 100,
      status: "Pending",
      approvedBy: "Owner",
      fulfilled: 12,
      date: "2023-01-01",
      action: "id-here",
    },
    {
      id: 2,
      no: "REF002",
      project: "Highway Expansion",
      material: "Steel",
      section: "B2",
      qty: 250,
      unit: "ton",
      poQty: 100,
      status: "Approved",
      approvedBy: "Site Manager",
      fulfilled: 13,
      date: "2023-01-01",
      action: "id-here",
    },
    {
      id: 3,
      no: "REF003",
      project: "Metro Rail",
      material: "Concrete",
      section: "C3",
      qty: 300,
      unit: "ton",
      poQty: 100,
      status: "In Progress",
      approvedBy: "Owner",
      fulfilled: 12,
      date: "2023-01-01",
      action: "id-here",
    },
  ];

  // Get unique projects and sections from data
  const projectOptions = [...new Set(data.map((item) => item.project).filter(Boolean))];
  const sectionOptions = [...new Set(data.map((item) => item.section).filter(Boolean))];

  const filters = [
    { label: "Project", options: projectOptions },
    { label: "Section", options: sectionOptions },
  ];

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let result = data;
    if (filter.Project && filter.Project.length > 0) {
      result = result.filter((item) => filter.Project.includes(item.project));
    }
    if (filter.Section && filter.Section.length > 0) {
      result = result.filter((item) => filter.Section.includes(item.section));
    }
    return result;
  }, [filter, data]);

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };

  const handleFilterClear = () => {
    setFilter({ Project: [], Section: [] });
  };

  const columns = [
    { headerName: "No", field: "no" },
    { headerName: "Project Name", field: "project" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Unit", field: "unit" },
    { headerName: "PO Qty", field: "poQty" },
    { headerName: "Status", field: "status" },
    { headerName: "Approved By", field: "approvedBy" },
    { headerName: "Fulfilled", field: "fulfilled" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate("123"),
            icon: <FaEye />,
          },
          {
            label: "Edit",
            onClick: () => alert("Edit"),
            icon: <FaUserEdit />,
          },
          {
            label: "Delete ",
            onClick: () => alert("Delete"),
            icon: <FaTrash />,
          },
        ]}
        // onClick={handleActionClick}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };
  return (
    <div className="h-full">
      <TopBar
        title="Demands"
        detail="Lorem Ipsumis simply dummy text of the printing and typesetting industry."
        // showExport={true}
      />
      <div className="flex justify-end items-center gap-4 mt-2 mb-6">
        <CustomFilterDropdown
          filters={filters}
          selected={filter}
          onChange={handleFilterChange}
          onClear={handleFilterClear}
          placeholder="Filter by project or section"
          dropdownAlign="right"
        />
      </div>
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={filteredData}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>
    </div>
  );
};

export default SiDemands;
