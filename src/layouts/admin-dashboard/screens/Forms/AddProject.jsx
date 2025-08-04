import React, { useState, useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";
import { formatDateDMY } from '../../../../utils';

const validationSchema = Yup.object({
  name: Yup.string().required("Project name is required"),
  code: Yup.string().required("Project code is required"), // Made required again
  description: Yup.string().required("Description is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date can't be before start date")
    .required("End date is required"),
});

function toDateInputValue(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  // Convert to YYYY-MM-DD format for HTML date input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const AddProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProject = location.state?.project;
  const [loading, setLoading] = useState(false);

  // Debug: Log the editing project data
  useEffect(() => {
    if (editingProject) {
      console.log("Editing project data:", editingProject);
    }
  }, [editingProject]);

  const formik = useFormik({
    initialValues: {
      name: editingProject?.name || "",
      description: editingProject?.description || "",
      startDate: editingProject?.startDate ? toDateInputValue(editingProject.startDate) : "",
      endDate: editingProject?.endDate ? toDateInputValue(editingProject.endDate) : "",
      code: editingProject?.code || "",
    },
    enableReinitialize: true, // Enable reinitialize to handle editing
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("Form submission started!");
      console.log("Form values received:", values);
      
      try {
        setLoading(true);
        let response;
        
        // Prepare the data to send - ensure proper date formatting
        const projectData = {
          name: values.name.trim(),
          code: values.code, // Don't trim the code field
          description: values.description.trim(),
          startDate: values.startDate,
          endDate: values.endDate,
        };

        // Debug: Log the data being sent
        console.log("Form values:", values);
        console.log("Code field value:", values.code);
        console.log("Sending project data:", projectData);
        console.log("Is editing mode:", !!editingProject);
        console.log("Project ID:", editingProject?.id);

        if (editingProject) {
          // Edit mode: PUT
          console.log("Making PUT request to:", `/projects/${editingProject.id}`);
          console.log("Request payload:", JSON.stringify(projectData, null, 2));
          response = await apiClient.put(`/projects/${editingProject.id}`, projectData);
        } else {
          // Add mode: POST
          console.log("Making POST request to:", "/projects");
          console.log("Request payload:", JSON.stringify(projectData, null, 2));
          response = await apiClient.post("/projects", projectData);
        }
        
        // Debug: Log the response
        console.log("API Response:", response);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        console.log("Response ok:", response.ok);
        
        if (response.ok) {
          toast.success(editingProject ? "Project updated successfully!" : "Project created successfully!");
          resetForm();
          navigate("/admin-dashboard/project-management");
        } else {
          console.error("API Error Response:", response.data);
          console.error("Response status:", response.status);
          console.error("Response statusText:", response.statusText);
          
          // More specific error messages
          if (response.status === 400) {
            toast.error("Invalid data provided. Please check your input.");
          } else if (response.status === 404) {
            toast.error("Project not found.");
          } else if (response.status === 500) {
            toast.error("Server error. Please try again later.");
          } else {
            toast.error(response.data?.message || (editingProject ? "Project update failed!" : "Project creation failed!"));
          }
        }
      } catch (error) {
        console.error("Error details:", error);
        console.error("Error response:", error?.response);
        console.error("Error message:", error?.message);
        toast.error(
          error?.response?.data?.message ||
            "Operation failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        icon={
          <FaArrowLeftLong className="w-8 h-8 p-2 bg-[#EBEBEB] rounded-full" />
        }
        title={editingProject ? "Edit Project" : "New Project"}
        detail={editingProject ? "Edit Project Information in Epos Software" : "Add New Project Information in Epos Software"}
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      {/* form */}
      <form onSubmit={formik.handleSubmit} className="flex justify-center">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <h3 className="text-xl font-semibold text-[#12141D] ">
            Project Information
          </h3>

          <CustomTextField
            label={
              <span className="flex items-center gap-1">Project Name</span>
            }
            fullWidth
            name="name"
            placeholder="Enter Project Name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
           <CustomTextField
            label={
              <span className="flex items-center gap-1">Project Code</span>
            }
            fullWidth
            name="code"
            placeholder="Enter Project Code"
            type="text"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />
          <CustomTextField
            label={<span className="flex items-center gap-1">Description</span>}
            fullWidth
            name="description"
            type="text"
            placeholder="Enter Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />

          <CustomTextField
            label={<span className="flex items-center gap-1">Start Date</span>}
            fullWidth
            name="startDate"
            placeholder="Enter Start Date"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />

          <CustomTextField
            label={<span className="flex items-center gap-1">End Date</span>}
            fullWidth
            name="endDate"
            placeholder="Enter End Date"
            type="date"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
        </div>
      </form>

      <div className="flex gap-4 justify-center w-full mt-8">
        <button
          onClick={() => navigate("/admin-dashboard/project-management")}
          className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000] "
        >
          Back
        </button>
        <button
          type="submit"
          onClick={formik.handleSubmit}
          disabled={loading}
          className="bg-primary  px-10 py-2 rounded-lg font-medium text-white "
        >
          {loading ? (editingProject ? "Updating..." : "Saving...") : (editingProject ? "Update Project" : "Save Project")}
        </button>
      </div>
    </div>
  );
};

export default AddProject;
