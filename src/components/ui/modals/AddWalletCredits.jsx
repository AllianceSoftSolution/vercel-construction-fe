import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import {
    TextField, InputLabel, Grid, InputAdornment,
    Select, MenuItem, FormControlLabel, Radio,
    Checkbox, IconButton, useMediaQuery
} from '@mui/material';
import bulbIcon from '@/assets/nursing/bulb.png';
import warningIcon from '@/assets/nursing/warning.png';
import addWalletCredits from '@/assets/nursing/wallet-credits.png';
import PhoneVerificationModal from './PhoneVerificationModal';
import navLogo from '@/assets/nursing/nav-logo.png'
import { Phone } from '@mui/icons-material';


function AddWalletCredits({ open, onClose }) {
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const [PhoneVerificationModal, setPhoneVerificationMod] = useState(false);

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
                    p: isSmallScreen ? 1 : isMediumScreen ? 4 : PhoneVerificationModal ? 0 : 3,
                    borderRadius: 2,
                }}>


                {
                    !PhoneVerificationModal && <>
                        <div className=' md:p-10'>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <div className='bg-[#D1F0FF] p-4 flex justify-center items-center  rounded-lg'>

                                        <div>
                                            <div className='flex justify-center items-center'>
                                                <img src={addWalletCredits} alt="" />
                                            </div>
                                            <p className='text-2xl mt-7 text-center font-bold'>Wallet Credits</p>
                                            <p className='text-sm mt-2 text-center'>Your credits for seamless purchases within Archer Review.</p>
                                            <div className='mt-5 flex 
                                    w-25 h-14 p-2 border bg-white border-gray-300 rounded-md
                                    justify-center'>
                                                <div className='flex items-center mx-2'>
                                                    <p className='text-3xl'>$</p>
                                                </div>
                                                <input type="search"
                                                    placeholder='Enter Wallet Amount'
                                                    className='w-full h-full outline-none border-none '
                                                />
                                            </div>
                                        </div>



                                    </div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div className='bg-[#D1F0FF] p-4  flex gap-x-4 rounded-lg'>
                                        <div>
                                            <p className='text-2xl mt-2  font-bold'>Payment Method</p>
                                            <div className='md:flex items-center gap-x-3 mt-4'>
                                                <input type='radio' className='mr-2 w-5 h-5 accent-[#1C588C] ' checked={true} /> <span className='text-lg'>Credit or Debit Card</span>
                                                <input type='radio' className='mr-2 w-5 h-5 accent-[#1C588C] ' checked={false} /> <span className='text-lg'>PayPal</span>
                                            </div>

                                        </div>




                                    </div>
                                    <div className='mt-5 bg-[#D1F0FF] p-5 rounded-lg'>


                                        <div className='flex mt-3 gap-x-3 items-center '>

                                            <div className='flex gap-x-1 w-full items-center justify-between'>
                                                <div>
                                                    <p className='font-bold'> Total Amount</p>

                                                </div>
                                                <div>
                                                    {/* <p className='underline text-[gray]'> Clear All</p> */}
                                                </div>

                                            </div>

                                        </div>

                                        <div className='px-10 mt-5'>
                                            <div className='flex gap-x-1 text-[gray]  items-center justify-between'>
                                                <div>
                                                    <p className='font-bold'>Sub total</p>

                                                </div>
                                                <div>
                                                    <p className=' text-[gray]'> $162.00</p>
                                                </div>

                                            </div>
                                            <Divider sx={{ mt: 2, mb: 2 }} />
                                            <div className='flex gap-x-1   items-center justify-between'>
                                                <div>
                                                    <p className='font-bold'>Total</p>

                                                </div>
                                                <div>
                                                    <p className='font-bold'> $162.00</p>
                                                </div>

                                            </div>
                                        </div>

                                        <Button fullWidth sx={{
                                            bgcolor: "#FF6C12",
                                            "&:hover": { bgcolor: "#FF6C12" },
                                            fontWeight: "bold", color: 'white', borderRadius: '40px', px: 2, mt: 4
                                        }}
                                        >Pay with Credit or Debit Card</Button>

                                        <hr />

                                        <div className='mt-5 md:flex gap-x-3 items-center '>

                                            <Button
                                                onClick={() => setPhoneVerificationMod(true)}
                                                fullWidth sx={{
                                                    bgcolor: "#FF6C12", fontWeight: "bold",
                                                    "&:hover": { bgcolor: "#FF6C12" },

                                                    color: 'white', borderRadius: '40px', px: 2, mt: 4
                                                }}
                                            >Pay with Paypal</Button>


                                            <Button fullWidth sx={{
                                                bgcolor: "#FF6C12", fontWeight: "bold",
                                                "&:hover": { bgcolor: "#FF6C12" },

                                                color: 'white', borderRadius: '40px', px: 2, mt: 4
                                            }}
                                            >Pay later</Button>

                                        </div>

                                    </div>
                                </Grid>
                            </Grid>

                        </div>

                    </>
                }


                {
                    PhoneVerificationModal && <VerificationModal />
                }

            </Box>
        </Modal >
    );
}

