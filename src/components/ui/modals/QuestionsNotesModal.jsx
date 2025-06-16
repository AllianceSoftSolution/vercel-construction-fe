import React from 'react';
import { Modal, Box, useMediaQuery } from '@mui/material';

function QuestionsLineupModal({ open, onClose }) {
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');

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
                    p: 0,
                    borderRadius: 2,
                }}
            >
                {/* Header */}
                <div className="bg-[#062653] p-4 rounded-t-lg text-center">
                    <p className="font-bold text-white text-2xl">Notes</p>
                </div>

                {/* Content */}
                <div className="p-5 md:p-10 text-gray-700 text-justify">
                    <p className="leading-relaxed text-sm md:text-base">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        It has survived not only five centuries, but also the leap into electronic typesetting,
                        remaining essentially unchanged.
                    </p>
                    <p className="mt-4 leading-relaxed text-sm md:text-base">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-center md:justify-end p-4">
                    <button
                        onClick={onClose}
                        className="bg-orange-500 text-white px-6 py-2 rounded-3xl shadow transition-all duration-200 hover:bg-orange-600"
                    >
                        Save
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

export default QuestionsLineupModal;
