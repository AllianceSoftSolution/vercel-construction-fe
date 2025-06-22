import React from "react";
import TopBar from "@/components/ui/TopBar";
import CustomTextField from "@/mui/CustomTextField";

const AddMemberModal = ({ onClose, onAddUserClick }) => {
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
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-y-4">
          <CustomTextField
            label="Member Name"
            fullWidth
            name="name"
            placeholder="Enter Member Name"
            type="text"
          />
          <CustomTextField
            label="Email"
            fullWidth
            name="email"
            placeholder="Enter Member Email"
            type="email"
          />
          <CustomTextField
            label="Phone Number"
            fullWidth
            name="phone"
            placeholder="Enter Member Phone Number"
            type="number"
          />
          <CustomTextField
            label="Password"
            fullWidth
            name="password"
            placeholder="Enter Password"
            type="password"
          />
          <CustomTextField
            label="Date Of Joining"
            fullWidth
            name="date"
            placeholder="Enter Member's Date of Joining"
            type="date"
          />
          <CustomTextField
            label="Address"
            fullWidth
            name="address"
            placeholder="Enter Member Address"
            type="text"
          />

          <div className="flex gap-x-4 justify-end mt-4">
            <button
              className="bg-[#DDDDDD] px-8 py-2 rounded-lg font-medium text-[#000000]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button onClick={onAddUserClick} className="bg-primary px-8 py-2 rounded-lg font-medium text-white">
              Save & Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
