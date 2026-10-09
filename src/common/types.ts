import { Document, Types } from "mongoose";
import { LEADS_STATUS_ENUM } from "./enums";

// auth token payload interface
export interface AuthTokenPayload {
    id: string;
    email: string;
    role: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
        }
    }
};
//lead document interface type
export interface LeadInterfaceType extends Document {
    name: string,
    email: string,
    phone: string,
    status: LEADS_STATUS_ENUM,//lead status types
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

// user document interface type
export interface UserInterfaceType extends Document {
    email: string;
    password: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}