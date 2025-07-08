import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";

const AddStore = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Store name is required"),
    type: Yup.string().required("Type is required"),
    sectionId: Yup.string().required("Section Id is required"),
    // cmUserId: Yup.string().required("CM User Id is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      sectionId: "",
      // cmUserId: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const response = await apiClient.post("/stores", values);
        if (response.ok) {
          resetForm();
          navigate(-1);
        } else {
          toast.error("Store creation failed!");
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
        title="New Store"
        detail="Add New Store Information in Epos Software"
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* form */}
      <div className="flex justify-center">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <h3 className="text-xl font-semibold text-[#12141D] ">
            Premium Content
          </h3>
          <CustomTextField
            label={<span className="flex items-center gap-1">Store Name</span>}
            fullWidth
            name="name"
            placeholder="Enter Store Name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />
          <CustomTextField
            label={<span className="flex items-center gap-1">Type</span>}
            fullWidth
            name="type"
            type="text"
            placeholder="Select Type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.type && formik.errors.type}
          />
          <CustomTextField
            label={<span className="flex items-center gap-1">Section Id</span>}
            fullWidth
            name="sectionId"
            placeholder="Enter Section Id"
            type="text"
            value={formik.values.sectionId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.sectionId && formik.errors.sectionId}
          />
          {/* <CustomTextField
            label={<span className="flex items-center gap-1">CM User Id</span>}
            fullWidth
            name="cmUserId"
            placeholder="Enter CM User Id"
            type="text"
            value={formik.values.cmUserId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cmUserId && formik.errors.cmUserId}
          /> */}
        </div>
      </div>{" "}
      <div className="flex gap-4 w-full justify-center mt-8">
        <button
          className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000] "
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="bg-primary  px-10 py-2 rounded-lg font-medium text-white "
          onClick={formik.handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Store"}
        </button>
      </div>
    </div>
  );
};

export default AddStore;
