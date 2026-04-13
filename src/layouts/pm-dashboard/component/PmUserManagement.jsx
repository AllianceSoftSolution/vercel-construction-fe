import React, { useState, useEffect } from "react";
import TopBar from "@/components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { IconButton, Chip } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../comments/components/DropdownButton";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import Loader from "../../../components/ui/Loader";

const StatusChip = ({ value }) => {
  const isActive = value === true || value === "true" || value === "active";
  return (
    <Chip
      label={isActive ? "Active" : "Inactive"}
      size="small"
      sx={{
        bgcolor: isActive ? "#22c55e" : "#ef4444",
        color: "#fff",
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    />
  );
};

const PmUserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCMs = async () => {
    try {
      setLoading(true);
      // Backend already scopes to PM's sections AND only CONSTRUCTION_MANAGER role
      const response = await apiClient.get("/auth/users?role=CONSTRUCTION_MANAGER");
      if (response.ok) {
        setUsers(response.data.users || []);
      } else {
        toast.error("Failed to fetch team members");
      }
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Error fetching team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMs();
  }, []);

  const columns = [
    { headerName: "Employee ID", field: "employeeId" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Action", field: "id" },
  ];

  const CustomActionComponent = ({ value: id }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail",
          onClick: () => navigate(`/project-manager-dashboard/user-management/${id}`),
          icon: <FaEye />,
        },
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  return (
    <div className="h-full">
      <TopBar title="My Team" />
      <div className="mt-2 mb-4">
        <p className="text-gray-500 text-sm">Construction Managers assigned to your project sections</p>
      </div>
      <div className="h-[1px] bg-[#CDCDCD] w-full mb-4" />
      {loading ? (
        <Loader />
      ) : (
        <SimpleTable
          columns={columns}
          data={users}
          cellComponents={{ id: CustomActionComponent }}
        />
      )}
    </div>
  );
};

export default PmUserManagement;