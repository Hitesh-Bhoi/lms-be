import { Document, Types } from "mongoose";

//lead document interface type
export interface LeadInterfaceType extends Document {
    name: string,
    email: string,
    phone: string,
    status: "new" | "contacted" | "qualified" | "lost",//lead status enum
    created_at: Date,
    updated_at: Date,
};
//note document interface type
export interface NoteInterfaceType extends Document {
    lead_id: Types.ObjectId | LeadInterfaceType,
    content: string,
    created_at: Date,
    updated_at: Date,
};