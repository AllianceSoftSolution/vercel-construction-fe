import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import { TextField, InputLabel, Grid, InputAdornment, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import book from '@/assets/nursing/book.png'

import { Visibility, VisibilityOff } from '@mui/icons-material';
function ChangePassword({ open, onClose }) {
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

        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '60%', // Adjust width for different screen sizes
                    height: isSmallScreen ? '90vh' : '70vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: isSmallScreen ? 1 : isMediumScreen ? 3 : 4,
                    borderRadius: 2,
                }}
            >
                <div className="flex justify-end items-center mb-5">
                    <Close className="text-black cursor-pointer" onClick={onClose} />
                </div>

                <Box p={3}>

                    <Grid container spacing={4}>

                        <Grid item xs={12} xl={4}>
                            <Box>
                                <img src={book} className='   md:w-auto md:h-auto  w-[100px]' alt="" />
                            </Box>
                            <Box mt={4}>
                                <Typography fontWeight={600} variant="h6" gutterBottom>
                                    Choose Your Extension Duration
                                </Typography>

                                <Box sx={{ p: { xs: 0, md: 1 } }}>
                                    <Typography>
                                        Extension doesn’t reset your Q-bank usage. It will extend the validity days, so you can complete your unused questions and review previous tests. If you are looking for a fresh product please buy a new subscription from the website.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} xl={8}>

                            <Box sx={{
                                p: { xs: 2, md: 4 },
                                bgcolor: '#242E4C',
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>

                                <Box>
                                    <Typography sx={{
                                        color: 'white',
                                        fontSize: isSmallScreen ? '12px' : '16px',
                                        fontWeight: 600
                                    }}>Extend For</Typography>
                                </Box>

                                <Box>
                                    <Typography sx={{
                                        color: 'white',
                                        fontSize: isSmallScreen ? '12px' : '16px',
                                        fontWeight: 600
                                    }}>Price</Typography>
                                </Box>

                                <Box>
                                    <Typography sx={{
                                        color: 'white',
                                        fontSize: isSmallScreen ? '12px' : '16px',
                                        fontWeight: 600
                                    }}>Peer Score</Typography>
                                </Box>
                            </Box>

                            {
                                [1, 2, 3, 4].map((index) => (
                                    <Box sx={{
                                        p: { xs: 1, md: 1 },
                                        bgcolor: 'white',
                                        color: 'black',
                                        borderRadius: 2,
                                        mt: 2,
                                        border: '1px solid #D0D5DD',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>

                                        <Box>
                                            <Typography sx={{ fontSize: isSmallScreen ? '12px' : '16px', fontWeight: 600 }}>Basic Care and Comfort</Typography>
                                        </Box>

                                        <Box>
                                            <Typography sx={{ fontSize: isSmallScreen ? '12px' : '16px', fontWeight: 600 }}>$69</Typography>
                                        </Box>

                                        <Box>
                                            <Button
                                                sx={{
                                                    bgcolor: index === 1 ? '#00ACFF' : "#D1F0FF",
                                                    padding: isSmallScreen ? '3px 3px' : "8px 18px",
                                                    color: 'black',
                                                    m: 2,
                                                    fontSize: isSmallScreen ? '10px' : '16px',
                                                    borderRadius: isSmallScreen ? '3px ' : 5,
                                                    "&:hover": {
                                                        bgcolor: "#B0D7FF"
                                                    }
                                                }}
                                            >
                                                View Cart
                                            </Button>
                                        </Box>
                                    </Box>

                                ))

                            }







                        </Grid>





                    </Grid>
                </Box>





            </Box>
        </Modal >
    );
}

export default ChangePassword;
