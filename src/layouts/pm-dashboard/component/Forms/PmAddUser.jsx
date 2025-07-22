import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomButton from "../../../../comments/components/landing-pages/CustomButton";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../../../mui/CustomSelect";
import { MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const PmAddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "",
      note: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const response = await apiClient.post("/auth/register", values);

        if (response.ok) {
          resetForm();
          navigate(-1);
        } else {
          toast.error("User creation failed!");
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
        title="New User"
        detail="Add New User Information in Epos Software"
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* form */}
      <div className="flex justify-center">
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <CustomTextField
            label={<span className="flex items-center gap-1">User Name</span>}
            fullWidth
            name="name"
            placeholder="Enter Your Name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Enter Email</span>}
            fullWidth
            name="email"
            placeholder="Enter Your Work Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />{" "}
          <CustomTextField
            label={<span className="flex items-center gap-1">Note (Optional)</span>}
            fullWidth
            name="note"
            placeholder="Enter a note (optional)"
            type="text"
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="w-full">
            <CustomSelect
              label="Select Role"
              name="role"
              select
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
            
              <MenuItem value="CONSTRUCTION_MANAGER">
                Construction Manager
              </MenuItem>
              <MenuItem value="STORE_INCHARGE">Store Incharge</MenuItem>
              <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
            </CustomSelect>
          </div>
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
          {loading ? "Saving..." : "Save User"}
        </button>
      </div>
    </div>
  );
};

export default PmAddUser;
