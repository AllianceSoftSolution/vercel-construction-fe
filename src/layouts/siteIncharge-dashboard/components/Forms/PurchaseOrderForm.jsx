import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CustomTextField from "../../../../mui/CustomTextField";
import CustomSelect from "../../../../mui/CustomSelect";
import Button from "../../../../components/Button";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";
import { MdAdd, MdDelete } from "react-icons/md";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  borderRadius: 20,
};

export default function PurchaseOrderForm({ isOpen, onClose, demandId, sectionId, materialName, materialId, demandQuantity }) {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [poEntries, setPoEntries] = useState([
    { vendorId: "", quantity: "", notes: "" }
  ]);
  const [errors, setErrors] = useState([]);
  const [confirmations, setConfirmations] = useState([false]);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const vendorsRes = await apiClient.get("/vendors");
        setVendors(vendorsRes.data.vendors || vendorsRes.data || []);
      } catch (err) {
        toast.error("Failed to fetch vendors");
      }
    }
    if (isOpen) fetchVendors();
  }, [isOpen]);

  const handleEntryChange = (idx, field, value) => {
    setPoEntries((prev) => prev.map((entry, i) => i === idx ? { ...entry, [field]: value } : entry));
  };

  const addPoEntry = () => {
    setPoEntries((prev) => [...prev, { vendorId: "", quantity: "", notes: "" }]);
    setErrors((prev) => [...prev, {}]);
    setConfirmations((prev) => [...prev, false]);
  };

  const removePoEntry = (idx) => {
    if (poEntries.length === 1) return;
    setPoEntries((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => prev.filter((_, i) => i !== idx));
    setConfirmations((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleConfirmationChange = (idx, checked) => {
    setConfirmations((prev) => prev.map((conf, i) => i === idx ? checked : conf));
  };

  const validateEntries = () => {
    let valid = true;
    const newErrors = poEntries.map((entry, idx) => {
      const entryErrors = {};
      if (!entry.vendorId) {
        entryErrors.vendorId = "Vendor is required";
        valid = false;
      }
      if (!entry.quantity || isNaN(Number(entry.quantity)) || Number(entry.quantity) < 1) {
        entryErrors.quantity = "Quantity must be at least 1";
        valid = false;
      }
      if (Number(entry.quantity) > Number(demandQuantity)) {
        if (!confirmations[idx]) {
          entryErrors.confirmation = "Please confirm that you want to create this PO with quantity greater than demand";
          valid = false;
        }
        if (!entry.notes || entry.notes.trim() === "") {
          entryErrors.notes = "Notes are required if PO quantity exceeds demand";
          valid = false;
        }
      }
      return entryErrors;
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateEntries()) return;
    setLoading(true);
    let allSuccess = true;
    for (let entry of poEntries) {
      const payload = {
        demandId,
        sectionId,
        materialId,
        vendorId: entry.vendorId,
        quantity: Number(entry.quantity),
        notes: entry.notes,
      };
      try {
        const response = await apiClient.post("/purchase-orders", payload);
        if (!response.ok) {
          allSuccess = false;
          toast.error(response.data?.message || "PO creation failed!");
        }
      } catch (error) {
        allSuccess = false;
        toast.error(error?.response?.data?.message || "Operation failed. Please try again.");
      }
    }
    setLoading(false);
    if (allSuccess) {
      toast.success("All purchase orders created!");
      setPoEntries([{ vendorId: "", quantity: "", notes: "" }]);
      setErrors([]);
      setConfirmations([false]);
      onClose();
      window.location.reload();
    }
  };

  const isCreateDisabled = loading || poEntries.some((entry, idx) => Number(entry.quantity) > Number(demandQuantity) && !confirmations[idx]);

  return (
    <Box sx={style}>
      <Dialog open={isOpen} onClose={onClose} fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Typography variant="h6">Create Purchase Order</Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the details to create one or more Purchase Orders.
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <CustomTextField
            fullWidth
            margin="normal"
            label="Material"
            name="materialName"
            value={materialName || ""}
            disabled
          />
          {poEntries.map((entry, idx) => (
            <Box key={idx} mb={3} borderRadius={2} border={"1px solid #eee"} p={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <CustomSelect
                  label="Select Vendor"
                  name="vendorId"
                  value={entry.vendorId}
                  onChange={e => handleEntryChange(idx, "vendorId", e.target.value)}
                  error={!!errors[idx]?.vendorId}
                  fullWidth
                >
                  <MenuItem value="" disabled>Select Vendor</MenuItem>
                  {vendors.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>
                  ))}
                </CustomSelect>
                {poEntries.length > 1 && (
                  <IconButton onClick={() => removePoEntry(idx)} color="error">
                    <MdDelete />
                  </IconButton>
                )}
              </Box>
              <CustomTextField
                fullWidth
                margin="normal"
                label="Quantity"
                name="quantity"
                value={entry.quantity}
                onChange={e => {
                  handleEntryChange(idx, "quantity", e.target.value);
                  if (
                    Number(e.target.value) > Number(demandQuantity) &&
                    (!entry._exceededToastShown)
                  ) {
                    toast.error("You are exceeding demand Qty.");
                    handleEntryChange(idx, "_exceededToastShown", true);
                  } else if (Number(e.target.value) <= Number(demandQuantity) && entry._exceededToastShown) {
                    handleEntryChange(idx, "_exceededToastShown", false);
                  }
                }}
                error={!!errors[idx]?.quantity}
                helperText={errors[idx]?.quantity}
              />
              {Number(entry.quantity) > Number(demandQuantity) && (
                <>
                  <Box mt={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={confirmations[idx]}
                          onChange={(e) => handleConfirmationChange(idx, e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Are you sure you want to create this PO with quantity greater than demand?"
                    />
                    {errors[idx]?.confirmation && (
                      <Typography color="error" variant="caption" display="block" mt={1}>
                        {errors[idx].confirmation}
                      </Typography>
                    )}
                  </Box>
                  <CustomTextField
                    fullWidth
                    margin="normal"
                    label="Notes"
                    name="notes"
                    value={entry.notes}
                    onChange={e => handleEntryChange(idx, "notes", e.target.value)}
                    error={!!errors[idx]?.notes}
                    helperText={errors[idx]?.notes || "Required if PO quantity exceeds demand."}
                    required
                  />
                </>
              )}
              {Number(entry.quantity) <= Number(demandQuantity) && (
                null
              )}
            </Box>
          ))}
          <Button buttonText={"Add PO"} onClick={addPoEntry} disabled={loading} />
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
            onClick={onClose}
            disabled={loading}
          >
            Back
          </button>
          <Button
            buttonText={loading ? "Creating..." : "Create Purchase Order(s)"}
            onClick={handleSubmit}
            disabled={isCreateDisabled}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
