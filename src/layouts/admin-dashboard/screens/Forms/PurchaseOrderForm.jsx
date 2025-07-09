import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { MdAdd, MdDelete } from "react-icons/md";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomSelect from "../../../../mui/CustomSelect";
import Button from "../../../../components/Button";
import { useFormik } from "formik";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  borderRadius: 20,
};

export default function PurchaseOrderForm({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formSections, setFormSections] = useState([
    { id: "1", vendor: "", product: "Cement", quantity: "", total: "50" },
  ]);

  const addFormSection = () => {
    const newSection = {
      id: Date.now().toString(),
      vendor: "",
      product: "",
      quantity: "",
      total: "",
    };
    setFormSections([...formSections, newSection]);
  };

  const removeFormSection = (id) => {
    if (formSections.length > 1) {
      setFormSections(formSections.filter((section) => section.id !== id));
    }
  };

  const updateFormSection = (id, field, value) => {
    setFormSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const renderFormSection = (section, index) => (
    <Box key={section.id} mb={4} borderRadius={2}>
      <CustomSelect
        label="Select your vendor"
        fullWidth
        name="vendor"
        value={section.vendor}
        onChange={(e) =>
          updateFormSection(section.id, "vendor", e.target.value)
        }
      >
        <MenuItem value="1">Hassan</MenuItem>
        <MenuItem value="2">Ahmad</MenuItem>
        <MenuItem value="3">Ahad</MenuItem>
      </CustomSelect>

      <CustomTextField
        fullWidth
        margin="normal"
        label="Product"
        value={section.product}
        onChange={(e) =>
          updateFormSection(section.id, "product", e.target.value)
        }
      />

      <CustomTextField
        fullWidth
        margin="normal"
        label="Quantity"
        value={section.quantity}
        onChange={(e) =>
          updateFormSection(section.id, "quantity", e.target.value)
        }
      />

      <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
        {formSections.length > 1 && (
          <IconButton
            onClick={() => removeFormSection(section.id)}
            color="error"
          >
            <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
          </IconButton>
        )}
        {index === formSections.length - 1 && (
          <IconButton onClick={addFormSection} color="primary">
            <MdAdd className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  const validationSchema = Yup.object({
    vendorId: Yup.string().required("Vendor Id is required"),
    quantity: Yup.string().required("Quantity is required"),
    notes: Yup.string().required("Notes are required"),
  });

  const formik = useFormik({
    initialValues: {
      vendorId: "",
      quantity: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const response = await apiClient.post("/purchase-orders", values);
        if (response.ok) {
          resetForm();
          navigate(-1);
        } else {
          toast.error("PO creation failed!");
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
    <Box sx={style}>
      <Dialog open={isOpen} onClose={onClose} fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Typography variant="h6">Create Purchase Order</Typography>
              <Typography variant="body2" color="text.secondary">
                Add New User Information in Epos System Software.
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {formSections.map((section, index) =>
            renderFormSection(section, index)
          )}
        </DialogContent>

        <DialogActions>
          <button
            type="button"
            className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
            onClick={onClose}
          >
            Back
          </button>
          <Button
            buttonText={"Create Purchase Order"}
            variant="contained"
            color="warning"
            onClick={formik.handleSubmit}
            disabled={loading}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
