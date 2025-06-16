import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Divider } from '@mui/material';
import { Close, Edit, } from '@mui/icons-material';
import {
    TextField, InputLabel, Grid, InputAdornment,
    Select, MenuItem, FormControlLabel, Radio,
    Checkbox, IconButton
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ViewProductFeaturesModal from './ViewProductFeaturesModal';
import bulbIcon from '@/assets/nursing/bulb.png';
function CartModal({ open, onClose }) {
    const [checked, setChecked] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openProductFeaturesModal, setOpenProductFeaturesModal] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const [selectedOption, setSelectedOption] = useState('');

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
                    width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '60%', // Adjust width for different screen sizes
                    height: isSmallScreen ? '90vh' : '70vh',

                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: isSmallScreen ? 1 : isMediumScreen ? 4 : 3,
                    borderRadius: 2,
                }}
            >
                <div className="flex justify-end items-center  mb-5">

                    <Close className="text-black cursor-pointer" onClick={onClose} />
                </div>

                <Grid container spacing={1} >

                    <Grid item className=' ' display={'flex'} flexDirection={'column'} justifyContent={'space-between'} xs={12} lg={7}>
                        <div className='flex items-center justify-between  gap-x-4 '>
                            <div className='flex gap-x-4 items-center'>
                                <p className='text-xl text-capitalize font-bold'>CART</p>
                                <Button sx={{ bgcolor: "#D1F0FF", borderRadius: '40px', px: 2, }} className='text-white'>
                                    1 Item
                                </Button>
                            </div>
                            <div className='hidden md:block'>
                                <Close className="text-black  cursor-pointer" onClick={onClose} />
                            </div>
                        </div>
                        <div className='mt-5 items-center shadow-lg p-7 rounded-xl gap-x-5'>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },

                            }}>

                                <p className='text-sm md:text-lg font-bold'>
                                    Next-Gen NCLEX RN - Sure PASS Qbank + OnDemand + {'\n'}
                                    Rapid Review 3-Day Live
                                </p>
                                {/* <button onClick={() => setOpenProductFeaturesModal(true)} className='text-md text-[#0197FF]'>View Product Features</button> */}

                                <p className='text-blue-400 mx-auto cursor-pointer '>View Product Features</p>


                            </Box>

                            <div className='    md:flex mt-5  items-center gap-x-6'>
                                <p className='text-[gray] text-md'>$199.00</p>
                                <p className=' text-lg font-bold'>$159.00</p>
                                <div className='flex items-center space-x-2'>
                                    <p className='text-[gray] text-md'>Validity:</p>
                                    <p className=''>60 days</p>


                                </div>
                            </div>
                        </div>

                        <div className='mt-5 items-center shadow-lg p-7 rounded-xl gap-x-5'>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },

                            }}>

                                <p className='text-sm md:text-lg font-bold'>
                                    Next-Gen NCLEX RN - Sure PASS Qbank + OnDemand + {'\n'}
                                    Rapid Review 3-Day Live
                                </p>
                                <p className='text-blue-400 mx-auto cursor-pointer '>View Product Features</p>

                                {/* <button onClick={() => setOpenProductFeaturesModal(true)} className='text-md text-[#0197FF]'>View Product Features</button> */}

                                {/* <Select
                                    value={''}
                                    onChange={() => { }}
                                    placeholder='View Product Features'
                                    defaultValue=""

                                    sx={{
                                        mt: { xs: 4, md: 0 },
                                        width: isSmallScreen ? '60%' : '100%',
                                        height: '40px',
                                        mx: 2,
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#0197FF',
                                            },
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused': {
                                            '& fieldset': {
                                                borderColor: '#0197FF',
                                            },
                                        },
                                    }}
                                >

                                    <MenuItem value="">
                                        <em>View Product Features</em>
                                    </MenuItem>

                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select> */}



                            </Box>

                            <div className='    md:flex mt-5  items-center gap-x-6'>
                                <p className='text-[gray] text-md'>$199.00</p>
                                <p className=' text-lg font-bold'>$159.00</p>
                                <div className='flex items-center space-x-2'>
                                    <p className='text-[gray] text-md'>Validity:</p>
                                    <p className=''>60 days</p>


                                </div>
                            </div>
                        </div>


                        <div>
                            <p className='mt-8 mb-3  font-bold'>Product Activation</p>

                            <div className='flex gap-x-3 items-center'>
                                <img src={bulbIcon} alt="bulb" className='w-6 h-6' />
                                <p className=''>You can purchase your course on Archer Review and activate it at your convenience.</p>
                            </div>
                            <div className="flex md:m-3   py-6 md:py-2 gap-x-4">
                                {/* Activate Now Option */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="activation"
                                        value="activateNow"
                                        checked={selectedOption === 'activateNow'}
                                        onChange={() => setSelectedOption('activateNow')}
                                        className="accent-[#052654]"  // This applies the tailwind accent color
                                    />
                                    <span
                                        className={`text-sm font-bold ${selectedOption === 'activateNow' ? 'text-[#052654]' : 'text-gray-700'
                                            }`}
                                    >
                                        Activate Now
                                    </span>
                                </label>

                                {/* Active Later Option */}
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="activation"
                                        value="activateLater"
                                        checked={selectedOption === 'activateLater'}
                                        onChange={() => setSelectedOption('activateLater')}
                                        className="accent-[#052654]"  // This applies the tailwind accent color
                                    />
                                    <span
                                        className={`text-sm font-bold ${selectedOption === 'activateLater' ? 'text-[#052654]' : 'text-gray-700'
                                            }`}
                                    >
                                        Active Later
                                    </span>
                                </label>
                            </div>
                        </div>



                    </Grid>
                    <Grid item sm={12} lg={5}>
                        <div className=' md:p-5  rounded-lg'>
                            <div className='bg-[#D1F0FF] p-5 rounded-lg'>

                                <p className='text-lg font-bold'>Payment Method</p>
                                <div className='flex mt-3 items-center gap-x-3 '>
                                    <div className='flex gap-x-1 items-center'>
                                        <input type='checkbox' className='accent-[#031957] w-4 h-4' sx={{ color: '#031957' }} />

                                        <p className='font-bold'>
                                            Credit/Debit Card
                                        </p>
                                    </div>
                                    <div className='flex gap-x-1 items-center'>
                                        <input type='checkbox' className='accent-[#031957] w-4 h-4' sx={{ color: '#031957' }} />
                                        <p className='font-bold'>
                                            PayPal
                                        </p>
                                    </div>
                                </div>
                                <div className='flex mt-3 gap-x-3 mb-3 items-center '>
                                    <div className='flex gap-x-1 items-center'>
                                        <input type='checkbox' className='accent-[#031957] w-4 h-4' checked={true} sx={{ color: '#031957' }} onChange={handleCheckboxChange} />
                                        <p className='font-bold'>
                                            Use my wallet credit
                                        </p>
                                    </div>
                                    <div className='flex gap-x-3 items-center'>
                                        <Button sx={{
                                            bgcolor: "#031957", color: 'white',
                                            "&:hover": { bgcolor: "#031957" },
                                            borderRadius: '40px', px: 2,
                                        }}
                                            className='text-black'>$0</Button>
                                    </div>
                                </div>

                            </div>
                            <div className='mt-5 bg-[#D1F0FF] p-5 rounded-lg'>


                                <div className='flex mt-3 gap-x-3 items-center '>
                                    <div className='flex gap-x-1 items-center'>
                                        <TextField
                                            id="outlined-basic"
                                            placeholder='Enter Coupon Code'
                                            variant="outlined"
                                            size="small"
                                            type="number"
                                            sx={{
                                                width: '100%', borderRadius: '40px', bgcolor: 'white',
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        border: "none"
                                                    },
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='flex gap-x-3 items-center'>
                                        <Button sx={{
                                            bgcolor: "#031957", color: 'white',
                                            "&:hover": { bgcolor: "#031957" },

                                            borderRadius: isSmallScreen ? '30px' : '40px', px: 4,
                                        }}
                                            className='text-black '>Apply Now</Button>
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
                                            <p className='underline text-[gray]'> Clear All</p>
                                        </div>

                                    </div>



                                    {/* <div className='flex gap-x-3 items-center'>
                                        <Button sx={{ bgcolor: "#031957", color: 'white', borderRadius: '40px', px: 2, }}
                                            className='text-black'>Apply Now</Button>
                                    </div> */}
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

                                <Button

                                    fullWidth sx={{
                                        bgcolor: "#FF6C12", fontWeight: "bold",
                                        "&:hover": { bgcolor: "#FF6C12" },
                                        color: 'white', borderRadius: '40px', px: 2, mt: 4
                                    }}
                                >Proceed to Buy | $162.00</Button>

                                <hr />



                            </div>


                        </div>


                    </Grid>

                </Grid>

                {/* <ViewProductFeaturesModal open={openProductFeaturesModal} onClose={() => setOpenProductFeaturesModal(false)} /> */}
            </Box>
        </Modal >
    );
}

export default CartModal;
