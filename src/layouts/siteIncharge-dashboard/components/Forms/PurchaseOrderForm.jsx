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

export default function PurchaseOrderForm({ isOpen, onClose, demandId, sectionId, materialName, materialId, demandQuantity, remainingQuantity = 0 }) {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [poEntries, setPoEntries] = useState([
    { vendorId: "", quantity: "", notes: "" }
  ]);
  const [errors, setErrors] = useState([]);
  const [confirmations, setConfirmations] = useState([false]);
  const [remainingQtyConfirmations, setRemainingQtyConfirmations] = useState([false]);
  const [totalNotes, setTotalNotes] = useState("");
  const [totalNotesError, setTotalNotesError] = useState("");
  
  // Use the remaining quantity from props
  const actualRemainingQuantity = Number(remainingQuantity);

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
    setRemainingQtyConfirmations((prev) => [...prev, false]);
  };

  const removePoEntry = (idx) => {
    if (poEntries.length === 1) return;
    setPoEntries((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => prev.filter((_, i) => i !== idx));
    setConfirmations((prev) => prev.filter((_, i) => i !== idx));
    setRemainingQtyConfirmations((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleConfirmationChange = (idx, checked) => {
    setConfirmations((prev) => prev.map((conf, i) => i === idx ? checked : conf));
  };

  const handleRemainingQtyConfirmationChange = (idx, checked) => {
    setRemainingQtyConfirmations((prev) => prev.map((conf, i) => i === idx ? checked : conf));
  };

  const validateEntries = () => {
    let valid = true;
    const totalPOQuantity = poEntries.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);
    const exceedsTotal = totalPOQuantity > Number(demandQuantity);
    const exceedsRemaining = totalPOQuantity > actualRemainingQuantity;
    
    // Reset total notes error
    setTotalNotesError("");
    
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
      
      // Individual PO validation - only if total doesn't exceed demand
      if (!exceedsTotal && Number(entry.quantity) > Number(demandQuantity)) {
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
    
    // Total PO validation - check for total notes when total exceeds demand
    if (exceedsTotal && (!totalNotes || totalNotes.trim() === "")) {
      setTotalNotesError("Notes are required when total PO quantity exceeds demand");
      valid = false;
    }
    
    // Total PO validation - check for total notes when total exceeds remaining quantity
    if (exceedsRemaining && (!totalNotes || totalNotes.trim() === "")) {
      setTotalNotesError("Notes are required when total PO quantity exceeds remaining demand");
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateEntries()) return;
    setLoading(true);
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < poEntries.length; i++) {
      const entry = poEntries[i];
      const payload = {
        demandId,
        sectionId,
        materialId,
        vendorId: entry.vendorId,
        quantity: Number(entry.quantity),
        notes: entry.notes || totalNotes, // Use individual notes if available, otherwise use total notes
      };
      
      try {
        const response = await apiClient.post("/purchase-orders", payload);
        if (response.ok) {
          successCount++;
        } else {
          failureCount++;
          toast.error(`PO ${i + 1} creation failed: ${response.data?.message || "Unknown error"}`);
        }
      } catch (error) {
        failureCount++;
        toast.error(`PO ${i + 1} creation failed: ${error?.response?.data?.message || "Network error"}`);
      }
    }
    
    setLoading(false);
    
    if (successCount > 0) {
      if (failureCount === 0) {
        toast.success("All purchase orders created successfully!");
      } else {
        toast.success(`${successCount} purchase order(s) created successfully! ${failureCount} failed.`);
      }
      setPoEntries([{ vendorId: "", quantity: "", notes: "" }]);
      setErrors([]);
      setConfirmations([false]);
      setRemainingQtyConfirmations([false]);
      setTotalNotes("");
      setTotalNotesError("");
      onClose();
      window.location.reload();
    } else {
      toast.error("No purchase orders were created. Please try again.");
    }
  };

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setPoEntries([{ vendorId: "", quantity: "", notes: "" }]);
      setErrors([]);
      setConfirmations([false]);
      setRemainingQtyConfirmations([false]);
      setTotalNotes("");
      setTotalNotesError("");
    }
  }, [isOpen]);

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
                  
                  // Individual PO validation (existing logic)
                  if (
                    Number(e.target.value) > Number(demandQuantity) &&
                    (!entry._exceededToastShown)
                  ) {
                    toast.error("You are exceeding demand Qty.");
                    handleEntryChange(idx, "_exceededToastShown", true);
                  } else if (Number(e.target.value) <= Number(demandQuantity) && entry._exceededToastShown) {
                    handleEntryChange(idx, "_exceededToastShown", false);
                  }
                  
                  // Total PO validation (new logic)
                  const newTotal = poEntries.reduce((sum, poEntry, i) => {
                    if (i === idx) {
                      return sum + Number(e.target.value || 0);
                    }
                    return sum + Number(poEntry.quantity || 0);
                  }, 0);
                  
                  if (newTotal > Number(demandQuantity) && !entry._totalExceededToastShown) {
                    toast.error("Total PO quantity exceeds demand quantity!");
                    handleEntryChange(idx, "_totalExceededToastShown", true);
                  } else if (newTotal <= Number(demandQuantity) && entry._totalExceededToastShown) {
                    handleEntryChange(idx, "_totalExceededToastShown", false);
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
            </Box>
          ))}
          
                     {/* Total Notes Field - shown when total PO quantity exceeds demand or remaining quantity */}
           {(poEntries.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0) > Number(demandQuantity) || 
             poEntries.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0) > actualRemainingQuantity) && (
             <Box 
               mt={3} 
               p={2} 
               borderRadius={2} 
               border={"1px solid #ff9800"} 
               bgcolor={"#fff3e0"}
             >
               <Typography variant="subtitle2" color="warning.main" gutterBottom>
                 ⚠️ {poEntries.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0) > Number(demandQuantity) 
                   ? "Total PO quantity exceeds demand quantity" 
                   : "Total PO quantity exceeds remaining demand quantity"}
               </Typography>
               <Typography variant="body2" color="text.secondary" mb={2}>
                 {poEntries.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0) > Number(demandQuantity)
                   ? "The total PO quantity exceeds the demand quantity, please provide notes explaining the reason."
                   : "The total PO quantity exceeds the remaining demand quantity, please provide notes explaining the reason."}
               </Typography>
               <CustomTextField
                 fullWidth
                 margin="normal"
                 label="Notes (Required)"
                 name="totalNotes"
                 value={totalNotes}
                 onChange={(e) => setTotalNotes(e.target.value)}
                 error={!!totalNotesError}
                 helperText={totalNotesError || "Required notes explaining why total PO quantity exceeds demand."}
                 required
               />
             </Box>
           )}
          
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
            disabled={loading}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
