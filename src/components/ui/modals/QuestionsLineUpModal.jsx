import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import {
    TextField, InputLabel, Grid, InputAdornment,
    Select, MenuItem, FormControlLabel, Radio,
    Checkbox, IconButton, useMediaQuery
} from '@mui/material';
import bulbIcon from '@/assets/nursing/bulb.png';
import warningIcon from '@/assets/nursing/warning.png';

function QuestionsLineupModal({ open, onClose }) {
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
                    width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '60%', // Adjust width for different screen sizes
                    height: isSmallScreen ? '90vh' : '70vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: isSmallScreen ? 1 : isMediumScreen ? 4 : 0,
                    borderRadius: 2,
                }}>
                <div className=''>

                    <div className='bg-[#062653]  p-4'>

                        <p> <span className='font-bold text-white text-2xl'>Question Lineup</span> <span className='font-bold text-white'>- Select a question to go to it</span></p>
                    </div>
                    <div className='bg-[#0F5484] flex justify-between md:px-8 p-2'>

                        <p className='text-white font-bold text-xl'>S.No</p>
                        <p className='text-white font-bold text-xl'>Marked</p>
                        <p className='text-white font-bold text-xl'>Notes</p>

                    </div>
                    {
                        [1, 2, 3, 4, 5].map((item, index) => {
                            return <>
                                <div className='flex justify-between mt-3 md:px-8 p-2'>
                                    <p className=' font-bold '>01</p>
                                    <p className=' font-bold '>Unsaved</p>
                                    <p className=' font-bold '>Notes</p>
                                </div>
                            </>
                        })
                    }
                    <div className='px-4 my-10 flex justify-between items-center'>
                        <p className='text-[#0F5484] font-bold '>0 Unanswered, 5 Unused </p>
                        <button
                            onClick={onClose}
                            className='bg-[#031957] text-white font-bold py-2 px-10 rounded-3xl '>Close</button>
                    </div>


                </div>
            </Box>
        </Modal >
    );
}

export default QuestionsLineupModal;
