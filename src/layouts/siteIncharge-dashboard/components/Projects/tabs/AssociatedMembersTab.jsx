import React from "react";
import SimpleTable from "../../../../../components/SimpleTable";
import DropdownButton from "../../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { FaUserEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AssociatedMembersTab = ({ data }) => {
  const navigate = useNavigate();

  // Transform the data for the table
  const associatedMembersTableData = (data?.associatedMembers || []).map(member => ({
    name: member.name,
    email: member.email,
    role: member.role,
    sections: member.assignments
      ? member.assignments.map(a => a.section?.name).filter(Boolean).join(', ')
      : ''
  }));

  const columns = [
    // { headerName: "ID", field: "id" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    // { headerName: "Phone Number", field: "phone" },
    // { headerName: "Date", field: "date" },
    { headerName: "Role", field: "role" },
    { headerName: "Sections", field: "sections" },
    // { headerName: "Status", field: "status" },
    // { headerName: "Note", field: "note" },
    // { headerName: "Action", field: "action" },
  ];
  // Custom cell renderer for role to display properly formatted
  const RoleCell = ({ value }) => {
    if (!value) return "";
    
    // Convert to title case and replace underscores with spaces
    const formattedRole = value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return (
      <span className="text-sm text-black">
        {formattedRole}
      </span>
    );
  };

  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Member Detail",
            onClick: () => navigate("/admin-dashboard/user-management/123"),
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
        data={associatedMembersTableData}
        columns={columns}
        cellComponents={{ action: CustomActionComponent, role: RoleCell }}
      />
    </div>
  );
};

export default AssociatedMembersTab;
