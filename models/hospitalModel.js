import mongoose from "mongoose";

const Schema = mongoose.Schema;

const patient_hSchema = new Schema({
    ho_admissionDetails: {
        admissionDate: Date,
        admittingPhysician: [String],
        primaryDiagnosis: [String],
    },
    medicalHistory: {
        allergies: [String],
        illnesses: [String],
        medications: [String],
        surgeries: [String],
        su_imaging: [String],
        immunizations:[String],
    },
    treatmentPlan: {
        medications: [ String ],
        labTests: [String],
        te_imaging: [String],
        therapies: [String],
    },

    patient_nic: {  // Store the patient's NIC directly here
        type: String,   // NIC will be stored as a String
        required: true, // Ensure NIC is required
    },
    
    // Add hospital identification fields
    hospitalId: {
        type: String,
        required: true, // Every treatment must have a hospital ID
    },
    
    hospitalName: {
        type: String,
        required: true, // Store hospital name for easier display
    }
});

export const Treatment = mongoose.model("Treatment", patient_hSchema);


