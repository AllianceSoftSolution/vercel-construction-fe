import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import ActionModal from "./users/modals/ActionModal";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";
import { RiDeleteBin5Fill } from "react-icons/ri";

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/projects");
      if (response.ok) {
        const data = response.data.projects.map((project, index) => ({
          no: index + 1,
          startDate: new Date(project.startDate).toLocaleDateString(),
          endDate: new Date(project.endDate).toLocaleDateString(),
          action: project.id,
          ...project,
        }));
        setProjects(data);
        toast.success("Projects fetched successfully!");
      } else {
        toast.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirm) return;

    try {
      const response = await apiClient.delete(`/projects/${id}`);
      if (response.ok) {
        toast.success("Project deleted");
        fetchProjects(); // Refresh data
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const columns = [
    { headerName: "No", field: "no" },
    { headerName: "Project Name", field: "name" },
    { headerName: "Code", field: "code" },
    { headerName: "Description", field: "description" },
    { headerName: "Start Date", field: "startDate" },
    { headerName: "End Date", field: "endDate" },
    { headerName: "Action", field: "action" },
  ];

  const CustomActionComponent = ({ data }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail Page",
          onClick: () =>
            navigate(`/admin-dashboard/project-management/${data}`),
          icon: <FaEye />,
        },
        {
          label: "Edit",
          onClick: () =>
            navigate(`/admin-dashboard/project-management/edit/${data}`),
          icon: <FaUserEdit />,
        },
        {
          label: "Delete",
          onClick: () => handleDelete(data),
          icon: <FaTrash />,
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
      <TopBar
        title="Project Management"
        detail="Manage all your construction projects in one place."
        showFilter={true}
        filterOptions={["Completed", "In-Progress", "Cancelled"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
        buttonText="Create Project"
        onButtonClick={() =>
          navigate("/admin-dashboard/project-management/addProject")
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={projects}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>

      {/* Optional Modal if needed */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl relative">
            <button
              className="absolute top-2 right-3 text-lg font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <ActionModal
              showProfile={false}
              buttonText="View Project Details"
              onButtonClick={() =>
                navigate("/admin-dashboard/project-management/123")
              }
              actions={[
                {
                  type: "edit",
                  icon: <FaUserEdit />,
                  label: "Edit",
                  onClick: () => console.log("Edit clicked"),
                },
                {
                  type: "delete",
                  icon: <RiDeleteBin5Fill />,
                  label: "Delete",
                  onClick: () => console.log("Delete clicked"),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
