/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";
import DualNavbar from "../components/layout";

const H_PatientDetails = () => {
    const { hospitalName } = useParams(); // Get hospital name from URL
    const [patients, setPatients] = useState([]);
    const [searchNIC, setSearchNIC] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState("Patients");
    const [hospitalInfo, setHospitalInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Get hospital info from localStorage
        const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
        setHospitalInfo(user);
        
        // If we have hospital info but no hospitalName in URL, redirect to include it
        if (user.hospitalName && !hospitalName) {
            const urlFriendlyName = user.hospitalName
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')  // Remove special characters
                .replace(/\s+/g, '-');     // Replace spaces with dashes
            
            navigate(`/${urlFriendlyName}/h-patientdetails`, { replace: true });
            return;
        }
        
        // Fetch patients data
        axios.get("http://localhost:5555/patient/")
            .then((res) => {
                console.log("API Response:", res.data);
                setPatients(res.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching patients:", error);
                setLoading(false);
            });
    }, [hospitalName, navigate]);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`http://localhost:5555/patient/search/${searchNIC}`);
            setSelectedPatient(res.data);
        } catch (error) {
            alert("Patient not found");
            setSelectedPatient(null);
        }
    };

    // Helper function to maintain hospital name in URLs
    const getPathWithHospital = (path) => {
        if (hospitalName) {
            return `/${hospitalName}${path}`;
        }
        return path;
    };

    const navItem = {
        hidden: { y: -20, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                type: "spring",
                stiffness: 100
            }
        }),
        hover: {
            scale: 1.1,
            textShadow: "0 0 8px rgba(255,255,255,0.8)",
            transition: { type: "spring", stiffness: 300 }
        },
        tap: { scale: 0.95 }
    };

    const cardSpring = {
        hover: {
            y: -5,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        },
        tap: {
            scale: 0.98,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }
    };

    const navItems = ['Dashboard', 'Patients', 'Reports'];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
            {/* Use DualNavbar component which now shows logged-in hospital info */}
            <DualNavbar />

            {/* Main Content */}
            <div className="pt-24 pb-12 px-4 container mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-bold text-center text-gray-800 mb-8"
                >
                    {hospitalInfo.hospitalName || "Hospital"} Patient Details
                </motion.h1>

                {/* Search */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <input
                            type="text"
                            className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter Patient NIC"
                            value={searchNIC}
                            onChange={(e) => setSearchNIC(e.target.value)}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSearch}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition"
                        >
                            Search Patient
                        </motion.button>
                    </div>
                </motion.div>

                {/* Spinner while loading data from API */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        {/* Selected Patient (only shown after search) */}
                        {selectedPatient && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 max-w-2xl mx-auto"
                            >
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedPatient.name}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-gray-600"><span className="font-semibold">NIC:</span> {selectedPatient.nic}</p>
                                                    <p className="text-gray-600"><span className="font-semibold">Blood Group:</span> 
                                                        <span className={`ml-2 px-2 py-1 rounded-full ${selectedPatient.blood ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {selectedPatient.blood || 'N/A'}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600"><span className="font-semibold">Date of Birth:</span> {selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString() : 'N/A'}</p>
                                                    <p className="text-gray-600"><span className="font-semibold">Phone:</span> {selectedPatient.tele || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mt-2"><span className="font-semibold">Email:</span> {selectedPatient.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-4 mt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(getPathWithHospital(`/h-patientdetails/ho-admission/${selectedPatient.nic}`))}
                                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-md"
                                        >
                                            Add Treatment
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(getPathWithHospital(`/h-patientdetails/view/${selectedPatient.nic}`))}
                                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md"
                                        >
                                            View Treatments
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* All Patients */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-12"
                        >
                            <motion.h2 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-2xl font-bold text-gray-800 mb-6 text-center"
                            >
                                Patient Registry
                            </motion.h2>

                            {Array.isArray(patients) && patients.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {patients.map((patient) => (
                                        <motion.div
                                            key={patient._id}
                                            variants={cardSpring}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                                        >
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{patient.name}</h3>
                                                <p className="text-gray-600 mb-1"><span className="font-semibold">NIC:</span> {patient.nic}</p>
                                                <p className="text-gray-600 mb-1">
                                                    <span className="font-semibold">Blood Group:</span> 
                                                    <span className={`ml-2 px-2 py-1 rounded-full ${patient.blood ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {patient.blood || 'N/A'}
                                                    </span>
                                                </p>
                                                <div className="flex justify-end mt-4">
                                                <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {
        setSelectedPatient(patient);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow-sm"
>
    View Details
</motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-xl shadow-md p-8 text-center"
                                >
                                    <p className="text-gray-600 text-lg">No patients found in the system.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </>
                )}
            </div>

            {/* Footer */}
            <motion.footer 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-8"
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <motion.div whileHover={{ scale: 1.02 }} className="mb-4 md:mb-0">
                            <h3 className="text-xl font-bold">HealthCare HIMS</h3>
                            <p className="text-blue-200">Advanced Patient Management System</p>
                        </motion.div>
                        <div className="flex space-x-6">
                            <motion.a whileHover={{ y: -3 }} href="#" className="text-blue-200 hover:text-white">Privacy Policy</motion.a>
                            <motion.a whileHover={{ y: -3 }} href="#" className="text-blue-200 hover:text-white">Terms of Service</motion.a>
                            <motion.a whileHover={{ y: -3 }} href="#" className="text-blue-200 hover:text-white">Contact Support</motion.a>
                        </div>
                    </div>
                    <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        className="border-t border-blue-600 mt-6 pt-6 text-center text-blue-200"
                    >
                        <p>&copy; {new Date().getFullYear()} HealthCare HIMS. All rights reserved.</p>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
};

export default H_PatientDetails;
