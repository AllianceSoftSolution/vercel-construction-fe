import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    unit: Yup.string().required("Unit is required"),
    // category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      unit: "",
      // category: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const response = await apiClient.post("/materials", values);
        if (response.status === 200 || response.status === 201) {
          resetForm();
          navigate(-1);
        } else {
          toast.error("Product creation failed!");
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
          <FaArrowLeftLong
            className="w-8 h-8 p-2 bg-[#EBEBEB] rounded-full cursor-pointer"
            onClick={() => navigate(-1)}
          />
        }
        title="New Material"
        detail="Add New Product Information"
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      {/* form */}
      <div className="flex justify-center items-center gap-4">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <CustomTextField
            label="Product Name"
            fullWidth
            name="name"
            placeholder="Enter Product Name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />
          <CustomTextField
            label="Description"
            fullWidth
            name="description"
            placeholder="Enter Product Description"
            type="text"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
          />
          <CustomTextField
            label="Unit"
            fullWidth
            name="unit"
            placeholder="Enter Unit"
            type="text"
            value={formik.values.unit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.unit && formik.errors.unit}
          />
          {/* <CustomTextField
            label="Category"
            fullWidth
            name="category"
            placeholder="Enter Product Category"
            type="text"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && formik.errors.category}
          /> */}
        </div>
      </div>

      {/* buttons */}
      <div className="flex gap-4 w-full mt-8 justify-center">
        <button
          className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="bg-primary px-10 py-2 rounded-lg font-medium text-white"
          onClick={formik.handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
