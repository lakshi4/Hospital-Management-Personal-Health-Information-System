import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const ImageModal = ({ image, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full mx-auto">
                <button
                    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
                    onClick={onClose}
                >
                    ×
                </button>
                <img
                    src={image}
                    alt="Full size"
                    className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

const ImagePreview = ({ images, title }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || images.length === 0) return <span>No images</span>;

    return (
        <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
                <div key={index} className="relative group cursor-pointer">
                    <div 
                        className="w-24 h-24 relative overflow-hidden rounded-lg border border-gray-200"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img
                            src={image}
                            alt={`${title} ${index + 1}`}
                            className="w-full h-full object-cover transition-transform hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-medium px-2 py-1 bg-black bg-opacity-50 rounded">
                                View
                            </span>
                        </div>
                    </div>
                </div>
            ))}
            {selectedImage && (
                <ImageModal 
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

const TreatmentReportContent = ({ treatment }) => {
    return (
        <div className="p-8 bg-white print:p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Treatment Report</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Patient Information</h2>
                <p><strong>NIC:</strong> {treatment.patient_nic}</p>
                <p><strong>Hospital:</strong> {treatment.hospitalName}</p>
            </div>
            
            {/* Admission Details */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Admission Details</h2>
                <p><strong>Date:</strong> {new Date(treatment.ho_admissionDetails?.admissionDate).toLocaleDateString()}</p>
                <p><strong>Physician:</strong> {treatment.ho_admissionDetails?.admittingPhysician?.join(", ")}</p>
                <p><strong>Diagnosis:</strong> {treatment.ho_admissionDetails?.primaryDiagnosis?.join(", ")}</p>
            </div>

            {/* Medical History */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Medical History</h2>
                <p><strong>Allergies:</strong> {treatment.medicalHistory?.allergies?.join(", ") || "None"}</p>
                <p><strong>Illnesses:</strong> {treatment.medicalHistory?.illnesses?.join(", ") || "None"}</p>
                <p><strong>Medications:</strong> {treatment.medicalHistory?.medications?.join(", ") || "None"}</p>
                <p><strong>Surgeries:</strong> {treatment.medicalHistory?.surgeries?.join(", ") || "None"}</p>
                <p><strong>Immunizations:</strong> {treatment.medicalHistory?.immunizations?.join(", ") || "None"}</p>
            </div>

            {/* Surgery Reports Section */}
            {treatment.medicalHistory?.su_imaging?.length > 0 && (
                <div className="mb-6 page-break-inside-avoid">
                    <h2 className="text-xl font-semibold mb-3">Surgery Reports</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {treatment.medicalHistory.su_imaging.map((image, index) => (
                            <div key={index} className="print:break-inside-avoid">
                                <img
                                    src={image}
                                    alt={`Surgery Report ${index + 1}`}
                                    className="w-full max-h-64 object-contain border rounded-lg"
                                />
                                <p className="text-center text-sm mt-1">Surgery Report {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Treatment Plan */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Treatment Plan</h2>
                <p><strong>Medications:</strong> {treatment.treatmentPlan?.medications?.join(", ") || "None"}</p>
                <p><strong>Lab Tests:</strong> {treatment.treatmentPlan?.labTests?.join(", ") || "None"}</p>
                <p><strong>Therapies:</strong> {treatment.treatmentPlan?.therapies?.join(", ") || "None"}</p>
            </div>

            {/* Lab Reports Section */}
            {treatment.treatmentPlan?.te_imaging?.length > 0 && (
                <div className="mb-6 page-break-inside-avoid">
                    <h2 className="text-xl font-semibold mb-3">Lab Reports</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {treatment.treatmentPlan.te_imaging.map((image, index) => (
                            <div key={index} className="print:break-inside-avoid">
                                <img
                                    src={image}
                                    alt={`Lab Report ${index + 1}`}
                                    className="w-full max-h-64 object-contain border rounded-lg"
                                />
                                <p className="text-center text-sm mt-1">Lab Report {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="text-center text-sm text-gray-500 mt-8">
                <p>Report generated on {new Date().toLocaleString()}</p>
                <p>{treatment.hospitalName}</p>
            </div>
        </div>
    );
};

const generateReport = (treatment) => {
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Treatment Report - ${treatment.patient_nic}</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>
                    @media print {
                        body { padding: 20px; }
                        button { display: none; }
                        .page-break-inside-avoid { page-break-inside: avoid; }
                        img { max-width: 100%; height: auto; }
                        @page { margin: 2cm; }
                    }
                    .print-button {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 1000;
                    }
                </style>
            </head>
            <body>
                <button onclick="window.print()" class="print-button px-4 py-2 bg-blue-500 text-white rounded shadow">
                    Print Report
                </button>
                <div id="report-root"></div>
            </body>
        </html>
    `);

    const root = ReactDOM.createRoot(reportWindow.document.getElementById('report-root'));
    root.render(<TreatmentReportContent treatment={treatment} />);
};

// Example usage of generateReport
// Uncomment the following line if you want to use it in the component
// generateReport(treatments[0]); // Pass a treatment object as needed

const ViewTreatment = () => {
    const { nic } = useParams();  // Get NIC from URL
    const [treatments, setTreatments] = useState([]);  // Array to hold multiple treatments
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hospitalInfo, setHospitalInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Get hospital info from localStorage
        const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
        setHospitalInfo(user);
        
        // Early return if no hospital info
        if (!user || !user.hospitalId) {
            setError("Hospital information not found. Please log in again.");
            setLoading(false);
            return;
        }

        // Fetch treatments with hospital filter
        axios.get(`http://localhost:5555/api/treatment/${nic}`, {
            params: { hospitalId: user.hospitalId }
        })
        .then((res) => {
            console.log("Fetched Treatments:", res.data);
            setTreatments(res.data);
            setLoading(false);
        })
        .catch((error) => {
            if (error.response?.status === 404) {
                console.warn("No treatment record found for this NIC and hospital.");
                setTreatments([]);
                setError("No treatments found that were added by your hospital for this patient.");
            } else {
                console.error("Error fetching treatments:", error);
                setError("An error occurred while fetching treatments.");
            }
            setLoading(false);
        });
    }, [nic]);

    // ✅ Working Delete Function for each treatment
    const handleDelete = async (treatmentId) => {
        // Verify this hospital owns the treatment before deleting
        const treatmentToDelete = treatments.find(t => t._id === treatmentId);
        
        if (treatmentToDelete.hospitalId !== hospitalInfo.hospitalId) {
            alert("You can only delete treatments added by your hospital.");
            return;
        }
        
        if (!window.confirm("Are you sure you want to delete this treatment record?")) return;

        try {
            const response = await axios.delete(`http://localhost:5555/api/treatments/${treatmentId}`);  // Ensure the correct endpoint for deletion
            console.log("Delete response:", response);
            alert("Treatment deleted successfully!");
            setTreatments(treatments.filter(t => t._id !== treatmentId)); // Remove the deleted treatment from state
        } catch (error) {
            console.error("Error deleting treatment:", error.response ? error.response.data : error.message);
            alert(`Error deleting treatment: ${error.response?.data?.message || "Server error"}`);
        }
    };

    // Get hospital path for navigation
    const getHospitalPath = () => {
        if (hospitalInfo && hospitalInfo.hospitalName) {
            const urlFriendlyName = hospitalInfo.hospitalName
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            return `/${urlFriendlyName}/h-patientdetails`;
        }
        return "/h-patientdetails";
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DualNavbar />

            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Patient Treatment Details</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                        <p>{error}</p>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate(getHospitalPath())}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Back to Patient List
                            </button>
                        </div>
                    </div>
                ) : treatments.length > 0 ? (
                    treatments.map((treatment) => (
                        <div key={treatment._id} className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Treatment Record for NIC: {treatment.patient_nic}</h3>
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    Added by: {treatment.hospitalName || "Unknown Hospital"}
                                </div>
                            </div>

                            {/* Admission Details Table */}
                            <table className="min-w-full table-auto text-left text-sm mb-4">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border">Admission Date</th>
                                        <th className="px-4 py-2 border">Admitting Physician</th>
                                        <th className="px-4 py-2 border">Primary Diagnosis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border">
                                            {treatment.ho_admissionDetails?.admissionDate
                                                ? new Date(treatment.ho_admissionDetails.admissionDate).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {treatment.ho_admissionDetails?.admittingPhysician?.join(", ") || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {treatment.ho_admissionDetails?.primaryDiagnosis?.join(", ") || "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Medical History Table */}
                            <h3 className="text-lg font-semibold mt-4">Medical History</h3>
                            <table className="min-w-full table-auto text-left text-sm mb-4">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border">Allergies</th>
                                        <th className="px-4 py-2 border">Illnesses</th>
                                        <th className="px-4 py-2 border">Medications</th>
                                        <th className="px-4 py-2 border">Surgeries</th>
                                        <th className="px-4 py-2 border">Surgeries Report</th>
                                        <th className="px-4 py-2 border">Immunizations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.allergies?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.illnesses?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.medications?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.surgeries?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">
                                            <ImagePreview 
                                                images={treatment.medicalHistory?.su_imaging} 
                                                title="Surgery Report"
                                            />
                                        </td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.immunizations?.join(", ") || "None"}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Treatment Plan Table */}
                            <h3 className="text-lg font-semibold mt-4">Treatment Plan</h3>
                            <table className="min-w-full table-auto text-left text-sm mb-4">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border">Medications</th>
                                        <th className="px-4 py-2 border">Lab Tests</th>
                                        <th className="px-4 py-2 border">Lab Reports</th>
                                        <th className="px-4 py-2 border">Therapies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border">{treatment.treatmentPlan?.medications?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.treatmentPlan?.labTests?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">
                                            <ImagePreview 
                                                images={treatment.treatmentPlan?.te_imaging} 
                                                title="Lab Report"
                                            />
                                        </td>
                                        <td className="px-4 py-2 border">{treatment.treatmentPlan?.therapies?.join(", ") || "None"}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex space-x-2">
                            <button
                                    onClick={() => navigate(`/h-patientdetails/update/${nic}/${treatment._id}`)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
                                >
                                    Update Treatment
                                </button>
                              
                            {/* Add Report Button */}
                            <button
                                onClick={() => generateReport(treatment)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mt-4"
                            >
                                Generate Report
                            </button>

                            <button
                                onClick={() => handleDelete(treatment._id)}  // Delete specific treatment
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4"
                            >
                                Delete Treatment
                            </button>
                        </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-gray-600 mb-4">No treatment records found that were added by your hospital for this patient.</p>
                        <button
                            onClick={() => navigate(`/h-patientdetails/ho-admission/${nic}`)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Add Treatment
                        </button>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(getHospitalPath())}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTreatment;
