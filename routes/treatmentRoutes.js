import express, { request, response } from "express";
import { addTreatment } from "../controllers/treatmentController.js";
import { Patient } from "../models/patientModel.js";
import { Treatment } from "../models/hospitalModel.js";

const router = express.Router();

router.post('/treatment/:nic', async (req, res) => {
    try {
        const { nic } = req.params;
        console.log('Received request for NIC:', nic);
        console.log('Request body:', req.body);

        // Validate request body
        if (!req.body.ho_admissionDetails || !req.body.medicalHistory || !req.body.treatmentPlan) {
            return res.status(400).json({ message: 'Missing required data' });
        }

        const newTreatment = new Treatment({
            patient_nic: nic,
            ho_admissionDetails: req.body.ho_admissionDetails,
            medicalHistory: req.body.medicalHistory,
            treatmentPlan: req.body.treatmentPlan,
            hospitalId: req.body.hospitalId,
            hospitalName: req.body.hospitalName
        });

        const savedTreatment = await newTreatment.save();
        
        res.status(201).json({
            message: 'Treatment added successfully',
            treatment: savedTreatment
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            message: 'Error adding treatment',
            error: error.message
        });
    }
});

router.get('/treatment/:nic', async (req, res) => {
    try {
        const { nic } = req.params;
        const { hospitalId } = req.query; // Get hospitalId from query parameters
        
        let query = { patient_nic: nic };
        
        // If hospitalId is provided, add it to the query filter
        if (hospitalId) {
            query.hospitalId = hospitalId;
        }
        
        const treatments = await Treatment.find(query);
        
        if (treatments.length === 0) {
            return res.status(404).json({ 
                error: hospitalId 
                    ? "No treatments found for this patient that were added by your hospital" 
                    : "No treatments found for this patient" 
            });
        }
        
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put('/treatment/:nic/:treatmentId', async (req, res) => {
    const { nic, treatmentId } = req.params;
    console.log(`🛬 Received Update Request | NIC: ${nic} | Treatment ID: ${treatmentId}`);

    try {
        // 1. Find the treatment by treatmentId and NIC
        const treatment = await Treatment.findOne({ _id: treatmentId, patient_nic: nic });

        if (!treatment) {
            console.log("❌ Treatment not found for Treatment ID and NIC:", treatmentId, nic);
            return res.status(404).json({ message: "Treatment not found" });
        }

        // 2. Update treatment fields with request body
        Object.assign(treatment, req.body);

        // 3. Save the updated treatment
        await treatment.save();

        console.log("✅ Treatment updated successfully.");
        return res.status(200).json({ message: "Treatment updated successfully", treatment });
    } catch (error) {
        console.error("❌ Error updating treatment:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Use patient NIC in the route
router.delete('/treatments/:nic', async (req, res) => {
    try {
        const deletedTreatment = await Treatment.findOneAndDelete({ patient_nic: req.params.nic });
        if (!deletedTreatment) {
            return res.status(404).json({ message: 'Treatment not found for this NIC' });
        }
        res.json({ message: 'Treatment deleted successfully' });
    } catch (error) {
        console.error('Error deleting treatment:', error);
        res.status(500).json({ message: 'Error deleting treatment' });
    }
});

// Example for fetching all treatment records from your backend
router.get(`/treatments/all`, async (req, res) => {
    try {
        const treatments = await Treatment.find(); // Assume `Treatment` is your treatment model
        res.json({ data: treatments });
    } catch (err) {
        res.status(500).send("Error fetching treatment data");
    }
});

// Add these new endpoints
router.get('/treatment/count/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        // Get unique patient count for this hospital
        const uniquePatients = await Treatment.distinct('patient_nic', { hospitalId }).length;
        
        // Get active treatments count
        const activeTreatments = await Treatment.countDocuments({
            hospitalId,
            status: 'active'
        });

        res.json({
            uniquePatients,
            activeTreatments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/treatment/stats/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        // Get unique patient count
        const uniquePatients = await Treatment.distinct('patient_nic', { hospitalId });
        
        // Get active treatments count
        const activeTreatments = await Treatment.countDocuments({
            hospitalId,
            'treatmentPlan.medications': { $exists: true, $ne: [] }
        });

        // Get completed treatments count
        const completedTreatments = await Treatment.countDocuments({
            hospitalId,
            'treatmentPlan.medications': { $exists: true, $ne: [] },
            // Add any other conditions that define a completed treatment
        });

        res.json({
            totalPatients: uniquePatients.length,
            activeTreatments,
            completedTreatments,
            pendingReports: await Treatment.countDocuments({
                hospitalId,
                'treatmentPlan.te_imaging': { $size: 0 }
            })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
