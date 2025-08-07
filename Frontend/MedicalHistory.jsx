import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import DualNavbar from "../components/layout";

const MedicalHistory = ({ formData, setFormData }) => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { nic } = useParams();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            medicalHistory: { 
                ...formData.medicalHistory, 
                [e.target.name]: e.target.value 
            } 
        });
    };

    // Handle file selection
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Convert files to base64
        const base64Files = await Promise.all(
            files.map(file => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            }))
        );

        setFormData({
            ...formData,
            medicalHistory: {
                ...formData.medicalHistory,
                su_imaging: base64Files
            }
        });
    };

    // Handle form submission
    const handleNext = (e) => {
        e.preventDefault(); 
        navigate(`/h-patientdetails/treatment-plan/${nic}`);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <DualNavbar />

            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6"
            >
                <motion.form 
                    onSubmit={handleNext} 
                    initial={{ scale: 0.9, rotate: -2 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" }}
                    className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-500"
                >
                    <motion.h2 
                        className="text-center text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring" }}
                    >
                        Medical History
                    </motion.h2>

                    {['Allergies', 'Illnesses', 'Medications', 'Surgeries', 'Immunizations'].map((field) => (
                        <div className="mb-4" key={field}>
                            <label className="block font-semibold">{field}</label>
                            <motion.input 
                                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                                type="text" 
                                name={field.toLowerCase()} 
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                placeholder={field} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    ))}

                    <div className="mb-4">
                        <label className="block font-semibold">Surgeries Report</label>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                            type="file"
                            accept="image/*"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={handleFileChange}
                            multiple 
                        />
                        {selectedFiles.length > 0 && (
                            <ul className="mt-2 text-sm text-gray-700">
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>📄 {file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex justify-between mt-4">
                        <motion.button
                            whileHover={{ scale: 1.03, backgroundColor: "rgba(75, 85, 99, 0.9)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="px-4 py-2 rounded-lg bg-gray-500 text-white font-bold shadow-lg"
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03, background: "linear-gradient(45deg, #3b82f6, #6366f1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg"
                            type="submit"
                        >
                            Next
                        </motion.button>
                    </div>
                </motion.form>
            </motion.section>
        </div>
    );
};

export default MedicalHistory;
