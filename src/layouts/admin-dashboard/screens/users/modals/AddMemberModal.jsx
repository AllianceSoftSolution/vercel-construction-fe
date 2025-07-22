import React, { useState } from "react";
import TopBar from "@/components/ui/TopBar";
import CustomTextField from "@/mui/CustomTextField";

const AddMemberModal = ({ onClose, onAddUserClick, loading = false }) => {
  const [form, setForm] = useState({ name: "", email: "", note: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUserClick(form);
  };

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-[450px] max-h-[90vh] border-[0.5px] border-[#CDC9C9] rounded-2xl p-0 flex flex-col overflow-hidden">
        {/* TopBar stays fixed at the top of the modal */}
        <div className="p-4 border-b border-[#CDCDCD]">
          <TopBar
            title="Add Member"
            detail="Add New User Information in Epos Software"
          />
        </div>

        {/* Scrollable content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-auto p-4 flex flex-col gap-y-4"
        >
          <CustomTextField
            label="Member Name"
            fullWidth
            name="name"
            placeholder="Enter Member Name"
            type="text"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />
          <CustomTextField
            label="Email"
            fullWidth
            name="email"
            placeholder="Enter Member Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <CustomTextField
            label="Note (optional)"
            fullWidth
            name="note"
            placeholder="Enter a note (optional)"
            type="text"
            value={form.note}
            onChange={handleChange}
            disabled={loading}
          />
          <div className="flex gap-x-4 justify-end mt-4">
            <button
              type="button"
              className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary px-8 py-2 rounded-lg font-medium text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
