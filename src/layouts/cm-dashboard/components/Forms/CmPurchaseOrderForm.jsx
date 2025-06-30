import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import {
  ArrowBack,
  ExpandMore,
  Add,
  Delete,
  Height,
} from "@mui/icons-material";
import CustomTextField from "../../../../mui/CustomTextField";
import Button from "../../../../components/Button";
import { MdAdd, MdDelete } from "react-icons/md";
import CustomSelect from "../../../../mui/CustomSelect";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  borderRadius: 20,
};

export default function CmPurchaseOrderForm({ isOpen, onClose }) {
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
      total: "50",
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
    <Box key={section.id} mb={4} borderRadius={20}>
      <CustomSelect label="Select you vendor" fullWidth name="name" select>
        <MenuItem value="1">Hassan</MenuItem>
        <MenuItem value="2">Ahmad</MenuItem>
        <MenuItem value="2">Ahad</MenuItem>
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
      <CustomTextField
        fullWidth
        margin="normal"
        label="Total"
        value={section.total}
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

  return (
    <Box sx={style}>
      <Dialog open={isOpen} onClose={onClose} fullWidth>
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
          <button
            variant="outlined"
            className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000]"
            onClick={() => onClose}
          >
            Back
          </button>
          <Button
            buttonText={"Create Purchase Order"}
            variant="contained"
            color="warning"
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
