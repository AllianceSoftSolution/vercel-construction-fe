import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import {
    TextField, InputLabel, Grid, InputAdornment,
    Select, MenuItem, FormControlLabel, Radio,
    Checkbox, IconButton, useMediaQuery
} from '@mui/material';
import bulbIcon from '@/assets/nursing/bulb.png';
// import warningIcon from '@/assets/nursing/warning.png';
// import warningIcon from '@/assets/nursing/warning.png';
import pendingReview from '@/assets/nursing/pending-review.png';
import lowConf from '@/assets/nursing/low-confidence.png';
import highConf from '@/assets/nursing/high-confidence.png';
import whiteConf from '@/assets/nursing/white-conf.png';
// 
import { Close } from '@mui/icons-material';

function ReviewQuestionSummary({ open, onClose }) {
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

                <div className='flex justify-end'>
                    <Close sx={{ cursor: 'pointer' }} onClick={onClose} />
                </div>
                <div className='flex justify-center  items-center'>
                    <div>
                        <div className='flex justify-center'>
                            <img src={pendingReview} alt="" />

                        </div>

                        <p className='font-bold text-center'>Here is your
                            <span className='text-blue-400'> Pending review </span>
                            question’s summary</p>
                        <div className='mt-4 gap-y-8 rounded-lg bg-[#D1F0FF] p-2 md:p-7'>

                            <div className='flex justify-end gap-x-7'>
                                <p className='font-bold'>Question</p>
                                <p className='font-bold'>Time Spent</p>
                            </div>
                            <div className='flex justify-between items-center gap-x-7'>
                                <img src={lowConf} alt="" className='w-12 h-12' />
                                <p>1</p>
                                <p>12s</p>
                            </div>
                            <div className='flex justify-between items-center gap-x-7'>
                                <img src={highConf} alt="" className='w-12 h-12' />
                                <p>1</p>
                                <p>12s</p>
                            </div>
                            <div className='flex justify-between items-center gap-x-7'>
                                <img src={whiteConf} alt="" className='w-12 h-12' />
                                <p>1</p>
                                <p>12s</p>
                            </div>

                        </div>


                    </div>
                </div>
                <div className='mt-8'>
                    <div className='lg:flex justify-between gap-x-4'>
                        {[{ img: pendingReview, title: 'Pending Review', subtitle: '517 Questions' },
                        { img: lowConf, title: 'Low Confidence', subtitle: '517 Questions' },
                        { img: highConf, title: 'High Confidence', subtitle: '15 Sec Spent' },
                            // { img: reAttemptCorrect, title: 'Correct on Re-attempt', subtitle: '517 Questions' }
                        ].map((item, index) => (
                            <div key={index} className='flex flex-col items-center bg-white p-6 rounded-3xl shadow-lg'>
                                <img src={item.img} alt={item.title} className='mb-4' />
                                <p className='text-lg font-bold'>{item.title}</p>
                                <div className='p-2 text-sm  mt-2'>These questions haven't been reviewed yet. Dive in, test your knowledge, and identify areas that might need further study.</div>
                                <button
                                    onClick={() => {
                                        // setOpenReviewModal(true)

                                    }}
                                    className='bg-[#D1F0FF]  rounded-3xl px-8 py-2 mt-6'>Review Now</button>
                            </div>
                        ))}

                    </div>

                </div>


            </Box>
        </Modal >
    );
}

export default ReviewQuestionSummary;
