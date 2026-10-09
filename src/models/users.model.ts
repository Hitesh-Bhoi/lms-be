import { model, Schema } from "mongoose";
import { UserDocument } from "../common/types";
import { emailRegex } from "../common";

const userSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [emailRegex, "Please enter a valid email address"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        default: "admin"
    }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

export const User = model<UserDocument>("User", userSchema);
