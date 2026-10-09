import mongoose, { model, Schema } from "mongoose";
import { NoteDocument } from "../common/types";

const noteSchema = new Schema<NoteDocument>({
    lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: [true, "Lead ID is required"],
        index: true
    },
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true
    }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export const Note = model<NoteDocument>("Note", noteSchema);