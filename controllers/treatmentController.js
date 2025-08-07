import { Patient } from "../models/patientModel.js";
import { Treatment } from "../models/hospitalModel.js";

//  Add Treatment for a Patient (Find by NIC)
export const addTreatment = async (request, response) => {
    try {
        const { nic } = request.params;  // Get NIC from the request params
        const {
            ho_admissionDetails,
            medicalHistory,
            treatmentPlan,
            hospitalId,   // Get hospitalId from request body
            hospitalName  // Get hospitalName from request body
        } = request.body;

        // Validate required hospital information
        if (!hospitalId || !hospitalName) {
            return response.status(400).json({ message: "Hospital ID and name are required" });
        }

        // Step 1: Find the patient using the NIC from the Patient model
        const patient = await Patient.findOne({ nic });
        if (!patient) {
            return response.status(404).json({ message: "Patient not found" });
        }

        // Step 2: Create a new treatment document with hospital information
        const newTreatment = new Treatment({
            patient_nic: nic,
            ho_admissionDetails,
            medicalHistory,
            treatmentPlan,
            hospitalId,     // Save the hospital ID
            hospitalName    // Save the hospital name
        });

        // Step 3: Save the treatment document
        await newTreatment.save();

        // Step 4: Respond with the saved treatment data
        response.status(201).json({
            message: "Treatment added successfully",
            treatment: newTreatment,
        });
    } catch (error) {
        console.error("Error adding treatment:", error);
        response.status(500).json({ message: "Error adding treatment", error: error.message });
    }
};

// 🔹 Update Treatment for a Patient (Find by NIC)
export const updateTreatment = async (req, res) => {
    try {
        console.log("🟢 Request received with params:", req.params);
        console.log("🟢 Request body:", req.body);

        const { nic, treatmentId } = req.params;
        const { description, date } = req.body;

        const patient = await Patient.findOne({ nic:nic });
        if (!patient) {
            console.error("❌ Patient not found");
            return res.status(404).json({ message: "Patient not found" });
        }

        const treatment = patient.treatments.id(treatmentId);
        if (!treatment) {
            console.error("❌ Treatment not found");
            return res.status(404).json({ message: "Treatment not found" });
        }

        treatment.description = description || treatment.description;
        treatment.date = date || treatment.date;
        await patient.save();

        console.log("✅ Treatment updated successfully:", treatment);
        res.status(200).json({ message: "Treatment updated", treatment });
    } catch (error) {
        console.error("❌ Server error:", error.message);
        res.status(500).json({ message: "Error updating treatment", error: error.message });
    }
};


// 🔹 Delete Treatment for a Patient (Find by NIC)
export const deleteTreatment = async (req, res) => {
    try {
        const { nic, treatmentId } = req.params;

        const patient = await Patient.findOne({ nic });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        patient.treatments = patient.treatments.filter(t => t._id.toString() !== treatmentId);
        await patient.save();

        res.status(200).json({ message: "Treatment deleted", treatments: patient.treatments });
    } catch (error) {
        res.status(500).json({ message: "Error deleting treatment", error: error.message });
    }
};
