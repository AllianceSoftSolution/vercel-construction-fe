import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import createTest1 from '@/assets/nursing/create-test-1.png';
import createTest2 from '@/assets/nursing/create-test-2.png';
import QuestionTestModal from './QuestionTestModal';
import PendingReviewsModal from './PendingReviews';
function ReviewModal({ open, onClose }) {
    const [openQuestionTestModal, setOpenQuestionTestModal] = useState(false);


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-2xl 
                     w-[90%] sm:w-4/5 md:w-3/5 lg:w-3/5 h-[90vh] md:h-[70vh] overflow-y-auto p-4 md:p-6">
                <p className='text-center my-4 font-bold text-lg'>Select Your Subject & Lesson</p>

                <Step2 />
                <QuestionTestModal open={openQuestionTestModal}
                    onClose={() => setOpenQuestionTestModal(false)} />

            </Box>

        </Modal>
    );
}
const Step2 = () => {
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [openPendingReviewsModal, setPendingReviewsModal] = useState(false);
    const categories = [
        {
            title: "Adult Health",
            lessons: [
                "Cardiovascular",
                "Endocrine",
                "Gastrointestinal",
                "Hematological / Oncological",
                "Immune",
                "Infectious Disease",
                "Integumentary",
                "Musculoskeletal",
                "Neurologic",
                "Reproductive",
                "Respiratory",
                "Urinary / Renal / Fluid and Electrolytes",
                "Visual / Auditory",
                "Environmental Emergencies",
            ],
        },
        {
            title: "Child Health",
            lessons: [
                "Cardiovascular",
                "Endocrine",
                "Gastrointestinal",
                "Hematological / Oncological",
                "Infectious Disease",
                "Respiratory",
                "Urinary / Renal / Fluid and Electrolytes",
                "Growth & Development",
            ],
        },
        {
            title: "Fundamentals",
            lessons: [
                "Basic Care & Comfort",
                "Safety / Infection Control",
                "Skills / Procedures",
                "Hematological / Oncological",
                "Cultural, Spiritual, and Religion Concepts",
                "Perioperative Care",
            ],
        },
        {
            title: "Maternal & Newborn Health",
            lessons: ["Antepartum", "Labor / Delivery", "Newborn", "Postpartum"],
        },
        {
            title: "Mental Health",
            lessons: [
                "Mental Health",
                "Substance Abuse and other dependencies",
                "Abuse / Neglect",
            ],
        },
        {
            title: "Pharmacology",
            lessons: [
                "Cardiovascular",
                "Endocrine",
                "Gastrointestinal",
                "Hematological / Oncological",
                "Immune",
            ],
        },
        {
            title: "Critical Care",
            lessons: ["Critical Care Concepts"],
        },
        {
            title: "Nutrition",
            lessons: ["Nutrition"],
        },
        {
            title: "Leadership & Management",
            lessons: [
                "Assignment / Delegation",
                "Ethical / Legal",
                "Management Concepts",
                "Prioritization",
            ],
        },
    ];

    const handleSelectAll = () => {
        setSelectedSubjects(categories.flatMap((cat) => cat.lessons));
    };

    const handleUnselectAll = () => {
        setSelectedSubjects([]);
    };

    const handleToggle = (lesson) => {
        setSelectedSubjects((prev) =>
            prev.includes(lesson)
                ? prev.filter((item) => item !== lesson)
                : [...prev, lesson]
        );
    };
    return <>

        <div className="p-6 bg-white   shadow-xl min-h-screen">
            {/* Search bar */}
            <div className="mb-6 md:flex items-center md:gap-x-8 justify-between">
                <input
                    type="text"
                    placeholder="Search here"
                    className="w-[220px] md:w-[400px] p-3 border border-black rounded-3xl  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className='flex mt-6 md:mt-0 gap-x-3 items-baseline font-bold md:gap-x-4'>
                    <input type="checkbox" className='accent-[#052654] h-4 w-4' />
                    <span>Unselect all</span>
                </div>

            </div>

            {/* Subject Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <div key={index} className={`${index === 0 ? "bg-[#D1F0FF] " : "bg-white "}` + " shadow rounded-lg p-4"}>
                        <h3 className="font-semibold text-center text-lg mb-4">{category.title}</h3>
                        <ul>
                            {category.lessons.map((lesson) => (
                                <li key={lesson} className="mb-2  flex items-center">
                                    <div className='flex  w-full justify-between items-center'>
                                        <div>
                                            <input
                                                type="checkbox"

                                                onChange={() => handleToggle(lesson)}
                                                checked={true}

                                                className="mr-2 accent-[#052654]   h-5 w-5"
                                            />
                                            <span>{lesson}</span>

                                        </div>

                                        {
                                            index === 0 ? <>
                                                <span className='bg-[#052654] p-1 text-[12px] px-4 text-white rounded-full'>43</span>

                                            </> : <></>

                                        }

                                    </div>

                                </li>
                            ))}
                        </ul>
                    </div>
                ))}


            </div>
            <div className=' pt-4 flex justify-end'>
                <button
                    onClick={() => setPendingReviewsModal(true)}
                    className="px-8 py-2 bg-[#FF6C12] text-white rounded-3xl shadow transition-transform duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    Review
                </button>
            </div>
            {/* Buttons */}
            {/* <div className="flex justify-between items-center mt-8">
                <button
                    onClick={handleUnselectAll}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                >
                    Unselect All
                </button>
                <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                >
                    Select All
                </button>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                >
                    Create Test
                </button>
            </div> */}
            <PendingReviewsModal open={openPendingReviewsModal} onClose={() => {
                setPendingReviewsModal(false)
            }} />
        </div>
    </>
}

export default ReviewModal;
