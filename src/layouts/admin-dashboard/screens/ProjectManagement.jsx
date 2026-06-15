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
import DeleteModal from "../../../mui/DeleteModal";
import Loader from "../../../components/ui/Loader";
import CustomFilterDropdown from "../../../components/ui/CustomFilterDropdown";
import { formatDateDMY } from '../../../utils';
import { useReadOnly } from "../../../context/ReadOnlyContext";

// Function to convert date to YYYY-MM-DD format for HTML date input
function toDateInputValue(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const ProjectManagement = () => {
  const navigate = useNavigate();
  const isReadOnly = useReadOnly();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filter, setFilter] = useState({ "Project Name": [], "Project Code": [] });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/projects");
      if (response.ok) {
        const data = response.data.projects.map((project, index) => ({
          ...project,
          no: index + 1,
          // Store original dates for editing, formatted dates for display
          originalStartDate: project.startDate,
          originalEndDate: project.endDate,
          startDate: formatDateDMY(project.startDate),
          endDate: formatDateDMY(project.endDate),
        }));
        setProjects(data);
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

  const deleteProject = async () => {
    try {
      const response = await apiClient.delete(`/projects/${selectedProjectId}`);
      if (response.ok) {
        fetchProjects();
        setShowDeleteModal(false);
      } else {
        toast.error(response.data?.message || "Failed to delete project");
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
    { headerName: "Action", field: "id" },
  ];

  const CustomActionComponent = ({ value: projectId }) => (
    <DropdownButton
      className="bg-[#FF0000] font-semibold"
      items={[
        {
          label: "View Detail Page",
          icon: <FaEye />,
          onClick: () =>
            navigate(`/admin-dashboard/project-management/${projectId}`),
        },
        ...(!isReadOnly ? [
          {
            label: "Edit",
            icon: <FaUserEdit />,
            onClick: () => {
              const project = projects.find(p => p.id === projectId);
              // Create a project object with properly formatted dates for editing
              const projectForEdit = {
                ...project,
                startDate: toDateInputValue(project.originalStartDate),
                endDate: toDateInputValue(project.originalEndDate),
              };
              navigate(`/admin-dashboard/project-management/addProject`, {
                state: { project: projectForEdit }
              });
            },
          },
          {
            label: "Delete",
            icon: <FaTrash />,
            onClick: () => {
              setSelectedProjectId(projectId);
              setShowDeleteModal(true);
            },
          },
        ] : []),
      ]}
    >
      <IconButton>
        <BsThreeDotsVertical />
      </IconButton>
    </DropdownButton>
  );

  // Filter options
  const nameOptions = projects.map((p) => p.name).filter(Boolean);
  const codeOptions = projects.map((p) => p.code).filter(Boolean);
  const filters = [
    { label: "Project Name", options: nameOptions },
    { label: "Project Code", options: codeOptions },
  ];

  // Filtered projects based on selected filters
  const filteredProjects = projects.filter((project) => {
    const nameMatch =
      filter["Project Name"].length === 0 ||
      filter["Project Name"].includes(project.name);
    const codeMatch =
      filter["Project Code"].length === 0 ||
      filter["Project Code"].includes(project.code);
    return nameMatch && codeMatch;
  });

  const handleFilterChange = (newSelected) => {
    setFilter(newSelected);
  };
  const handleFilterClear = () => setFilter({ "Project Name": [], "Project Code": [] });

  return (
    <div className="h-full">
      <TopBar
        title="Project Management"
        // detail="Manage all your construction projects in one place."
        {...(!isReadOnly && {
          buttonText: "Create Project",
          onButtonClick: () => navigate("/admin-dashboard/project-management/addProject"),
        })}
      />
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <Loader />
        ) : (
          <SimpleTable
            columns={columns}
            data={filteredProjects}
            tableFilters={filters}
            filterSelected={filter}
            onFilterChange={handleFilterChange}
            onFilterClear={handleFilterClear}
            filterPlaceholder="Filter by name or code"
            exportFileName="projects"
            cellComponents={{ id: CustomActionComponent }}
          />
        )}
      </div>

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

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteProject}
        />
      )}
    </div>
  );
};

export default ProjectManagement;
