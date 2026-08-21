import React from "react";
import { createPortal } from "react-dom";
import { FaTrash } from "react-icons/fa";

const DeleteModal = ({ onClose, onConfirm, zIndex = 50, message }) => {
  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm shadow-xl">
        <div className="flex items-center justify-center">
          <FaTrash className="bg-primary text-white w-14 h-14 rounded-full p-4" />
        </div>

        <p
          id="delete-modal-title"
          className="text-black font-semibold m-4 text-center"
        >
          {message || "Are you sure you want to delete?"}
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-[#CC1607] text-white rounded-lg"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-white text-black rounded-lg border border-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
