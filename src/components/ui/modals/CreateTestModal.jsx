import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import createTest1 from '@/assets/nursing/create-test-1.png';
import createTest2 from '@/assets/nursing/create-test-2.png';
import QuestionTestModal from './QuestionTestModal';
import { set } from 'lodash';
function ToggleSwitch() {
    const [checked, setChecked] = useState(false);

    return (
        <label className="inline-flex items-center cursor-pointer">
            {/* Hidden checkbox */}
            <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
            />
            {/* Toggle container */}
            <div
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${checked ? 'bg-[#052654]' : 'bg-gray-300'
                    }`}
            >
                {/* Toggle knob */}
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${checked ? 'translate-x-5' : ''
                        }`}
                ></div>
            </div>
        </label>
    );
}
// Main CreateTestModal component
function CreateTestModal({ open, onClose }) {
    const [openQuestionTestModal, setOpenQuestionTestModal] = useState(false);
    const [openStep2Modal, setOpenStep2Modal] = useState(false);

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"

            >
                <Box
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-2xl 
                     w-[90%] sm:w-4/5 md:w-3/5 lg:w-3/5 h-[90vh] md:h-[70vh] overflow-y-auto p-4 md:p-6"
                >
                    <div>
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <p className="text-2xl font-bold">Create Test</p>
                            <Close onClick={onClose} className="cursor-pointer" />
                        </div>

                        {/* Test Options */}
                        <div className="mt-3 border shadow-xl p-5 rounded-xl">


                            <div className="flex flex-wrap gap-4 md:gap-x-16">
                                {/* CAT Option */}
                                <div className="flex items-center gap-x-3 w-full md:w-auto">
                                    <img src={createTest1} alt="CAT" className="w-8 h-8" />
                                    <p className="font-bold">CAT (Adaptive Test)</p>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <ToggleSwitch />


                                    </label>
                                </div>

                                {/* Tutorials Option */}
                                <div className="flex items-center gap-x-3 w-full md:w-auto">
                                    <img src={createTest1} alt="Tutorials" className="w-8 h-8" />
                                    <p className="font-bold">Tutorials</p>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <ToggleSwitch />

                                    </label>
                                </div>

                                {/* Timed Option */}
                                <div className="flex items-center gap-x-3 w-full md:w-auto">
                                    <img src={createTest2} alt="Timed" className="w-8 h-8" />
                                    <p className="font-bold">Timed</p>
                                    <ToggleSwitch />

                                </div>
                            </div>





                            <div className="mt-6 flex items-center gap-x-4">
                                <input type="checkbox" className="w-6 h-6 rounded-lg" />
                                <p className="font-bold text-lg text-[#EF7D3D]">Readiness Assessment</p>
                            </div>
                        </div>

                        {/* Tutorials Section */}
                        <div className="mt-4 border shadow-xl flex flex-col p-5 rounded-xl">
                            <button className="bg-[#052654] text-white py-2 rounded-3xl hover:scale-105 transition-transform w-full md:w-[140px]">
                                Tutorials
                            </button>
                            <p className="mt-3 font-semibold text-sm md:text-base">
                                Receive instant explanation after submitting your answer
                            </p>
                        </div>

                        {/* Test Type Section */}
                        <div className="mt-4 border shadow-xl flex flex-col p-5 rounded-xl">
                            <p className="font-bold">Test Type</p>
                            <div className="flex flex-wrap gap-x-4">
                                {['Easy', 'Moderate', 'Hard'].map((type, index) => (
                                    <div key={index} className="flex items-center mt-3 gap-x-2">
                                        <input
                                            type="radio"
                                            name="testType"
                                            className="w-5 h-5 accent-[#052654]"
                                            defaultChecked={index === 0}
                                        />
                                        <span className="font-bold">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Organization Section */}
                        <div className="mt-4 border shadow-xl flex flex-col p-5 rounded-xl">
                            <p className="font-bold">Organization</p>
                            <div className="flex flex-col md:flex-row gap-x-4">
                                {['Subject or System', 'Client Need Areas'].map((option, index) => (
                                    <div key={index} className="flex items-center mt-3 gap-x-2">
                                        <input
                                            type="radio"
                                            name="organization"
                                            className="w-5 h-5 accent-[#052654]"
                                            defaultChecked={index === 0}
                                        />
                                        <span className="font-bold">{option}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Question Types Section */}
                        <div className="mt-4 border shadow-xl flex flex-col p-5 rounded-xl">
                            <p className="font-bold">Question Types</p>
                            <div className="flex flex-wrap gap-4">
                                {['Unused', 'Marked', 'Incorrect', 'All'].map((type, index) => (
                                    <div key={index} className="flex items-center mt-3 gap-x-2 w-full md:w-auto">
                                        <input
                                            type="radio"
                                            name="questionType"
                                            className="w-5 h-5 accent-[#052654]"
                                            defaultChecked={type === 'All'}
                                        />
                                        <span className="font-bold">{type}</span>
                                        <div className="p-2 bg-[#F3F1F1] rounded-lg text-sm">
                                            <span className="font-bold">872 Classic + 592 NGN</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Test Length */}
                            <div className="mt-3 flex items-center gap-x-4 flex-wrap">
                                <p className="font-bold">Test Length</p>
                                <p className="text-gray-500 text-sm">Min 50 - Max 150 questions</p>
                            </div>
                            <input
                                type="number"
                                placeholder="100"
                                className="mt-3 bg-[#F1FAFF] w-full md:w-[300px] p-2 rounded-lg"
                                min="50"
                                max="150"
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="mt-4 flex justify-end gap-4 flex-wrap">
                            <button
                                className="p-3 px-8 bg-[#052654] text-white rounded-3xl hover:scale-105 transition-transform"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setOpenStep2Modal(true)}
                                className="p-3 px-8 bg-[#FF6C12] text-white rounded-3xl hover:scale-105 transition-transform"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {/* You can keep the QuestionTestModal if needed */}
                    <QuestionTestModal
                        open={openQuestionTestModal}
                        onClose={() => setOpenQuestionTestModal(false)}
                    />
                </Box>
            </Modal>

            {/* Step2 as a Separate Modal */}
            <Step2Modal open={openStep2Modal} onClose={() => setOpenStep2Modal(false)} openQuestionTestModal={() => { setOpenQuestionTestModal(true) }} />
        </>
    );
}

// Step2Modal: a separate modal for Step2 (subject selection)
function Step2Modal({ open, onClose, openQuestionTestModal }) {
    const [selectedSubjects, setSelectedSubjects] = useState([]);
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

    // Toggle selection for a given lesson
    const handleToggle = (lesson) => {
        setSelectedSubjects((prev) =>
            prev.includes(lesson)
                ? prev.filter((item) => item !== lesson)
                : [...prev, lesson]
        );
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="step2-modal-title" aria-describedby="step2-modal-description">
            <Box
                className="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl rounded-2xl 
                   w-[90%] sm:w-4/5 md:w-3/5 lg:w-3/5 h-[90vh] md:h-[70vh] overflow-y-auto p-4 md:p-6"
            >
                <div className="p-6 bg-gray-100">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search here"
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Subject Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className={`${index === 0 ? "bg-[#D1F0FF]" : "bg-white"} shadow rounded-lg p-4`}
                            >
                                <h3 className="font-semibold text-center text-lg mb-4">{category.title}</h3>
                                <ul>
                                    {category.lessons.map((lesson) => (
                                        <li key={lesson} className="mb-2 flex items-center">
                                            <div className="flex w-full justify-between items-center">
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => handleToggle(lesson)}
                                                        checked={selectedSubjects.includes(lesson)}
                                                        className="mr-2 accent-[#052654] h-5 w-5"
                                                    />
                                                    <span>{lesson}</span>
                                                </div>
                                                {index === 0 && (
                                                    <span className="bg-[#052654] p-1 text-[12px] px-4 text-white rounded-full">
                                                        43
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end gap-4 flex-wrap">
                        <button
                            className="p-3 px-8 bg-[#052654] text-white rounded-3xl hover:scale-105 transition-transform"
                            onClick={onClose}
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => { openQuestionTestModal(); onClose() }}
                            className="p-3 px-8 bg-[#FF6C12] text-white rounded-3xl hover:scale-105 transition-transform"
                        >
                            Create Test
                        </button>
                    </div>
                    {/* (Optional footer buttons can be added here) */}
                </div>
            </Box>
        </Modal>
    );
}

export default CreateTestModal;
// openQuestionTestModal