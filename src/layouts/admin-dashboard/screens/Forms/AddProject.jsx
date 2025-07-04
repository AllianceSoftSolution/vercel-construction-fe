import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";

const validationSchema = Yup.object({
  name: Yup.string().required("Project name is required"),
  description: Yup.string().required("Description is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date can't be before start date")
    .required("End date is required"),
});

const AddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      description: "",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const response = await apiClient.post("/projects", values); // Send as JSON

        if (response.ok) {
          toast.success("Project created successfully!");
          resetForm();
          navigate(-1);
        } else {
          toast.error("Project creation failed!");
        }
      } catch (error) {
        console.error(error);
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
        title="New Project"
        detail="Add New Project Information in Epos Software"
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
          {loading ? "Saving..." : "Save Project"}
        </button>
      </div>
    </div>
  );
};

export default AddProject;
