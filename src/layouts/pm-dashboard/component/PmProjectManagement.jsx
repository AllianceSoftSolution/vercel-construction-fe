import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import ActionModal from "./users/modals/ActionModal";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../comments/components/DropdownButton";
import { IconButton } from "@mui/material";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import { RiDeleteBin5Fill } from "react-icons/ri";

const PmProjectManagement = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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

  const columns = [
    { headerName: "No", field: "no" },
    { headerName: "Project Name", field: "name" },
    { headerName: "Code", field: "code" },
    { headerName: "Description", field: "description" },
    { headerName: "Start Date", field: "startDate" },
    { headerName: "End Date", field: "endDate" },
    { headerName: "Action", field: "id" },
  ];

  const CustomActionComponent = ({ value: id }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail Page",
            onClick: () =>
              navigate(`/project-manager-dashboard/project-Management/${id}`),
            icon: <FaEye />,
          },
        ]}
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
        title="Project Management"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showFilter={true}
        filterOptions={["Completed", "In-Progress", "Cancelled"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={projects}
          cellComponents={{ id: CustomActionComponent }}
          loading={loading}
        />
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
                navigate(
                  `/project-manager-dashboard/project-Management/${selectedProjectId}`
                )
              }
              actions={[
                {
                  type: "edit",
                  icon: <FaUserEdit />,
                  label: "Edit",
                  onClick: () =>
                    navigate(
                      `/project-manager-dashboard/project-Management/edit/${selectedProjectId}`
                    ),
                },
                {
                  type: "delete",
                  icon: <RiDeleteBin5Fill />,
                  label: "Delete",
                  onClick: () => {
                    toast.success("Delete action triggered");
                    setShowModal(false);
                  },
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PmProjectManagement;
