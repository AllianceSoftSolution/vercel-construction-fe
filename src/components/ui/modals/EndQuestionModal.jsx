import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import {
    TextField, InputLabel, Grid, InputAdornment,
    Select, MenuItem, FormControlLabel, Radio,
    Checkbox, IconButton, useMediaQuery
} from '@mui/material';
import bulbIcon from '@/assets/nursing/bulb.png';
import endQuestionModalImg from '@/assets/nursing/end-questions-doc.png';


function EndQuestionModal({ open, onClose }) {
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
                    p: isSmallScreen ? 1 : isMediumScreen ? 4 : 3,
                    borderRadius: 2,
                }}>

                <div className=' md:p-10 p-2'>
                    <div className='flex justify-center items-center'>
                        <img src={endQuestionModalImg} alt="" />
                    </div>
                    <p className='text-center font-bold text-2xl mt-8'>Do you want to end this exam?</p>
                    <p className='text-center md:px-7'>Once you choose to end test, it cannot be resumed, and any unanswered questions will be
                        <span className='text-[#FF0000] font-bold'> OMITTED </span>
                        . If you have unanswered questions, you can pause and return later. Please end the test only after completing all questions.</p>
                    <div className='mt-6 flex justify-center items-center gap-x-5'>
                        <button className='bg-[#FF6C12] text-white py-2 px-5  md:px-10  rounded-3xl hover:scale-105'>Resume Text</button>
                        <button className='bg-[#062653] text-white py-2 px-5 md:px-10  rounded-3xl hover:scale-105'>End Test</button>

                    </div>



                </div>



            </Box>
        </Modal >
    );
}

export default EndQuestionModal;
