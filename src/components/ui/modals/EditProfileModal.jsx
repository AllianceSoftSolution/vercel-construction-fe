import React, { useReducer, useState } from 'react';
import {
    Modal,
    Box,
    InputLabel,
    Grid,
    TextField,
    useMediaQuery,
    CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import apiClient from '../../../api/apiClient';
import { setUser } from '../../../redux/authSlice';
import { useDispatch } from 'react-redux';


const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11); // Only digits, max 11 chars
    const countryCode = '+1';
    const area = cleaned.slice(1, 4);
    const middle = cleaned.slice(4, 7);
    const last = cleaned.slice(7, 11);

    if (cleaned.length <= 1) return countryCode;
    if (cleaned.length <= 4) return `${countryCode} (${area}`;
    if (cleaned.length <= 7) return `${countryCode} (${area}) ${middle}`;
    return `${countryCode} (${area}) ${middle}-${last}`;
};


function CustomModal({ open, onClose, user }) {
    const dispatch = useDispatch();
    const [loading, setloading] = useState(false)
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');

    const formik = useFormik({
        initialValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone: user?.phone || '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
            phone: Yup.string().min(11, "Phone number must be 11 Digits,")
                .required('Phone number is required'),

        }),
        onSubmit: async (values) => {
            setloading(true)
            try {
                console.log('Submitted Values:', values);
                const response = await apiClient.patch("user", { ...values })
                console.log(response.data)
                dispatch(setUser(response.data))
                // ✅ Add API request here (e.g., PUT /user)
                onClose();
            } catch (error) {
                console.error("Submission failed", error);
            } finally {
                setloading(false)
            }
        },
    });

    const inputStyle = {
        bgcolor: 'white',
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white',
            },
        },
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '60%',
                    maxHeight: isSmallScreen ? '90vh' : '70vh',
                    overflowY: 'scroll',
                    bgcolor: '#0F5484',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <div className="flex justify-between items-center mb-5">
                    <span className="text-white font-semibold text-3xl">Edit Profile</span>
                    <Close className="text-white cursor-pointer" onClick={onClose} />
                </div>

                <div className="md:mx-[4.5rem]">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <div className="mb-5">
                                <InputLabel sx={{ color: 'white' }}>First Name</InputLabel>
                                <TextField
                                    fullWidth
                                    name="first_name"
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                    helperText={formik.touched.first_name && formik.errors.first_name}
                                    variant="outlined"
                                    sx={inputStyle}
                                />
                            </div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <div className="mb-5">
                                <InputLabel sx={{ color: 'white' }}>Last Name</InputLabel>
                                <TextField
                                    fullWidth
                                    name="last_name"
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                    helperText={formik.touched.last_name && formik.errors.last_name}
                                    variant="outlined"
                                    sx={inputStyle}
                                />
                            </div>
                        </Grid>

                        <Grid item xs={12}>
                            <div className="mb-5">
                                <InputLabel sx={{ color: 'white' }}>Phone No</InputLabel>
                                <TextField
                                    fullWidth
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={(e) => {
                                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 11);
                                        formik.setFieldValue("phone", formatPhoneNumber(digitsOnly));
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    variant="outlined"
                                    sx={inputStyle}
                                />

                            </div>
                        </Grid>
                    </Grid>
                </div>

                <div className="flex items-center md:mx-[4.5rem] justify-end gap-3 sm:gap-5 mt-6 sm:mt-10 flex-wrap">
                    <button
                        type="button"
                        onClick={onClose}
                        className="group flex items-center cursor-pointer gap-2 px-6 py-2 sm:px-10 sm:py-3 bg-[#031957] rounded-xl sm:rounded-full transition duration-300 ease-in-out hover:bg-[#FF6C12]"
                    >
                        <span className="text-white text-sm sm:text-base transition-colors duration-300 group-hover:text-[#031957]">
                            Cancel
                        </span>
                    </button>

                    <button
                        disabled={loading}
                        type="submit"
                        className="group flex items-center cursor-pointer gap-2 px-6 py-2 sm:px-10 sm:py-3 bg-[#FF6C12] rounded-xl sm:rounded-full transition duration-300 ease-in-out hover:bg-[#031957]"
                    >
                        {loading && (
                            <CircularProgress size={20} />
                        )}
                        <span className="text-white text-sm sm:text-base transition-colors duration-300">
                            Save
                        </span>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

export default CustomModal;