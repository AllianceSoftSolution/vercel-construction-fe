import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import {
    TextField, InputLabel, Grid, InputAdornment,
    Select, MenuItem, FormControlLabel, Radio,
    Checkbox, IconButton, useMediaQuery
} from '@mui/material';
import bulbIcon from '@/assets/nursing/bulb.png';
import navLogo from '@/assets/nursing/nav-logo.png';
import threelines1 from '@/assets/nursing/three-lines.png';
import threelines2 from '@/assets/nursing/three-lines-2.png';
import chat from '@/assets/nursing/chat.png';
import fav from '@/assets/nursing/fav-icon.png';
import end from '@/assets/nursing/end.png';
import pause from '@/assets/nursing/pause.png';
import arrowNext from '@/assets/nursing/next-arrow.png';
import arrowPrev from '@/assets/nursing/prev-arrow.png';
import scale from '@/assets/nursing/scale.png';

import QuestionsLineupModal from './QuestionsLineUpModal';
import QuestionsNotesModal from './QuestionsNotesModal';
import EndQuestionModal from './EndQuestionModal';
import QuestionsFeedbackModal from './QuestionsFeedbackModal';
import { Close, Done, DoneAll, DoneOutline } from '@mui/icons-material';
function RevealAnswerModal({ open, onClose }) {
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const [openQuestionLineupModal, setOpenQuestionLineupModal] = useState(false);
    const [openQuestionsNotesModal, setOpenQuestionsNotesModal] = useState(false);
    const [openEndQuestionModal, setOpenEndQuestionModal] = useState(false);
    const [openQuestionsFeedbackModal, setOpenQuestionsFeedbackModal] = useState(false);
    const filters = [
        { key: 'subject', label: 'Subject', value: 'Maternal & Newborn Health' },
        { key: 'lesson', label: 'Lesson', value: 'Maternal & Newborn Health' },
        { key: 'clientNeedArea', label: 'Client Need Area', value: 'Physiological Adaptation' },
        { key: 'clientNeedTopic', label: 'Client Need Topic', value: 'Alterations in Body Systems' },
        { key: 'questionType', label: 'Question Type', value: 'Application' },
    ];

    // Store the active state for each filter in an object.
    const [selectedFilters, setSelectedFilters] = useState({});

    // Toggle the active state for a given filter key.
    const toggleFilter = (key) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
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
                    width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '60%', // Adjust width for different screen sizes
                    height: isSmallScreen ? '90vh' : '70vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: isSmallScreen ? 0 : isMediumScreen ? 4 : 0,
                    borderRadius: 3,
                }}>

                <div className="  ">
                    {/* Container */}
                    <div className="  shadow-lg ">
                        {/* Header */}
                        <div className="bg-[#021836] text-white p-4 rounded-t-lg md:flex justify-between items-center">
                            <div className='md:flex text-center mt-2 md:mt-0   gap-x-3'>
                                <img src={navLogo} alt="" />
                                <div className=''>
                                    <h1 className="text-lg font-bold">AANU AYANDIPE</h1>
                                    <p className="text-sm">Tutorial Number here</p>
                                </div>

                            </div>

                            <div className='text-center mt-2 md:mt-0'>
                                <p className='text-white font-bold'>Tutorial Number here </p>
                                <p className='text-white text-sm text-center'>QUID: quid no. here </p>

                            </div>


                            <div className='text-center mt-2 md:mt-0'>
                                <p className="text-sm">Time Elapsed</p>
                                <p className="text-sm font-bold">14:56:05</p>
                            </div>
                        </div>

                        <div className='w-full p-3 bg-[#0F5484]'>
                            <div className='flex justify-between'>
                                <div className='flex gap-x-3'>
                                    <img
                                        onClick={() => setOpenQuestionLineupModal(true)}
                                        className='cursor-pointer' src={threelines1} alt="" />

                                    <img className='cursor-pointer' src={fav} alt="" />
                                </div>


                                <div className='flex gap-x-3'>
                                    <img
                                        onClick={() => setOpenQuestionsNotesModal(true)}
                                        className='cursor-pointer' src={threelines2} alt="" />

                                    <img
                                        onClick={() => setOpenQuestionsFeedbackModal(true)}

                                        className='cursor-pointer' src={chat} alt="" />
                                </div>

                            </div>

                            {/*  */}
                        </div>

                        <div

                            className='w-full md:p-5 bg-[#021836] '>


                            <Grid container spacing={1}>

                                <Grid item xs={12} md={6}>

                                    <div
                                        style={{
                                            overflowY: 'auto',
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                        }}
                                        className='rounded-lg h-[90vh]   overflow-y-scroll  bg-white'>
                                        <div className='p-3'>
                                            <p>
                                                The nurse is caring for a client who is 3 days postpartum and has endometritis.
                                            </p>
                                            <ul className='list-disc ml-12 mt-3'>
                                                <li>Which of the following actions would be appropriate for the nurse to take? Select all that apply. </li>
                                            </ul>
                                        </div>


                                        <div className='bg-[#0F5484] mt-3 w-full p-3 md:px-7'>

                                            <div className='flex items-center gap-x-3'>
                                                <img src={scale} alt="" />
                                                <p className='text-white '>0/2 Your Score/Max</p>
                                            </div>


                                        </div>
                                        <div className='mt-3 p-4'>
                                            <div className='flex mb-4 items-center gap-x-3'>
                                                <div className='flex gap-x-3 items-center'>
                                                    <Done className='cursor-pointer' sx={{ color: 'green' }} />
                                                    <input type="radio" className='cursor-pointer w-5 h-5 accent-[#052654]' />
                                                </div>
                                                <p className=''>
                                                    obtain an order to insert an indwelling urinary catheter
                                                </p>
                                            </div>
                                            <div className='flex mb-4  items-center gap-x-3'>
                                                <div className='flex gap-x-3 items-center'>
                                                    <Close className='cursor-pointer' sx={{ color: 'red' }} />
                                                    <input type="radio" className='cursor-pointer w-5 h-5 accent-[#052654]' />
                                                </div>

                                                <p className=''>
                                                    obtain an order to insert an indwelling urinary catheter
                                                </p>
                                            </div>
                                            <div className='flex mb-4 ml-9  items-center gap-x-3'>
                                                <div className='flex  gap-x-3 items-center'>
                                                    <input type="radio" className='cursor-pointer w-5 h-5 accent-[#052654]' />
                                                </div>

                                                <p className=''>
                                                    obtain an order to insert an indwelling urinary catheter
                                                </p>
                                            </div>
                                            <div className='flex mb-4 ml-9 items-center gap-x-3'>
                                                <div className='flex gap-x-3 items-center'>
                                                    <input type="radio" className='cursor-pointer w-5 h-5 accent-[#052654]' />
                                                </div>

                                                <p className=''>
                                                    obtain an order to insert an indwelling urinary catheter
                                                </p>
                                            </div>
                                            <div className='flex mb-4 ml-9 items-center gap-x-3'>
                                                <div className='flex gap-x-3 items-center'>
                                                    <input type="radio" className='cursor-pointer w-5 h-5 accent-[#052654]' />
                                                </div>

                                                <p className=''>
                                                    obtain an order to insert an indwelling urinary catheter
                                                </p>
                                            </div>
                                            <div className='mt-3'>
                                                <p className='font-bold text-lg'>Statistics</p>
                                                <div className='my-3'>
                                                    <p>
                                                        <span className=''>Difficlty level</span>
                                                        - <span className='text-[#0F5484]'>Medium</span>
                                                    </p>
                                                </div>
                                                <div className='my-3'>
                                                    <p>
                                                        <span className=''><span className='font-bold'>1/2</span> Avg </span>
                                                        - <span className=''>Peer Score</span>
                                                    </p>
                                                </div>
                                                <div className='my-3'>
                                                    <p>
                                                        <span className=''> Time Taken </span>
                                                        - <span className='font-bold'>2009 s</span>
                                                    </p>
                                                </div>
                                                <div className="my-6 gap-x-4 flex flex-wrap">
                                                    {filters.map((filter) => {
                                                        const isActive = selectedFilters[filter.key];

                                                        return (
                                                            <p key={filter.key} className="flex items-center mr-4">
                                                                {filter.label}
                                                                <button
                                                                    onClick={() => toggleFilter(filter.key)}
                                                                    className={`p-2 mb-4 ml-2 rounded-2xl transition-colors duration-200 
                ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-[#021836] text-white hover:bg-gray-300'}`}
                                                                >
                                                                    {filter.value}
                                                                </button>
                                                            </p>
                                                        );
                                                    })}
                                                </div>


                                            </div>
                                        </div>
                                    </div>



                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div
                                        style={{
                                            overflowY: 'auto',
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                        }}
                                        className='p-4 h-[90vh] overflow-y-scroll bg-white rounded-lg'>
                                        <p className='font-bold'>Explanation</p>
                                        {
                                            [1, 2, 3, 4, 5, 6, 7].map((el, index) => {
                                                return <>
                                                    <div className='my-3'>
                                                        <p>
                                                            <span className='font-bold text-sm'>Choice B is correct . </span>
                                                            <span className='text-sm'>Endometritis is a complication that may occur 36-48 hours following delivery. Most infections are polymicrobial, with both aerobic and anaerobic organisms involved. Treatment is with antibiotics such as clindamycin, metronidazole, or ampicillin.</span>
                                                        </p>
                                                    </div>
                                                </>

                                            })
                                        }

                                        <div className='bg-[#0F5484] p-3 rounded-lg'>
                                            <p className='text-white font-bold'>Additional Info</p>
                                            <p className='my-5 flex  '>
                                                <Done className='text-white mr-2' />
                                                <span className='text-white'>
                                                    Endometritis is inflammation of the uterine endometrium. Risk factors are recent vaginal or cesarean birth. The risk is increased if she had an extended labor and ruptured membranes.

                                                </span>
                                            </p>
                                            <p className='my-5 flex  '>
                                                <Done className='text-white mr-2' />
                                                <span className='text-white'>
                                                    Endometritis is inflammation of the uterine endometrium. Risk factors are recent vaginal or cesarean birth. The risk is increased if she had an extended labor and ruptured membranes.

                                                </span>
                                            </p>
                                            <p className='my-5 flex  '>
                                                <Done className='text-white mr-2' />
                                                <span className='text-white'>
                                                    Endometritis is inflammation of the uterine endometrium. Risk factors are recent vaginal or cesarean birth. The risk is increased if she had an extended labor and ruptured membranes.

                                                </span>
                                            </p>
                                            <p className='my-5 flex  '>
                                                <Done className='text-white mr-2' />
                                                <span className='text-white'>
                                                    Endometritis is inflammation of the uterine endometrium. Risk factors are recent vaginal or cesarean birth. The risk is increased if she had an extended labor and ruptured membranes.

                                                </span>
                                            </p>
                                        </div>




                                    </div>

                                </Grid>
                            </Grid>



                        </div>




                        <div className='w-full p-3 bg-[#021836]'>
                            <div className='md:flex justify-between'>
                                <div className='flex gap-x-3'>
                                    <div
                                        onClick={() => setOpenEndQuestionModal(true)}
                                        className='flex cursor-pointer gap-x-3 p-2'>
                                        <img

                                            src={end} alt="" />
                                        <p className='text-white font-bold'>End</p>
                                    </div>
                                    <div className='flex cursor-pointer gap-x-3 p-2'>
                                        <img src={pause} alt="" />
                                        <p className='text-white font-bold'>Pause</p>
                                    </div>


                                </div>


                                <div className='flex gap-x-3'>
                                    <div className='flex cursor-pointer gap-x-3 p-2'>
                                        <img src={arrowPrev} alt="" />
                                        <p className='text-white font-bold'>Previous</p>
                                    </div>
                                    <div className='flex cursor-pointer gap-x-3 p-2'>
                                        <img src={arrowNext} alt="" />
                                        <p className='text-white font-bold'>Next</p>
                                    </div>
                                </div>

                            </div>

                            {/*  */}
                        </div>

                    </div>
                </div>

            </Box>
        </Modal >
    );
}

export default RevealAnswerModal