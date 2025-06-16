import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import {
    TextField, InputLabel, Grid, InputAdornment,
    Select, MenuItem, FormControlLabel, Radio,
    Checkbox, IconButton, useMediaQuery
} from '@mui/material';
import bulbIcon from '@/assets/nursing/bulb.png';
import pendingReview from '@/assets/nursing/pending-review.png';
import lowConf from '@/assets/nursing/low-confidence.png';
import highConf from '@/assets/nursing/high-confidence.png';
import ReviewQuestionSummary from './ReviewQuestionSummary';
import warningIcon from '@/assets/nursing/warning.png';
import { ArrowBack, Close, Done, Pending, SkipNext, SkipPrevious } from '@mui/icons-material';

function PendingReviewsModal({ open, onClose }) {
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const [showReviewSummary, setShowReviewSummary] = useState(false);

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
                <div className='flex justify-between mt-3 md:mt-0 items-center '>
                    <div className='flex items-center'>
                        <img src={pendingReview} alt="" className=' w-10 h-10 md:w-16 md:h-16' />
                        <p className='text-sm md:text-2xl font-bold'>
                            Pending Reviews (1/567)
                        </p>
                    </div>
                    <div><Close onClick={onClose} className="cursor-pointer" /></div>
                </div>

                <Grid container spacing={2}>

                    <Grid item xs={12} md={8}>

                        <div className='mt-6 gap-x-5 md:flex items-center'>
                            <p className=''>Question ID</p>
                            <div className='text-center p-2 px-4 my-3 md:my-0  bg-gray-200 rounded-3xl underline'>
                                11320
                            </div>
                            <div className='text-center text-white my-3 md:my-0 p-2 px-8 bg-[red] rounded-3xl font-bold'>
                                1 Missed Attempt
                            </div>
                        </div>

                        <p className='mt-4'>
                            The nurse is planning care for a client with a low serum albumin level.
                        </p>
                        <ul className='list-disc ml-8 mt-4'>
                            <li>Which of the following interventions should the nurse include in the client’s plan of care?</li>
                        </ul>
                        <button className='bg-[#FFB7B3] text-[red] p-2 px-8 mt-5 rounded-3xl'>Wrong</button>
                        <div className='gap-y-5 mt-4'>

                            <div className='md:flex items-center justify-between mt-3  gap-x-3'>
                                <div className='flex items-center  gap-x-3'>
                                    <Close sx={{ color: 'red' }} className='w-4 h-4' />
                                    <input type="radio" checked className='accent-[#052654] w-5 h-5' />
                                    <p>obtain an order to insert an indwelling urinary catheter</p>
                                </div>
                                <div className='text-center mx-4 my-3 md:mt-0 md:mx-0 text-white p-2 px-6 bg-[#052654] rounded-3xl '>
                                    3%
                                </div>
                            </div>

                            <div className='md:flex items-center justify-between mt-3  gap-x-3'>
                                <div className='flex items-center  gap-x-3'>
                                    <Close sx={{ color: 'red' }} className='w-4 h-4' />
                                    <input type="radio" checked className='accent-[#052654] w-5 h-5' />
                                    <p>obtain an order to insert an indwelling urinary catheter</p>
                                </div>
                                <div className='text-center  mx-4 my-3 md:mt-0 md:mx-0 text-white p-2 px-6 bg-[#052654] rounded-3xl '>
                                    3%
                                </div>
                            </div>


                            <div className='md:flex items-center justify-between mt-3  gap-x-3'>
                                <div className='flex items-center  gap-x-3'>
                                    <Close sx={{ color: 'red' }} className='w-4 h-4' />
                                    <input type="radio" checked className='accent-[#052654] w-5 h-5' />
                                    <p>obtain an order to insert an indwelling urinary catheter</p>
                                </div>
                                <div className='text-center  mx-4 my-3 md:mt-0 md:mx-0 text-white p-2 px-6 bg-[#052654] rounded-3xl '>
                                    3%
                                </div>
                            </div>



                            <div className='flex items-center gap-x-3 mt-3'>
                                <Done sx={{ color: 'green' }} className='w-4 h-4' />
                                <input type="radio" checked className='accent-[#052654] w-5 h-5' />
                                <p>obtain a prescription for an antibiotic</p>
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
                                <div className='my-6 gap-x-4 flex flex-wrap'>

                                    <p>Subject <button className='p-2 mb-4 rounded-2xl bg-[#E9E7F0]'>Maternal & Newborn Health</button></p>
                                    <p>Lesson <button className='p-2  mb-4 rounded-2xl bg-[#E9E7F0]'>Maternal & Newborn Health</button></p>
                                    <p>Client Need Area <button className='p-2  mb-4 rounded-2xl bg-[#E9E7F0]'>Physiological Adaptation</button></p>
                                    <p>Client Need Topic <button className='p-2  mb-4 rounded-2xl bg-[#E9E7F0]'>Alterations in Body Systems</button></p>
                                    <p>Question Type<button className='p-2  mb-4 rounded-2xl bg-[#E9E7F0]'>Application</button></p>

                                </div>


                            </div>

                        </div>



                    </Grid>
                    <Grid item xs={12} md={4}>

                        <div className='md:p-4'>
                            <div className='rounded-lg shadow-lg p-5 md:p-10'>
                                <p className='font-bold text-lg'>Note</p>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                            </div>


                        </div>


                    </Grid>


                </Grid>

                <div
                    style={{
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    className='md:p-4 h-[80vh] overflow-y-scroll bg-white rounded-lg'>
                    <p className='font-bold'>Explanation</p>
                    {
                        [1,].map((el, index) => {
                            return <>
                                <div className='my-3'>
                                    <p>
                                        <span className='font-bold text-sm'>Choice B is correct . </span>
                                        <span className='text-sm'>. Normal albumin levels are 3.5-5.0 g/dL, 34–50 g/L. Collaboration with a registered dietitian (RD) is recommended for numerous reasons. First, the registered dietician can perform a nutritional assessment. Second, following the nutritional assessment, the registered dietician can focus on increasing the protein intake necessary for healing. Third, the registered dietician can make recommendations regarding appropriate foods that may be integrated into the client's diet based on the client's personal preferences. Fourth, the registered dietician can perform client education and educate the client regarding the nutritional needs of the client and food sources of protein. Therefore, collaborating with a registered dietician will significantly benefit this client experiencing hypoalbuminemia and should be included in the client's care plan.</span>
                                    </p>
                                </div>
                            </>

                        })
                    }
                    {
                        [1, 2, 3,].map((el, index) => {
                            return <>
                                <div className='my-3'>
                                    <p>
                                        <span className='font-bold text-sm'>Choice B is correct . </span>
                                        <span className='text-sm'>eizure precautions are not necessary for clients with hypoalbuminemia. This would be required if the client had severe hyponatremia ( 125 mEq/l, mmol/L).</span>
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
                        <p className='my-5 flex   '>
                            <Done className='text-white mr-2' />
                            <span className='text-white'>
                                Endometritis is inflammation of the uterine endometrium. Risk factors are recent vaginal or cesarean birth. The risk is increased if she had an extended labor and ruptured membranes.

                            </span>
                        </p>
                    </div>
                    <div
                        style={{
                            background: "linear-gradient(90deg, #052554 0%, #2358A1 83.5%)"
                        }}
                        className='xl:flex items-center rounded-3xl mt-7  gap-x-5 p-8'>

                        <p className='text-white my-3 lg:my-0 font-bold'>Select Your Confidence Level for This Question</p>

                        <div className='bg-[#FFEAEA]  my-3 xl:my-0  p-4 flex lg:flex  items-center rounded-3xl'>
                            <div>
                                <img src={lowConf} alt="" className='w-12 h-12' />

                            </div>

                            <p className='ml-3 font-bold'>Low Confidence</p>

                        </div>

                        <div className='bg-[#E4FFEF]  my-3 xl:my-0   p-4  flex lg:flex items-center rounded-3xl'>
                            <div>
                                <img src={highConf} alt="" className='w-12 h-12' />
                            </div>

                            <p className='ml-3 font-bold'>High Confidence</p>

                        </div>

                        <div className='bg-[#E4FFEF]  xl:justify-start my-3 xl:my-0  p-3 px-5 justify-center flex items-center rounded-3xl'>
                            <SkipPrevious className='text' />
                        </div>
                        <div
                            onClick={() => {
                                setShowReviewSummary(true)
                            }}
                            className='bg-[#E4FFEF] p-3 px-5 justify-center  flex items-center rounded-3xl'>
                            <SkipNext className='text' />
                        </div>

                    </div>

                </div>


                <ReviewQuestionSummary open={showReviewSummary} onClose={() => setShowReviewSummary(false)} />




            </Box>
        </Modal >
    );
}

export default PendingReviewsModal;      
