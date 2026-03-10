import React, { useEffect, useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomTextField from "../../../../mui/CustomTextField";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import apiClient from "../../../../api/apiClient";
import CustomSelect from "../../../../mui/CustomSelect";
import { MenuItem } from "@mui/material";

const SiAddDemand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [sections, setSections] = useState([]);

  // Fetch Sections
  const fetchSections = async () => {
    try {
      const res = await apiClient.get("/sections");
      if (res.ok) {
        setSections(res.data.sections || []);
      } else {
        toast.error("Failed to load sections");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading sections");
    }
  };

  // Fetch Materials
  const fetchMaterials = async () => {
    try {
      const res = await apiClient.get("/materials");
      if (res.ok) {
        setMaterials(res.data.materials || []);
      } else {
        toast.error("Failed to load materials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading materials");
    }
  };

  useEffect(() => {
    fetchSections();
    fetchMaterials();
  }, []);

  const validationSchema = Yup.object({
    activity: Yup.string().required("Activity is required"),
    materialId: Yup.string().required("Material is required"),
    quantity: Yup.number()
      .typeError("Quantity must be a number")
      .required("Quantity is required"),
    unit: Yup.string().required("Unit is required"),
    sectionId: Yup.string().required("Section is required"),
    notes: Yup.string().required("Notes are required"),
  });

  const formik = useFormik({
    initialValues: {
      activity: "",
      materialId: "",
      quantity: "",
      unit: "",
      sectionId: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const response = await apiClient.post("/demands", values);
        if (response.ok) {
          toast.success("Demand created successfully!");
          resetForm();
          navigate(-1);
        } else {
          toast.error("Demand creation failed!");
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
        title="Create Demand"
        detail="Add New Demand Information in Epos Software"
        showIcon={true}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center"
      >
        <div className="flex flex-col w-full md:w-[50%] gap-y-4 items-center">
          <CustomTextField
            label="Activity"
            name="activity"
            placeholder="Enter Activity"
            fullWidth
            value={formik.values.activity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.activity && Boolean(formik.errors.activity)}
            helperText={formik.touched.activity && formik.errors.activity}
          />
          <div className="w-full">
            <CustomSelect
              label="Material"
              name="materialId"
              value={formik.values.materialId}
              onChange={(e) =>
                formik.setFieldValue("materialId", e.target.value)
              }
              onBlur={formik.handleBlur}
              error={
                formik.touched.materialId && Boolean(formik.errors.materialId)
              }
              helperText={formik.touched.materialId && formik.errors.materialId}
              fullWidth
            >
              <MenuItem value="">Select Material</MenuItem>
              {materials.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomSelect>
          </div>

          <CustomTextField
            label="Quantity"
            name="quantity"
            placeholder="Enter Quantity"
            type="text"
            fullWidth
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
          />

          <CustomTextField
            label="Unit"
            name="unit"
            placeholder="Enter Unit"
            type="text"
            fullWidth
            value={formik.values.unit}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.unit && Boolean(formik.errors.unit)}
            helperText={formik.touched.unit && formik.errors.unit}
          />

          <div className="w-full">
            <CustomSelect
              label="Section"
              name="sectionId"
              value={formik.values.sectionId}
              onChange={(e) =>
                formik.setFieldValue("sectionId", e.target.value)
              }
              onBlur={formik.handleBlur}
              error={
                formik.touched.sectionId && Boolean(formik.errors.sectionId)
              }
              helperText={formik.touched.sectionId && formik.errors.sectionId}
              fullWidth
            >
              <MenuItem value="">Select Section</MenuItem>
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name}
                </MenuItem>
              ))}
            </CustomSelect>
          </div>

          <CustomTextField
            label="Notes"
            name="notes"
            placeholder="Enter Notes"
            type="text"
            fullWidth
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
          />

          <div className="flex gap-4 w-full justify-center mt-8">
            <button
              type="button"
              className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-primary px-10 py-2 rounded-lg font-medium text-white"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Demand"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SiAddDemand; 