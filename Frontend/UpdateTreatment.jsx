import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const UpdateTreatment = () => {
    const { nic, treatmentId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ho_admissionDetails: {
            admissionDate: "",
            admittingPhysician: "",
            primaryDiagnosis: ""
        },
        medicalHistory: {
            allergies: "",
            illnesses: "",
            medications: "",
            surgeries: "",
            su_imaging: [],
            immunizations: ""
        },
        treatmentPlan: {
            medications: "",
            labTests: "",
            te_imaging: [],
            therapies: ""
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get hospital info
        const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
        
        setLoading(true);
        axios.get(`http://localhost:5555/api/treatment/${nic}`)
            .then((res) => {
                const selectedTreatment = res.data.find(treatment => treatment._id === treatmentId);

                if (selectedTreatment) {
                    // Check if this treatment belongs to the current hospital
                    if (selectedTreatment.hospitalId !== user.hospitalId) {
                        alert("You can only update treatments added by your hospital.");
                        navigate(`/h-patientdetails/view/${nic}`);
                        return;
                    }
                    
                    setFormData(selectedTreatment);
                } else {
                    alert("Treatment record not found.");
                    navigate(`/h-patientdetails/view/${nic}`);
                }
            })
            .catch((error) => {
                console.error("Error fetching treatment:", error);
                alert("Failed to load treatment data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [nic, treatmentId, navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const keys = name.split(".");

        setFormData((prevData) => {
            const updatedData = { ...prevData };
            let ref = updatedData;

            for (let i = 0; i < keys.length - 1; i++) {
                ref = ref[keys[i]];
            }

            if (type === "file") {
                ref[keys[keys.length - 1]] = Array.from(files);
            } else {
                ref[keys[keys.length - 1]] = value;
            }

            return updatedData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `http://localhost:5555/api/treatment/${nic}/${treatmentId}`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Treatment Update successful:", response.data);
            navigate(`/h-patientdetails/view/${nic}`);
        } catch (error) {
            console.error("Error updating treatment:", error.response?.data || error.message);
            alert(`Error updating treatment: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DualNavbar />
            <div>
                {loading ? (
                    <p>Loading treatment details...</p>
                ) : (
                    <div className="container mx-auto px-4 py-6">
                        <h2 className="text-2xl font-semibold text-center mb-4">Update Treatment Details</h2>

                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto">
                            <h3 className="text-xl font-semibold mb-4">Patient NIC: {nic}</h3>

                            <form onSubmit={handleSubmit}>
                                {/* Admission Details */}
                                <h3 className="text-lg font-semibold mt-4">Admission Details</h3>
                                <input type="text" name="ho_admissionDetails.admissionDate" value={formData.ho_admissionDetails.admissionDate} onChange={handleChange} placeholder="Admission Date" className="w-full p-2 border border-gray-300 mb-4" />
                                <input type="text" name="ho_admissionDetails.admittingPhysician" value={formData.ho_admissionDetails.admittingPhysician} onChange={handleChange} placeholder="Admitting Physician" className="w-full p-2 border border-gray-300 mb-4" />
                                <input type="text" name="ho_admissionDetails.primaryDiagnosis" value={formData.ho_admissionDetails.primaryDiagnosis} onChange={handleChange} placeholder="Primary Diagnosis" className="w-full p-2 border border-gray-300 mb-4" />

                                {/* Medical History */}
                                <h3 className="text-lg font-semibold mt-4">Medical History</h3>
                                <input type="text" name="medicalHistory.allergies" value={formData.medicalHistory.allergies} onChange={handleChange} placeholder="Allergies" className="w-full p-2 border border-gray-300 mb-4" />
                                <input type="text" name="medicalHistory.illnesses" value={formData.medicalHistory.illnesses} onChange={handleChange} placeholder="Illnesses" className="w-full p-2 border border-gray-300 mb-4" />
                                <input type="text" name="medicalHistory.medications" value={formData.medicalHistory.medications} onChange={handleChange} placeholder="Medications" className="w-full p-2 border border-gray-300 mb-4" />
                                <input type="text" name="medicalHistory.surgeries" value={formData.medicalHistory.surgeries} onChange={handleChange} placeholder="Surgeries" className="w-full p-2 border border-gray-300 mb-4" />

                                <input type="file" name="medicalHistory.su_imaging" multiple onChange={handleChange} className="w-full p-2 border border-gray-300 mb-4" />
                                {formData.medicalHistory?.su_imaging?.map((file, index) => (
                                    <img 
                                        key={index}
                                        src={typeof file === "string" ? file : URL.createObjectURL(file)} 
                                        alt={`su_imaging-${index}`} 
                                        className="w-24 h-24 object-cover" 
                                    />
                                ))}

                                <input type="text" name="medicalHistory.immunizations" value={formData.medicalHistory.immunizations} onChange={handleChange} placeholder="Immunizations" className="w-full p-2 border border-gray-300 mb-4" />

                                {/* Treatment Plan */}
                                <h3 className="text-lg font-semibold mt-4">Treatment Plan</h3>
                                <input type="text" name="treatmentPlan.medications" value={formData.treatmentPlan.medications} onChange={handleChange} placeholder="Medications" className="w-full p-2 border border-gray-300 mb-4" />
                                <input type="text" name="treatmentPlan.labTests" value={formData.treatmentPlan.labTests} onChange={handleChange} placeholder="Lab Tests" className="w-full p-2 border border-gray-300 mb-4" />

                                <input type="file" name="treatmentPlan.te_imaging" multiple onChange={handleChange} className="w-full p-2 border border-gray-300 mb-4" />
                                {formData.treatmentPlan?.te_imaging?.map((file, index) => (
                                    <img 
                                        key={index}
                                        src={typeof file === "string" ? file : URL.createObjectURL(file)} 
                                        alt={`te_imaging-${index}`} 
                                        className="w-24 h-24 object-cover" 
                                    />
                                ))}

                                <input type="text" name="treatmentPlan.therapies" value={formData.treatmentPlan.therapies} onChange={handleChange} placeholder="Therapies" className="w-full p-2 border border-gray-300 mb-4" />

                                <div className="flex justify-between mt-4">
                                    <button 
                                        type="button"
                                        onClick={() => navigate(`/h-patientdetails/view/${nic}`)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>

                                    <button 
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Update Treatment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateTreatment;
