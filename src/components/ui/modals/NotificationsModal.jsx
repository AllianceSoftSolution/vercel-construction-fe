import React, { useState } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';

function Notifications({ open, onClose }) {
    // (Unused states are left in place for now)
    const [checked, setChecked] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    // Function to handle when a notification is clicked.
    const handleNotificationClick = (notification) => {
        console.log("Notification clicked:", notification);
        // Add further interactive behavior here (e.g., mark as read, open details, etc.)
    };

    // Example notifications data.
    // Note: IDs are repeated in the sample data; therefore, we use index to ensure uniqueness.
    const notifications = [
        {
            id: 1,
            text: "Your Science test is scheduled for tomorrow at 10:00 AM. Prepare well!",
            bgColor: "#FF6C12",
            sideColor: "#FCCDB1",
            timeAgo: "2h ago",
        },
        {
            id: 2,
            text: "Math quiz is rescheduled to next Monday at 9:00 AM.",
            bgColor: "#052654",
            sideColor: "#DBEAFF",
            timeAgo: "1h ago",
        },
        {
            id: 1,
            text: "Your Science test is scheduled for tomorrow at 10:00 AM. Prepare well!",
            bgColor: "#FF6C12",
            sideColor: "#FCCDB1",
            timeAgo: "2h ago",
        },
        {
            id: 2,
            text: "Math quiz is rescheduled to next Monday at 9:00 AM.",
            bgColor: "#052654",
            sideColor: "#DBEAFF",
            timeAgo: "1h ago",
        },
        {
            id: 1,
            text: "Your Science test is scheduled for tomorrow at 10:00 AM. Prepare well!",
            bgColor: "#FF6C12",
            sideColor: "#FCCDB1",
            timeAgo: "2h ago",
        },
        {
            id: 2,
            text: "Math quiz is rescheduled to next Monday at 9:00 AM.",
            bgColor: "#052654",
            sideColor: "#DBEAFF",
            timeAgo: "1h ago",
        },
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '60%',
                    height: isSmallScreen ? '90vh' : '70vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: isSmallScreen ? 2 : 2,
                    borderRadius: 3,
                }}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                    <Typography variant="h5" fontWeight={700}>
                        Notifications
                    </Typography>
                    <div>
                        <Close className="text-black cursor-pointer" onClick={onClose} />
                    </div>
                </div>

                {/* Notifications List */}
                {notifications.map((item, index) => (
                    <Box
                        key={`${item.id}-${index}`}
                        onClick={() => handleNotificationClick(item)}
                        sx={{
                            position: 'relative',
                            mt: 2,
                            mb: 2,
                            height: '130px', // Fixed height for consistency
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            },
                        }}
                    >
                        {/* Background Box */}
                        <Box
                            sx={{
                                bgcolor: item.bgColor, // Dynamic background color
                                position: 'absolute',
                                borderRadius: 2,
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '130px',
                            }}
                        />

                        {/* Inner Right Portion */}
                        <Box
                            height="inherit"
                            sx={{
                                background: item.sideColor, // Dynamic right-side color
                                ml: '8px',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            <Typography sx={{ fontSize: isSmallScreen ? 16 : 24 }}>
                                {item.text}
                            </Typography>
                            <Box display="flex" justifyContent="end">
                                <Typography variant="body1" fontWeight="bold">
                                    {item.timeAgo}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Modal>
    );
}

export default Notifications;
