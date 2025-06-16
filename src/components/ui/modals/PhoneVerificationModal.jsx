import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import {
    TextField, InputLabel, Grid, InputAdornment,
    Select, MenuItem, FormControlLabel, Radio,
    Checkbox, IconButton, useMediaQuery
} from '@mui/material';
import bulbIcon from '@/assets/nursing/bulb.png';
import warningIcon from '@/assets/nursing/warning.png';

function PhoneVerificationModal({ open, onClose }) {
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');


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
                    width: isSmallScreen ? '80%' : isMediumScreen ? '80%' : '40%', // Adjust width for different screen sizes
                    maxHeight: '90vh', // Keep height responsive
                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: isSmallScreen ? 1 : isMediumScreen ? 4 : 3,
                    borderRadius: 2,
                }}>

                <div className=' md:p-10'>

                    <div className='flex items-center justify-center'>
                        <div>
                            <img src={warningIcon} alt="" />
                        </div>
                    </div>
                    <div className='flex flex-col md:p-0  px-0 items-center justify-center'>
                        <p className='text-center text-[red] font-bold text-2xl'>Are you sure!</p>
                        <div>
                            <FormControlLabel
                                sx={{
                                    textAlign: 'center',
                                }}
                                control={
                                    <Checkbox
                                        sx={{

                                            textAlign: 'center',
                                            color: '#052654', // Unchecked color
                                            '&.Mui-checked': {
                                                color: '#052654', // Checked color
                                            },
                                        }}
                                    />
                                }
                                label="Do you want to end the exam?"
                            />
                        </div>
                        <div className='flex mt-10 items-center justify-center gap-x-5'>

                            <Button
                                variant="contained"
                                className="bg-[#1C588C] text-white py-2 px-10 rounded-full"
                                sx={{
                                    bgcolor: "#FF6C12",
                                    borderRadius: "50px",
                                    fontSize: { xs: '12px' },
                                    "&:hover": {
                                        bgcolor: "#FF6C12",
                                        fontWeight: ' bold'
                                    }
                                }}
                            >
                                Create Test
                            </Button>

                            <Button
                                variant="contained"
                                className="bg-[#1C588C] text-white py-2 px-10 rounded-full"
                                sx={{
                                    bgcolor: "red",
                                    borderRadius: "50px",
                                    fontSize: { xs: '12px' },
                                }}
                            >
                                End Test
                            </Button>

                        </div>
                    </div>
                </div>



            </Box>
        </Modal >
    );
}

export default PhoneVerificationModal;
