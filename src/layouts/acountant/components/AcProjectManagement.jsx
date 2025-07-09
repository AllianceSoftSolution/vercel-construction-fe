import React, { useEffect, useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownButton from "../../../comments/components/DropdownButton";
import { FaEye, FaTrash, FaUserEdit } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import ActionModal from "./users/modals/ActionModal";
import { RiDeleteBin5Fill } from "react-icons/ri";

const AcProjectManagement = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
              navigate(`/accountant-dashboard/project-Management/${id}`),
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
        detail="View and manage all construction projects."
        showFilter={true}
        filterOptions={["Completed", "In-Progress", "Cancelled"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={projects}
          cellComponents={{ id: CustomActionComponent }}
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
              onButtonClick={() => navigate("123")}
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

export default AcProjectManagement;
