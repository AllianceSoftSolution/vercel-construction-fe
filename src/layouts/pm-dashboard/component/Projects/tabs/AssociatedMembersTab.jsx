import React from "react";
import SimpleTable from "../../../../../components/SimpleTable";
import DropdownButton from "../../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { FaUserEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash } from "react-icons/fa";

const AssociatedMembersTab = ({ data }) => {
  const columns = [
    { headerName: "ID", field: "id" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Role", field: "role" },
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
  // Only show Construction Managers
  const cmMembers = (data?.associatedMembers || []).filter(
    (member) => member.role === "CONSTRUCTION_MANAGER"
  );

  return (
    <div>
      <SimpleTable
        data={cmMembers}
        columns={columns}
        cellComponents={{ action: CustomActionComponent }}
      />
    </div>
  );
};

export default AssociatedMembersTab;
