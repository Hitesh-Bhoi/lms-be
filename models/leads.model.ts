import { model, Schema } from "mongoose";
import { LeadInterfaceType } from "../types";

const leadSchema = new Schema<LeadInterfaceType>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true
    },
    status: {
        type: String,
        enum: ["new", "contacted", "qualified", "lost"],
        default: "new",
    }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export const Lead = model<LeadInterfaceType>("Lead", leadSchema);