import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, MenuItem, IconButton } from "@mui/material";
import CustomTextField from "../../../../mui/CustomTextField";
import { Delete as DeleteIcon } from "@mui/icons-material";

const CreatePOModal = ({
  open,
  onClose,
  onSubmit,
  product,
  vendorOptions = [],
  totalQuantity = 0,
}) => {
  const [entries, setEntries] = useState([{ vendor: "", quantity: "" }]);

  const totalEntered = entries.reduce(
    (sum, entry) => sum + (parseFloat(entry.quantity) || 0),
    0
  );
  const remainingQty = totalQuantity - totalEntered;

  const handleEntryChange = (index, field, value) => {
    const updated = [...entries];

    if (field === "quantity") {
      const numValue = parseFloat(value) || 0;
      const currentQty = parseFloat(updated[index].quantity) || 0;
      const newTotal = totalEntered - currentQty + numValue;

      // Prevent entering more than total allowed
      if (newTotal > totalQuantity) return;
    }

    updated[index][field] = value;
    setEntries(updated);
  };

  const handleAddEntry = () => {
    if (remainingQty <= 0) return;
    setEntries([...entries, { vendor: "", quantity: "" }]);
  };

  const handleRemoveEntry = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  const isSubmitDisabled =
    totalEntered > totalQuantity ||
    totalEntered === 0 ||
    entries.some((e) => !e.vendor || !e.quantity);

  const handleSubmit = () => {
    onSubmit({ product, entries });
    setEntries([{ vendor: "", quantity: "" }]);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setEntries([{ vendor: "", quantity: "" }]);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Create Multiple Purchase Orders
        </Typography>

        <CustomTextField fullWidth label="Product" value={product} disabled />

        <div className="mt-4 flex flex-col gap-4 max-h-[50vh] overflow-auto">
          {entries.map((entry, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <CustomTextField
                  fullWidth
                  label="Vendor"
                  select
                  value={entry.vendor}
                  onChange={(e) =>
                    handleEntryChange(index, "vendor", e.target.value)
                  }
                >
                  {vendorOptions.map((v, i) => (
                    <MenuItem key={i} value={v}>
                      {v}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </div>
              <div className="col-span-4">
                <CustomTextField
                  fullWidth
                  autoFocus
                  type="number"
                  label="Quantity"
                  value={entry.quantity}
                  onChange={(e) =>
                    handleEntryChange(index, "quantity", e.target.value)
                  }
                  inputProps={{
                    min: 1,
                    max: totalQuantity,
                  }}
                />
              </div>
              <div className="col-span-2">
                <IconButton
                  onClick={() => handleRemoveEntry(index)}
                  disabled={entries.length === 1}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Typography
            variant="body2"
            color={totalEntered > totalQuantity ? "error" : "text.secondary"}
          >
            Total Entered: {totalEntered} / {totalQuantity}
          </Typography>
          <button
            className={`text-sm font-medium ${
              remainingQty <= 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-primary"
            }`}
            onClick={handleAddEntry}
            disabled={remainingQty <= 0}
          >
            + Add Another PO
          </button>
        </div>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <button className="px-4 py-2 rounded-full" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-full bg-primary text-white"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            Create PO(s)
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePOModal;
