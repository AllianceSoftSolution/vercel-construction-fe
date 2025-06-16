import React from "react";

const DeleteUserModal = ({ isOpen, onClose, user, onDeleteUser, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete {user?.first_name} {user?.last_name}?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDeleteUser(user.id)}
                        disabled={loading}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;