import React, { useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "@/comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { Box, IconButton, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTextField from "../../../mui/CustomTextField";
import Button from "../../../components/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  boxShadow: 24,
  borderRadius: "50px",
};

const CmDemands = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

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

  const CustomActionComponent = () => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate("123"),
            icon: <FaEye />,
          },
          // {
          //   label: "Edit",
          //   onClick: () => alert("Edit"),
          //   icon: <FaUserEdit />,
          // },
          // {
          //   label: "Delete ",
          //   onClick: () => alert("Delete"),
          //   icon: <FaTrash />,
          // },
        ]}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };

  return (
    <div className="w-full">
      <TopBar
        title="Demands"
        detail="Lorem Ipsumis simply dummy text of the printing and typesetting industry."
        showFilter={true}
        filterOptions={["Approved", "Rejected", "Pending"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
        buttonText="Create Demand"
        onButtonClick={() =>
          navigate("/construction-manager-dashboard/demands/addDemand")
        }
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={data}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>
    </div>
  );
};

export default CmDemands;
