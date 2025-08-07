import mongoose from "mongoose";

const patientSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        nic: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        blood: {
            type: String,
            required: true,
        },
        tele: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        }, 
        pic: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

export const Patient = mongoose.model('P', patientSchema);