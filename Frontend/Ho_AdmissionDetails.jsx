import React ,{useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import DualNavbar from "../components/layout";

const Ho_AdmissionDetails = ({ formData, setFormData }) => {
    const navigate = useNavigate();
    const { nic } = useParams(); // Get NIC from the URL
    console.log("NIC from URL:", nic); // Debugging purpose
    const [error, setError] = useState(""); // State to store error messages

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "admissionDate") {
            const selectedDate = new Date(value);
            const today = new Date();
             // Remove time part for accurate comparison

            if (selectedDate > today) {
                setError("Admission date cannot be in the future.");
                return;
            } else {
                setError(""); // Clear error if date is valid
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            ho_admissionDetails: {
                ...prevData.ho_admissionDetails,
                [name]: name === "admittingPhysician" || name === "primaryDiagnosis"
                    ? [value] // Store as an array
                    : value,
            },
        }));
    };

    const handleNext = async (e) => {
        e.preventDefault();

        try {
            // Save admission details to formData state
            console.log("Sending data:", formData.ho_admissionDetails);

            // No need to make API call here - just navigate to next page
            // The data will be submitted together with medical history and treatment plan
            if (!error) { // Only proceed if there are no validation errors
                navigate(`/h-patientdetails/medical-history/${nic}`);
            }
        } catch (error) {
            console.error("Navigation error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <DualNavbar />

            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6"
            >
                <motion.form 
                    onSubmit={handleNext}
                    initial={{ scale: 0.9, rotate: -2 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring" }}
                    className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-purple-500"
                >
                    <motion.h1 
                        className="text-center text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                        initial={{ y: -20 }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring" }}
                    >
                        Admission Details 
                    </motion.h1>

                    <div className="mb-4">
                        <label className="block font-semibold">Patient Admission Date</label>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.5)" }}
                            type="date"
                            name="admissionDate"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            onChange={handleChange}
                            required
                            value={formData.ho_admissionDetails?.admissionDate || ""}
                        />
                         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Admitting Physician</label>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.5)" }}
                            type="text"
                            name="admittingPhysician"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="Admitting Physician"
                            onChange={handleChange}
                            required
                            value={formData.ho_admissionDetails?.admittingPhysician?.[0] || ""}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Patient Primary Diagnosis</label>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.5)" }}
                            type="text"
                            name="primaryDiagnosis"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="Primary Diagnosis"
                            onChange={handleChange}
                            required
                            value={formData.ho_admissionDetails?.primaryDiagnosis?.[0] || ""}
                        />
                    </div>

                    <div className="flex justify-between mt-4">
                        <motion.button
                            whileHover={{ scale: 1.03, backgroundColor: "rgba(59, 75, 98, 0.72)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="px-4 py-2 rounded-lg bg-gray-500 text-white font-bold shadow-lg"
                            type="button"
                            onClick={() => navigate("/h-patientdetails")}
                        >
                            Back
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03, background: "linear-gradient(45deg, #a855f7, #6366f1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg"
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

export default Ho_AdmissionDetails;
