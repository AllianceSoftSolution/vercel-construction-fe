"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { ArrowBack, ExpandMore, Add, Delete } from "@mui/icons-material";
import CustomTextField from "../../../../mui/CustomTextField";

export default function PurchaseOrderForm({ isOpen, onClose }) {
  const [vendor, setVendor] = useState("");
  const [formSections, setFormSections] = useState([
    { id: "1", vendor: "", product: "Cement", quantity: "" },
  ]);

  const handleVendorChange = (e) => {
    setVendor(e.target.value);
  };
  const addFormSection = () => {
    const newSection = {
      id: Date.now().toString(),
      vendor: "",
      product: "",
      quantity: "",
    };
    setFormSections([...formSections, newSection]);
  };

  const removeFormSection = (id) => {
    if (formSections.length > 1) {
      setFormSections(formSections.filter((section) => section.id !== id));
    }
  };

  const updateFormSection = (id, field, value) => {
    setFormSections(
      formSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const renderFormSection = (section, index) => (
    <Box key={section.id} mb={4}>
      {/* Vendor Dropdown */}
      <CustomTextField
        label="Add Vendor"
        value={vendor}
        handleChange={handleVendorChange}
        margin="normal"
        helperText={!vendor ? "Please select a vendor" : ""}
      >
        <option value="">-- Choose --</option>
        <option value="vendor1">Vendor 1</option>
        <option value="vendor2">Vendor 2</option>
        <option value="vendor3">Vendor 3</option>
      </CustomTextField>

      {/* Product Field */}
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

      <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
        {formSections.length > 1 && (
          <IconButton
            onClick={() => removeFormSection(section.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        )}
        {index === formSections.length - 1 && (
          <IconButton onClick={addFormSection} color="primary">
            <Add />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ px: 4,borderRadius:12 }} >
      

      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            {/* <IconButton onClick={() => setIsOpen(false)} size="small">
              <ArrowBack />
            </IconButton> */}
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
          <Button variant="outlined" onClick={() => onClose}>
            Back
          </Button>
          <Button variant="contained" color="warning">
            Create Purchase Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
