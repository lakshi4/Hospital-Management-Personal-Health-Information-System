import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import DualNavbar from "../components/layout";

const TreatmentReport = ({ treatment }) => {
    const componentRef = useRef();
    const [additionalNotes, setAdditionalNotes] = useState('');
    
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <DualNavbar />
            
            <div className="container mx-auto px-4 py-6">
                <div className="mb-4 flex gap-4 items-start">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes
                        </label>
                        <textarea
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            className="w-full p-3 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter any additional notes or observations..."
                        />
                    </div>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 print:hidden"
                    >
                        Print Report
                    </button>
                </div>

                <div ref={componentRef} className="bg-white p-8 rounded-lg shadow-lg print:shadow-none print:p-0">
                    {/* Report Header */}
                    <div className="text-center mb-8 border-b pb-4 print:border-b-2">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Treatment Report</h1>
                        <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Patient Info Section */}
                    <div className="mb-8 print:mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-800 print:text-black">Patient Information</h2>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg print:bg-white print:p-2 print:border">
                            <div>
                                <p><span className="font-semibold">NIC:</span> {treatment.patient_nic}</p>
                                <p><span className="font-semibold">Hospital:</span> {treatment.hospitalName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Admission Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Admission Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <p><span className="font-semibold">Admission Date:</span> {
                                new Date(treatment.ho_admissionDetails?.admissionDate).toLocaleDateString()
                            }</p>
                            <p><span className="font-semibold">Admitting Physician:</span> {
                                treatment.ho_admissionDetails?.admittingPhysician?.join(", ")
                            }</p>
                            <p><span className="font-semibold">Primary Diagnosis:</span> {
                                treatment.ho_admissionDetails?.primaryDiagnosis?.join(", ")
                            }</p>
                        </div>
                    </div>

                    {/* Medical History */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Medical History</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">Allergies</h3>
                                <p>{treatment.medicalHistory?.allergies?.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Illnesses</h3>
                                <p>{treatment.medicalHistory?.illnesses?.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Medications</h3>
                                <p>{treatment.medicalHistory?.medications?.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Surgeries</h3>
                                <p>{treatment.medicalHistory?.surgeries?.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Immunizations</h3>
                                <p>{treatment.medicalHistory?.immunizations?.join(", ") || "None"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Medical Records Section */}
                    <div className="mb-8 print:mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-800 print:text-black">Medical Records</h2>
                        <div className="space-y-6">
                            {/* Images Section */}
                            {(treatment.medicalHistory?.su_imaging?.length > 0 || 
                              treatment.treatmentPlan?.te_imaging?.length > 0) && (
                                <div className="print:break-inside-avoid">
                                    <h3 className="text-xl font-semibold mb-3">Medical Images</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Surgery Reports */}
                                        {treatment.medicalHistory?.su_imaging?.map((image, index) => (
                                            <div key={`surgery-${index}`} className="break-inside-avoid-page">
                                                <img
                                                    src={image}
                                                    alt={`Surgery Report ${index + 1}`}
                                                    className="w-full h-auto max-h-64 object-contain border rounded-lg print:max-h-48"
                                                />
                                                <p className="text-center text-sm mt-1">Surgery Report {index + 1}</p>
                                            </div>
                                        ))}
                                        
                                        {/* Lab Reports */}
                                        {treatment.treatmentPlan?.te_imaging?.map((image, index) => (
                                            <div key={`lab-${index}`} className="break-inside-avoid-page">
                                                <img
                                                    src={image}
                                                    alt={`Lab Report ${index + 1}`}
                                                    className="w-full h-auto max-h-64 object-contain border rounded-lg print:max-h-48"
                                                />
                                                <p className="text-center text-sm mt-1">Lab Report {index + 1}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Treatment Plan */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Treatment Plan</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">Medications</h3>
                                <p>{treatment.treatmentPlan?.medications?.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Lab Tests</h3>
                                <p>{treatment.treatmentPlan?.labTests?.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Therapies</h3>
                                <p>{treatment.treatmentPlan?.therapies?.join(", ") || "None"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Add Additional Notes section before footer */}
                    {additionalNotes && (
                        <div className="mb-8 print:mb-6">
                            <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
                            <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border print:p-3">
                                <p className="whitespace-pre-wrap">{additionalNotes}</p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t print:mt-4 print:pt-2 print:border-t-2">
                        <div className="text-center text-gray-600 text-sm">
                            <p className="font-semibold mb-1">{treatment.hospitalName}</p>
                            <p>Generated by HealthCare HIMS on {new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print-specific styles */}
            <style>
                {`
                    @media print {
                        @page {
                            margin: 2cm;
                            size: A4;
                        }
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        img {
                            max-width: 100% !important;
                            page-break-inside: avoid;
                        }
                        .break-inside-avoid-page {
                            page-break-inside: avoid;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default TreatmentReport;
