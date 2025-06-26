import { Button, TextareaAutosize } from "@mui/material";
import CustomTextField from "../../../../mui/CustomTextField";

export default function ReasonModal({onBackClick,onSaveClick, textAreaPlaceholder }) {
  return (
    <div className="bg-[#ffffff] rounded-xl p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[#12141d] text-3xl font-medium mb-8">Add Reason</h1>

        <div className="mb-10">
          <CustomTextField
            label="Business Structure (Optional)"
            className="w-full"
            placeholder={textAreaPlaceholder}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
          onClick={onBackClick}
            variant="outline"
            className="bg-[#dddddd] text-[#000000] border-[#dddddd] hover:bg-[#b0b0b0] hover:border-[#b0b0b0] px-8 py-3 rounded-xl text-lg font-medium"
          >
            Back
          </button>
          <button onClick={onSaveClick} className="bg-[#fc8908] hover:bg-[#e07a07] text-white px-8 py-3 rounded-xl text-lg font-medium">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
