import React, { useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';

function QuestionsFeedbackModal({ open, onClose }) {
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');

    // State to store selected tags
    const [selectedTags, setSelectedTags] = useState([]);

    const feedbackTags = [
        "Technical Issue",
        "Confusing Wording",
        "Wrong Answer",
        "Insufficient Explanation",
        "Too Difficult",
    ];

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
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
                    p: 3,
                    borderRadius: 3,
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="font-bold text-xl md:text-2xl">Questions Feedback</h2>
                    <IconButton
                        onClick={onClose}
                        aria-label="Close"
                        className="hover:bg-gray-200 transition-colors"
                    >
                        <Close />
                    </IconButton>
                </div>

                {/* Content */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Share feedback on each question. Use tags and leave comments.
                        Your input matters!
                    </p>

                    {/* Feedback Tags */}
                    <div className="flex flex-wrap mt-6 gap-3 justify-center">
                        {feedbackTags.map((tag, index) => (
                            <button
                                key={index}
                                onClick={() => toggleTag(tag)}
                                className={`py-2 px-6 rounded-3xl transition-all duration-200 ${selectedTags.includes(tag)
                                    ? "bg-orange-500 text-white hover:bg-orange-600"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment Box */}
                <div className="mt-6">
                    <label className="block font-bold mb-2">Comments</label>
                    <textarea
                        className="w-full h-32 border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="Write your comments here..."
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}  // Replace with your submit handler as needed.
                        className="bg-orange-500 text-white py-3 px-8 rounded-3xl shadow-md transition-all duration-200 hover:bg-orange-600"
                    >
                        Submit Feedback
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

export default QuestionsFeedbackModal;
