import React, { useState } from 'react';
import {
    Modal,
    Box,
    Button,
    Grid,
    TextField,
    InputLabel,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import eyeBrow from '@/assets/nursing/eye-brow.png';
import apiClient from '../../../api/apiClient';  // Assuming apiClient is set up to make API requests
import toast from 'react-hot-toast';

function ChangePassword({ open, onClose }) {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Form state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggleOldPassword = () => {
        setShowOldPassword((prev) => !prev);
    };

    const handleToggleNewPassword = () => {
        setShowNewPassword((prev) => !prev);
    };

    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            toast.error('Please fill out both fields.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await apiClient.post('auth/change-password', {
                currentPassword: oldPassword,
                newPassword: newPassword,
            });
            if (!response.ok) {
                throw new Error(response.error)
            }
            // Assuming the server returns a success message on successful password change
            toast.success('Password changed successfully');
            onClose();  // Close the modal on success
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '40%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: isSmallScreen ? 5 : isMediumScreen ? 4 : 8,
                    borderRadius: 15,
                }}
            >
                {/* Close Icon */}
                <div className="flex justify-end items-center mb-5">
                    <Close className="text-black cursor-pointer" onClick={onClose} />
                </div>

                {/* Title */}
                <div className="text-center mb-6 md:mb-10">
                    <span className="text-black font-semibold text-3xl">
                        Change Password
                    </span>
                </div>

                <Grid container spacing={2}>
                    {/* Old Password Field */}
                    <Grid item xs={12}>
                        <div className="mb-5">
                            <InputLabel sx={{ color: 'black' }}>
                                Enter Old Password
                            </InputLabel>
                            <TextField
                                fullWidth
                                placeholder="Enter Old Password"
                                type={showOldPassword ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                sx={{
                                    bgcolor: '#f1faff',
                                    color: 'gray',
                                    borderRadius: 4,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleToggleOldPassword}
                                                edge="end"
                                                sx={{ color: 'black' }}
                                            >
                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </Grid>

                    {/* New Password Field */}
                    <Grid item xs={12}>
                        <div className="mb-5">
                            <InputLabel sx={{ color: 'black' }}>
                                Enter New Password
                            </InputLabel>
                            <TextField
                                fullWidth
                                placeholder="Enter New Password"
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                sx={{
                                    bgcolor: '#f1faff',
                                    color: 'gray',
                                    borderRadius: 4,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'white',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'white',
                                        },
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleToggleNewPassword}
                                                edge="end"
                                                sx={{ color: 'black' }}
                                            >
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>

                {/* Save Button */}
                <div className="mt-5">
                    <Button
                        sx={{
                            width: '100%',
                            borderRadius: 30,
                            padding: '10px',
                            fontWeight: 'bold',
                            bgcolor: '#031957',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#031957',
                            },
                        }}
                        onClick={handleChangePassword}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Changing Password...' : 'Change Password'}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default ChangePassword;


// import React, { useState } from 'react';
// import { Modal, Box, Typography, Button } from '@mui/material';
// import { Close, Edit } from '@mui/icons-material';
// import { TextField, InputLabel, Grid, InputAdornment, IconButton } from '@mui/material';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import eyeBrow from '@/assets/nursing/eye-brow.png';

// function ChangePassword({ open, onClose }) {
//     const [checked, setChecked] = useState(false);
//     const [selectedValue, setSelectedValue] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };

//     const isSmallScreen = useMediaQuery('(max-width: 640px)');
//     const isMediumScreen = useMediaQuery('(max-width: 768px)');
//     const isLargeScreen = useMediaQuery('(min-width: 1024px)');

//     const handleChange = (event) => {
//         setSelectedValue(event.target.value);
//     };

//     const handleCheckboxChange = (event) => {
//         setChecked(event.target.checked);
//     };

//     return (
//         <Modal
//             open={open}
//             onClose={onClose}
//             aria-labelledby="modal-title"
//             aria-describedby="modal-description"
//         >
//             <Box
//                 sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '40%', // Adjust width for different screen sizes
//                     maxHeight: '90vh', // Keep height responsive
//                     overflowY: 'auto',
//                     bgcolor: 'white',
//                     boxShadow: 24,
//                     p: isSmallScreen ? 5 : isMediumScreen ? 4 : 8,
//                     borderRadius: 15,
//                 }}
//             >
//                 <div className="flex justify-end items-center mb-5">

//                     <Close className="text-black cursor-pointer" onClick={onClose} />
//                 </div>
//                 <div className='text-center mb-6 md:mb-10'>
//                     <span className="text-black font-semibold text-3xl">Change Password</span>
//                 </div>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} md={12}>
//                         <div className="mb-5">
//                             <InputLabel sx={{ color: 'black' }}>Enter Old Password</InputLabel>
//                             <TextField
//                                 fullWidth
//                                 placeholder={'Enter Old Password'}
//                                 type={showPassword ? 'text' : 'password'} // Show/hide password based on state
//                                 sx={{
//                                     bgcolor: '#f1faff',
//                                     color: 'gray',
//                                     borderRadius: 4,
//                                     '& .MuiOutlinedInput-root': {
//                                         '& fieldset': {
//                                             borderColor: 'white', // Custom border color
//                                         },
//                                         '&:hover fieldset': {
//                                             borderColor: 'white', // Border color on hover
//                                         },
//                                         '&.Mui-focused fieldset': {
//                                             borderColor: 'white', // Border color when focused
//                                         },
//                                     },
//                                 }}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 onClick={handleClickShowPassword} // Toggle visibility
//                                                 edge="end"
//                                                 sx={{
//                                                     color: 'black', // Icon color
//                                                 }}
//                                             >
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />} {/* Toggle between eye icons */}

//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                         </div>
//                     </Grid>

//                     <Grid item xs={12} md={12}>
//                         <div className="mb-5">
//                             <InputLabel sx={{ color: 'black' }}>Enter New Password</InputLabel>
//                             <TextField
//                                 fullWidth
//                                 placeholder={'Enter New Password'}
//                                 type={showPassword ? 'text' : 'password'} // Show/hide password based on state
//                                 sx={{
//                                     bgcolor: '#f1faff',
//                                     color: 'gray',
//                                     borderRadius: 4,
//                                     '& .MuiOutlinedInput-root': {
//                                         '& fieldset': {
//                                             borderColor: 'white', // Custom border color
//                                         },
//                                         '&:hover fieldset': {
//                                             borderColor: 'white', // Border color on hover
//                                         },
//                                         '&.Mui-focused fieldset': {
//                                             borderColor: 'white', // Border color when focused
//                                         },
//                                     },
//                                 }}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 onClick={handleClickShowPassword} // Toggle visibility
//                                                 edge="end"
//                                                 sx={{
//                                                     color: 'black', // Icon color
//                                                 }}
//                                             >
//                                                 <img src={eyeBrow} alt="" />

//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                         </div>
//                     </Grid>

//                 </Grid>

//                 {/* Add Save button */}
//                 <div className="mt-5">
//                     <Button

//                         sx={{
//                             width: '100%',
//                             borderRadius: '8px',
//                             padding: '10px',
//                             fontWeight: 'bold',
//                             bgcolor: '#031957',
//                             color: 'white',
//                             "&:hover": {
//                                 color: 'black',
//                                 border: '1px solid black'
//                             }
//                         }}
//                         onClick={() => console.log("Save changes")}
//                     >
//                         Save Changes
//                     </Button>
//                 </div>
//             </Box>
//         </Modal >
//     );
// }

// export default ChangePassword;
