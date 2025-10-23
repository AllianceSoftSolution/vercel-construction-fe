import React, { useState } from "react";
import TopBar from "@/components/ui/TopBar";
import CustomTextField from "@/mui/CustomTextField";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const AddVendor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingVendor = location.state?.vendor;
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Project name is required"),
    contactPerson: Yup.string().required("Contact Person is required"),
    phone: Yup.string().required("Phone Number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().required("Address is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: editingVendor?.name || "",
      contactPerson: editingVendor?.contactPerson || "",
      phone: editingVendor?.phone || "",
      email: editingVendor?.email || "",
      address: editingVendor?.address || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        let response;
        if (editingVendor) {
          response = await apiClient.put(`/vendors/${editingVendor.id}`, values);
        } else {
          response = await apiClient.post("/vendors", values);
        }
        if (response.ok) {
          resetForm();
          navigate(-1);
        } else {
          toast.error(editingVendor ? "Vendor update failed!" : "Vendor creation failed!");
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
    <div>
      <TopBar title={editingVendor ? "Edit Vendor" : "Add Vendor"} detail={editingVendor ? "Edit Vendor Information" : "Add New Vendor"} showIcon={true} />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex justify-center items-center gap-4">
          <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
            <CustomTextField
              label={<span className="flex items-center gap-1">Name</span>}
              fullWidth
              name="name"
              placeholder="Enter Vendor Name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <CustomTextField
              label={
                <span className="flex items-center gap-1">Contact Person</span>
              }
              fullWidth
              name="contactPerson"
              placeholder="Enter Contact Person"
              type="text"
              value={formik.values.contactPerson}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.contactPerson &&
                Boolean(formik.errors.contactPerson)
              }
              helperText={
                formik.touched.contactPerson && formik.errors.contactPerson
              }
            />
            <CustomTextField
              label={
                <span className="flex items-center gap-1">Phone Number</span>
              }
              fullWidth
              name="phone"
              placeholder="Enter Phone Number"
              type="text"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <CustomTextField
              label={<span className="flex items-center gap-1">Email</span>}
              fullWidth
              name="email"
              placeholder="Enter Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <CustomTextField
              label={<span className="flex items-center gap-1">Address</span>}
              fullWidth
              name="address"
              placeholder="Enter Address"
              type="text"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </div>
        </div>

        <div className="flex gap-4 w-full justify-center mt-8">
          <button
            className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="bg-primary px-10 py-2 rounded-lg font-medium text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? (editingVendor ? "Updating..." : "Saving...") : (editingVendor ? "Update" : "Save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVendor;
