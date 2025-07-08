import React, { useState, useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";

const CreateSectionProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams();
  const pId = params.get("id");

  const validationSchema = Yup.object({
    name: Yup.string().required("Section name is required"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const response = await apiClient.post("/sections", {
          ...values,
          projectId: pId,
        });
        if (response.ok) {
          resetForm();
          navigate(-1);
        } else {
          toast.error("Section Creation failed!");
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
        title="New Section"
        detail="Add New Section Information in Epos Software"
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* form */}
      <div className="flex justify-center">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <h3 className="text-xl font-semibold text-[#12141D] ">
            Create Section
          </h3>

          <CustomTextField
            label={
              <span className="flex items-center gap-1">Section Name</span>
            }
            fullWidth
            name="name"
            placeholder="Enter Section Name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />
          <CustomTextField
            label={<span className="flex items-center gap-1">Description</span>}
            fullWidth
            name="description"
            placeholder="Enter Description"
            type="text"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
          />
        </div>
      </div>{" "}
      <div className="flex gap-4 justify-center w-full mt-8">
        <button
          onClick={() => navigate("/admin-dashboard/project-management")}
          className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000] "
        >
          Back
        </button>
        <button
          className="bg-primary  px-10 py-2 rounded-lg font-medium text-white "
          onClick={formik.handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Section"}
        </button>
      </div>
    </div>
  );
};

export default CreateSectionProject;
