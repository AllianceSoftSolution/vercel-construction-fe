import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import { TextField, InputLabel, Grid, InputAdornment, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Visibility, VisibilityOff } from '@mui/icons-material';
function ViewProductFeaturesModal({ open, onClose }) {
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



            </Box>
        </Modal >
    );
}

export default ViewProductFeaturesModal;
