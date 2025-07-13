import React, { useState } from "react";
import CustomTextField from "../../../../../mui/CustomTextField";

const AddNote = ({ onClose, onSave, loading = false }) => {
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (onSave) {
      onSave(note);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-4">
        <h3 className="text-xl font-semibold">Add Note</h3>
        <CustomTextField
          name="note"
          label="Add Reason"
          placeholder="Enter Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex gap-4 w-full mt-8">
        <button 
          className="bg-[#DDDDDD]  px-8 py-2 rounded-lg font-medium text-[#000000]"
          onClick={onClose}
          disabled={loading}
        >
          Back
        </button>
        <button 
          className="bg-primary  px-8 py-2 rounded-lg font-medium text-white"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddNote;
