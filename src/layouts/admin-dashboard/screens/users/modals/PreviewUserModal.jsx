import React from "react";
import {
    Modal,
    Box,
    Typography,
    Avatar,
    IconButton,
    Divider,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    width: "90%",
    maxWidth: 500,
};

const PreviewUserModal = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    const getInitials = () => {
        const first = user.first_name?.[0] || "U";
        const last = user.last_name?.[0] || "";
        return `${first}${last}`;
    };

    const DetailRow = ({ label, value }) => (
        <Box display="flex" justifyContent="space-between" py={1}>
            <Typography fontWeight="500">{label}:</Typography>
            <Typography>{value || "N/A"}</Typography>
        </Box>
    );

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                {/* Close Icon */}
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Header */}
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                        {getInitials()}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {user.first_name} {user.last_name}
                        </Typography>
                        <Typography color="text.secondary">{user.email}</Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Details */}
                <Box mt={2}>
                    <DetailRow label="ID" value={user.id} />
                    <DetailRow label="Phone" value={user.phone} />
                    <DetailRow label="Program Type" value={user.program_type} />
                    <DetailRow label="Role" value={user.role} />
                </Box>

                {/* Footer */}
                <Box display="flex" justifyContent="flex-end" mt={4}>
                    <button
                        onClick={onClose}
                        type="submit"
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                    >
                        Close
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PreviewUserModal;


// import React from "react";

// const PreviewUserModal = ({ isOpen, onClose, user }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
//                 <h3 className="text-xl font-semibold mb-4">User Details</h3>
//                 <div className="space-y-4">
//                     <div><span className="font-medium">ID:</span> {user.id}</div>
//                     <div><span className="font-medium">Name:</span> {user.first_name || "N/A"} {user.last_name || ""}</div>
//                     <div><span className="font-medium">Email:</span> {user.email || "N/A"}</div>
//                     <div><span className="font-medium">Phone:</span> {user.phone || "N/A"}</div>
//                     <div><span className="font-medium">Program Type:</span> {user.program_type || "N/A"}</div>
//                     <div><span className="font-medium">Role:</span> {user.role || "N/A"}</div>
//                 </div>
//                 <div className="flex justify-end mt-6">
//                     <button
//                         onClick={onClose}
//                         className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PreviewUserModal;