const VerificationModal = () => {
    const [isOtpFieldsVisible, setIsOtpFieldsVisible] = useState(false);
    return (
        <div className="flex flex-col md:flex-row h-auto md:h-[80vh]">
            {/* Left Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center bg-white py-10">
                <img src={navLogo} alt="Logo" className="w-20 mb-4" />
                <h1 className="text-lg font-bold text-black text-center">
                    Nurse Insight wallet credit - 30
                </h1>
                <p className="text-2xl font-bold text-black mt-2 text-center">$30.00</p>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 flex justify-center items-center bg-[#181059] py-10">
                {
                    !isOtpFieldsVisible &&
                    <div className="bg-[#181059] border border-gray-700 rounded-xl p-6 md:p-8 w-11/12 md:w-96">
                        <h1 className="text-xl font-bold text-white mb-4 text-center md:text-left">
                            Verify your phone number
                        </h1>
                        <p className="text-white mb-6 text-center md:text-left">
                            Before we can send a code to your email, we need to verify additional information about you. Please enter your phone number ending in <strong>-32</strong>.
                        </p>

                        {/* Input Field */}
                        <div className="relative mb-4">
                            <div className="absolute left-2 top-2 flex items-center space-x-2">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/32px-Flag_of_the_United_States.svg.png"
                                    alt="US Flag"
                                    className="w-5 h-5"
                                />
                                <span className="text-gray-600">+1</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your Phone Number"
                                className="w-full border border-gray-300 rounded-lg pl-16 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        {/* Buttons */}
                        <button
                            onClick={() => setIsOtpFieldsVisible(true)}
                            className="w-full bg-orange-500 text-white font-bold py-2 rounded-3xl mb-4 hover:bg-orange-600 transition-all">
                            Verify
                        </button>
                        <button className="w-full border border-white text-white font-bold py-2 rounded-3xl hover:bg-blue-100 hover:text-[#181059] transition-all">
                            Back
                        </button>
                    </div>
                }
                {

                    isOtpFieldsVisible &&
                    <OtpVerification />
                }


            </div>
        </div>
    );
};

const OtpVerification = () => {
    return (
        <div className="bg-[#181059] border rounded-xl p-6 md:p-8 w-full max-w-md mx-auto">
            {/* Title */}
            <p className="text-white mb-4 text-2xl md:text-3xl text-center md:text-left font-semibold">
                Confirm it's you
            </p>
            {/* Description */}
            <p className="text-white mb-6 text-center md:text-left">
                Enter the code sent to (•••) ••• ••32 to use your saved information.
            </p>
            {/* OTP Input Fields */}
            <div className="flex gap-x-2 justify-center md:justify-start">
                <input
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

            </div>

            <p className='text-white mt-4 text-center md:text-left cursor-pointer underline'>Send Code To Email</p>
        </div>
    );
};

export default AddWalletCredits;
