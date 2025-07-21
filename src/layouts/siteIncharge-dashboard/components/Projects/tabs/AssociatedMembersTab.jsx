import React from "react";
import SimpleTable from "../../../../../components/SimpleTable";
import DropdownButton from "../../../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import { FaUserEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AssociatedMembersTab = ({ data, loading }) => {
  const navigate = useNavigate();

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format role function
  const formatRole = (role) => {
    if (!role) return "Unknown";
    
    // Convert to title case and replace underscores with spaces
    return role
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get assignments summary
  const getAssignmentsSummary = (assignments) => {
    if (!assignments || assignments.length === 0) return "No assignments";
    
    const sections = assignments.map(assignment => assignment.section?.name).filter(Boolean);
    if (sections.length === 0) return "No sections assigned";
    
    if (sections.length === 1) return sections[0];
    if (sections.length <= 3) return sections.join(", ");
    return `${sections.length} sections assigned`;
  };

  // Transform API data to table format
  const transformMembersData = () => {
    if (!data?.associatedMembers) return [];
    
    return data.associatedMembers.map((member, index) => ({
      id: member.id,
      iD: (index + 1).toString().padStart(2, '0'),
      name: member.name || "Unknown",
      email: member.email || "No email",
      phone: "Not available", // Phone not in API response
      date: formatDate(data.createdAt), // Using project creation date as fallback
      role: formatRole(member.role),
      status: "Active", // Status not in API response, assuming active
      note: getAssignmentsSummary(member.assignments),
      action: member.id,
    }));
  };

  const columns = [
    { headerName: "ID", field: "iD" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone" },
    { headerName: "Date", field: "date" },
    { headerName: "Role", field: "role" },
    { headerName: "Status", field: "status" },
    { headerName: "Note", field: "note" },
    // { headerName: "Action", field: "action" },
  ];

  // const CustomActionComponent = ({ value: memberId }) => {
  //   return (
  //     <DropdownButton
  //       className="bg-[#FF0000] font-semibold"
  //       items={[
  //         {
  //           label: "View Member Detail",
  //           onClick: () =>
  //             navigate(`/siteincharge-dashboard/user-management/${memberId}`),
  //           icon: <FaEye />,
  //         },
  //         {
  //           label: "Delete Assign Member",
  //           onClick: () => alert("Delete functionality not implemented"),
  //           icon: <FaTrash />,
  //         },
  //       ]}
  //     >
  //       <IconButton>
  //         <BsThreeDotsVertical />
  //       </IconButton>
  //     </DropdownButton>
  //   );
  // };

  const membersData = transformMembersData();

  return (
    <div>
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading members...</p>
        </div>
      ) : (
        <SimpleTable
          data={membersData}
          columns={columns}
          cellComponents={{}}
        />
      )}
    </div>
  );
};

export default AssociatedMembersTab;
