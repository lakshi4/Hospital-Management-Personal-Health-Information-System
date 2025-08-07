import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // For generating PDFs
import { saveAs } from "file-saver"; // For generating CSV

const TreatmentReportPage = () => {
    const [treatments, setTreatments] = useState([]);
    
    // Fetch all treatments
    useEffect(() => {
        axios.get(`http://localhost:5555/api/treatment/all`)  // Update the endpoint as per your API
            .then((res) => {
                setTreatments(res.data.data);
            })
            .catch((error) => console.error("Error fetching treatments:", error));
    }, []);

    // Generate PDF Report
    const generatePDFReport = () => {
        const doc = new jsPDF();
        doc.text("Treatment Report", 20, 10);
        
        const tableColumn = ["Treatment ID", "Patient Name", "NIC", "Blood Group", "Treatment Details", "Date"];
        const tableRows = treatments.map((treatment) => [
            treatment._id,
            treatment.patientName,
            treatment.patientNIC,
            treatment.patientBloodGroup,
            treatment.treatmentDetails,
            new Date(treatment.date).toLocaleDateString()
        ]);

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.save("treatment_report.pdf");
    };

    // Generate CSV Report
    const generateCSVReport = () => {
        const treatmentData = treatments.map((treatment) => ({
            TreatmentID: treatment._id,
            PatientName: treatment.patientName,
            NIC: treatment.patientNIC,
            BloodGroup: treatment.patientBloodGroup,
            TreatmentDetails: treatment.treatmentDetails,
            Date: new Date(treatment.date).toLocaleDateString(),
        }));

        const csv = [
            ["Treatment ID", "Patient Name", "NIC", "Blood Group", "Treatment Details", "Date"],
            ...treatmentData.map((t) => [t.TreatmentID, t.PatientName, t.NIC, t.BloodGroup, t.TreatmentDetails, t.Date]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "treatment_report.csv");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Treatment Report</h2>

                {/* Report Display Section */}
                {treatments.length > 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h3 className="text-xl font-semibold mb-4">Treatment Details</h3>
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border text-left">Treatment ID</th>
                                    <th className="px-4 py-2 border text-left">Patient Name</th>
                                    <th className="px-4 py-2 border text-left">NIC</th>
                                    <th className="px-4 py-2 border text-left">Blood Group</th>
                                    <th className="px-4 py-2 border text-left">Treatment Details</th>
                                    <th className="px-4 py-2 border text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {treatments.map((treatment, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 border">{treatment._id}</td>
                                        <td className="px-4 py-2 border">{treatment.patientName}</td>
                                        <td className="px-4 py-2 border">{treatment.patientNIC}</td>
                                        <td className="px-4 py-2 border">{treatment.patientBloodGroup}</td>
                                        <td className="px-4 py-2 border">{treatment.treatmentDetails}</td>
                                        <td className="px-4 py-2 border">{new Date(treatment.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No treatments found.</p>
                )}

                {/* Buttons for PDF and CSV generation */}
                {treatments.length > 0 && (
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={generatePDFReport}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Download PDF Report
                        </button>
                        <button
                            onClick={generateCSVReport}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                        >
                            Download CSV Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreatmentReportPage;
