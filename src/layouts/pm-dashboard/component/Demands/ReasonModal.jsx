import { Button, TextareaAutosize } from "@mui/material";
import CustomTextField from "../../../../mui/CustomTextField";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ReasonModal({onBackClick,onSaveClick }) {
  const [reasonText, setReasonText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveClick(reasonText);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-xl p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[#12141d] text-3xl font-medium mb-8">Add Reason</h1>

        <div className="mb-10">
          <CustomTextField
            label="Remarks"
            className="w-full"
            placeholder="Enter your remarks here..."
            value={reasonText}
            handleChange={(e) => setReasonText(e.target.value)}
          
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
          onClick={onBackClick}
            variant="outline"
            className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#dddddd] px-8 py-3 rounded-xl text-lg font-medium"
          >
            Back
          </button>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving}
          className="bg-[#fc8908] hover:bg-[#e07a07] text-white px-8 py-3 rounded-xl text-lg font-medium"
          >
           
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
