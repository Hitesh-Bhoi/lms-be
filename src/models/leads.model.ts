import { model, Schema } from "mongoose";
import { LeadDocument } from "../common/types";
import { emailRegex, normalizePhone, phoneRegex } from "../common";
import { LEADS_STATUS_ENUM } from "../common/enums";

const leadSchema = new Schema<LeadDocument>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        match: [
            emailRegex,
            "Please enter a valid email address"
        ],
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        set: (v: string) => (typeof v === "string" ? normalizePhone(v) : v),
        match: [
            phoneRegex,
            "please enter a valid phone number"
        ],
        trim: true
    },
    status: {
        type: String,
        enum: [LEADS_STATUS_ENUM.NEW, LEADS_STATUS_ENUM.CONTACTED, LEADS_STATUS_ENUM.QUALIFIED, LEADS_STATUS_ENUM.LOST],
        default: LEADS_STATUS_ENUM.NEW,
    }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    strict: "throw" // throw error if unexpected fields are provided
});

// export lead model
export const Lead = model<LeadDocument>("Lead", leadSchema);