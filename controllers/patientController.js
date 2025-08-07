import { Patient } from "../models/patientModel.js";

// Get all patients
export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search patient by NIC
export const getPatientByNIC = async (req, res) => {
    try {
        const nicValue = req.params.nic.trim();  // Ensure no extra spaces
        console.log("Searching for NIC:", nicValue);

        const patient = await Patient.findOne({ nic: nicValue }); // Search by NIC field

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update patient details
export const updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


