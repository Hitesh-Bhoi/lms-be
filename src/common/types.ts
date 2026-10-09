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
}
// lead document interface
export interface LeadDocument extends Document {
    name: string;
    email: string;
    phone: string;
    status: LEADS_STATUS_ENUM; // lead status types
    created_at: Date;
    updated_at: Date;
}

// note document interface
export interface NoteDocument extends Document {
    lead_id: Types.ObjectId | LeadDocument;
    content: string;
    created_at: Date;
    updated_at: Date;
}

// user document interface
export interface UserDocument extends Document {
    email: string;
    password: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}

// pagination response interface
export interface PaginationResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// filter query params interface
export interface LeadFilterQueryParams {
    search?: string;
    status?: string;
    page?: string;
    limit?: string;
}

// pagination filter result interface
export interface PaginationFilterResult {
    pageNumber: number;
    limitNumber: number;
    skip: number;
}

// lead filter result interface
export interface LeadFilterResult {
    filterObj: Record<string, unknown>;
    pagination: PaginationFilterResult;
}