import React from "react";
import SimpleTable from "../../../../../components/SimpleTable";
import DropdownButton from "../../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { FaUserEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AssociatedMembersTab = () => {
  const navigate = useNavigate();
  const data = [
    {
      id: 1,
      iD: "01",
      name: "Ahmed Raza",
      email: "c@gmail.com",
      phone: 123456789,
      date: "2025-06-15",
      role: "Project Manager",
      status: "Pending",
      note: "empty..",

      // action: "id-here",
    },
    {
      id: 2,
      iD: "02",
      name: "Ahmed Raza",
      email: "c@gmail.com",
      phone: 123456789,
      date: "2025-06-15",
      role: "Construction Manager",
      status: "Approved",
      note: "empty..",

      // action: "id-here",
    },
    {
      id: 3,
      iD: "03",
      name: "Ahmed Raza",
      email: "c@gmail.com",
      phone: 123456789,
      date: "2025-06-15",
      role: "Site Manager",
      status: "In Progress",
      note: "empty..",

      // action: "id-here",
    },
  ];
  const columns = [
    { headerName: "ID", field: "iD" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone" },
    { headerName: "Date", field: "date" },
    { headerName: "Role", field: "role" },
    { headerName: "Status", field: "status" },
    { headerName: "Note", field: "note" },
    { headerName: "Action", field: "action" },
  ];
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Member Detail",
            onClick: () => navigate("/admin-dashboard/user-Management/123"),
            icon: <FaEye />,
          },
          {
            label: "Delete Assign Member",
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
    <div>
      <SimpleTable
        data={data}
        columns={columns}
        cellComponents={{ action: CustomActionComponent }}
      />
    </div>
  );
};

export default AssociatedMembersTab;
