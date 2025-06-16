import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import {
    TextField,
    InputLabel,
    Grid,
    InputAdornment,
    Select,
    MenuItem,
    FormControlLabel,
    Radio,
    Checkbox,
    IconButton,
    useMediaQuery,
} from '@mui/material';
import { Close } from '@mui/icons-material';
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
import QuestionsLineupModal from './QuestionsLineUpModal';
import QuestionsNotesModal from './QuestionsNotesModal';
import EndQuestionModal from './EndQuestionModal';
import QuestionsFeedbackModal from './QuestionsFeedbackModal';
import RevealAnswerModal from './RevealAnswerModal';

function QuestionTestModal({ open, onClose }) {
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 768px)');
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');

    const [openQuestionLineupModal, setOpenQuestionLineupModal] = useState(false);
    const [openQuestionsNotesModal, setOpenQuestionsNotesModal] = useState(false);
    const [openEndQuestionModal, setOpenEndQuestionModal] = useState(false);
    const [openQuestionsFeedbackModal, setOpenQuestionsFeedbackModal] = useState(false);
    const [openRevealAnswerModal, setOpenRevealAnswerModal] = useState(false);

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
                    width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '60%',
                    height: isSmallScreen ? '90vh' : '70vh',
                    overflowY: 'auto',
                    bgcolor: 'white',
                    boxShadow: 24,
                    p: isSmallScreen ? 1 : isMediumScreen ? 4 : 0, // Increased padding for larger screens
                    borderRadius: 2,
                }}
            >
                <div>
                    {/* Container */}
                    <div className="rounded-lg shadow-lg">
                        {/* Header */}
                        <div className="bg-[#021836] text-white p-4 rounded-t-lg md:flex justify-between items-center">
                            <div className="flex gap-x-3 items-center">
                                <img src={navLogo} alt="Navigation Logo" className="w-10 h-10" />
                                <div>
                                    <h1 className="text-lg font-bold">AANU AYANDIPE</h1>
                                    <p className="text-sm">Tutorial Number here</p>
                                </div>
                            </div>
                            <div className="text-center mt-4 md:mt-0">
                                <p className="text-white font-bold">Tutorial Number here</p>
                                <p className="text-white text-sm text-center">QUID: quid no. here</p>
                            </div>
                            <div className="text-center mt-4 md:mt-0">
                                <p className="text-sm">Time Elapsed</p>
                                <p className="text-sm font-bold">14:56:05</p>
                            </div>
                        </div>

                        {/* Secondary Navigation */}
                        <div className="w-full p-3 bg-[#0F5484]">
                            <div className="flex justify-between">
                                <div className="flex gap-x-3">
                                    <img
                                        onClick={() => setOpenQuestionLineupModal(true)}
                                        className="cursor-pointer transition-transform duration-200 hover:scale-105"
                                        src={threelines1}
                                        alt="Question Lineup"
                                    />
                                    <img
                                        className="cursor-pointer transition-transform duration-200 hover:scale-105"
                                        src={fav}
                                        alt="Favorite"
                                    />
                                </div>
                                <div className="flex gap-x-3">
                                    <img
                                        onClick={() => setOpenQuestionsNotesModal(true)}
                                        className="cursor-pointer transition-transform duration-200 hover:scale-105"
                                        src={threelines2}
                                        alt="Notes"
                                    />
                                    <img
                                        onClick={() => setOpenQuestionsFeedbackModal(true)}
                                        className="cursor-pointer transition-transform duration-200 hover:scale-105"
                                        src={chat}
                                        alt="Feedback"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Question Section */}
                        <div className="p-5  md:p-10">
                            <p className="mb-4 font-bold md:text-3xl">Question</p>




                            <div>

                                <h2 className="text-lg font-semibold mb-4">
                                    The nurse is caring for a client who is 3 days postpartum and has endometritis.
                                </h2>

                                <p className="mb-6">
                                    Which of the following actions would be appropriate for the nurse to take? Select all that apply.
                                </p>

                                <div className="space-y-4 ">
                                    {[
                                        {
                                            id: 'option1',
                                            text: 'Obtain an order to insert an indwelling urinary catheter',
                                        },
                                        {
                                            id: 'option2',
                                            text: 'Obtain a prescription for an antibiotic',
                                        },
                                        {
                                            id: 'option3',
                                            text: 'Prepare the client for a 24-hour urine collection',
                                        },
                                        {
                                            id: 'option4',
                                            text: 'Insert a peripheral venous access device (VAD)',
                                        },
                                        {
                                            id: 'option5',
                                            text: 'Request a prescription for a corticosteroid',
                                        },
                                    ].map((option) => (
                                        <div
                                            key={option.id}
                                            className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                id={option.id}
                                                name="action"
                                                className="w-4 h-4 text-blue-600  accent-[#0F5484] border-gray-300"
                                            />
                                            <label htmlFor={option.id} className="ml-2 text-gray-700">
                                                {option.text}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>







                        </div>

                        {/* Footer - Reveal Answer Section */}
                        <div className="md:flex items-center p-4 bg-gray-100 border-t">
                            <button
                                onClick={() => setOpenRevealAnswerModal(true)}
                                className="bg-orange-500 text-white px-4 py-2 rounded-3xl shadow transition-colors duration-200 hover:bg-orange-600"
                            >
                                Reveal Answer
                            </button>
                            <p className="ml-4 text-gray-500">Remaining Question 60 / 2</p>
                        </div>

                        {/* Bottom Navigation */}
                        <div className="w-full p-3 bg-[#021836]">
                            <div className="md:flex justify-between">
                                <div className="flex gap-x-3">
                                    <div
                                        onClick={() => setOpenEndQuestionModal(true)}
                                        className="flex cursor-pointer gap-x-3 p-2 transition-transform duration-200 hover:scale-105"
                                    >
                                        <img src={end} alt="End" className="w-6 h-6" />
                                        <p className="text-white font-bold">End</p>
                                    </div>
                                    <div className="flex cursor-pointer gap-x-3 p-2 transition-transform duration-200 hover:scale-105">
                                        <img src={pause} alt="Pause" className="w-6 h-6" />
                                        <p className="text-white font-bold">Pause</p>
                                    </div>
                                </div>
                                <div className="flex gap-x-3">
                                    <div className="flex cursor-pointer gap-x-3 p-2 transition-transform duration-200 hover:scale-105">
                                        <img src={arrowPrev} alt="Previous" className="w-6 h-6" />
                                        <p className="text-white font-bold">Previous</p>
                                    </div>
                                    <div className="flex cursor-pointer gap-x-3 p-2 transition-transform duration-200 hover:scale-105">
                                        <img src={arrowNext} alt="Next" className="w-6 h-6" />
                                        <p className="text-white font-bold">Next</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Modals */}
                <QuestionsNotesModal
                    open={openQuestionsNotesModal}
                    onClose={() => setOpenQuestionsNotesModal(false)}
                />
                <QuestionsLineupModal
                    open={openQuestionLineupModal}
                    onClose={() => setOpenQuestionLineupModal(false)}
                />
                <EndQuestionModal
                    open={openEndQuestionModal}
                    onClose={() => setOpenEndQuestionModal(false)}
                />
                <QuestionsFeedbackModal
                    open={openQuestionsFeedbackModal}
                    onClose={() => setOpenQuestionsFeedbackModal(false)}
                />
                <RevealAnswerModal
                    open={openRevealAnswerModal}
                    onClose={() => setOpenRevealAnswerModal(false)}
                />
            </Box>
        </Modal>
    );
}

export default QuestionTestModal;
