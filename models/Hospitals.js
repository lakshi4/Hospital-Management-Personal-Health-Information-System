import mongoose from "mongoose";

const hospitalSchema = mongoose.Schema(
    {   hospitalId: {
        type: String,
        unique: true,
        required: true,
        default: 'H0001'  // Default starting ID
        },
        hospitalName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobile1: {
            type: String,
            required: true,
        },
        mobile2: {
            type: String
        },
        password: {
            type: String,
            required: true,
        },
        certificateImage: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
          },
          role: {
            type: String,
            default: "hospital",
        },
          
    },
    {
        timestamps: true,
    }
);

export const Hospital = mongoose.model('hospital', hospitalSchema);