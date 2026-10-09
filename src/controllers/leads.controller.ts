import { Request, Response } from "express";
import mongoose from "mongoose";
import { Lead } from "../models/leads.model";
import { Note } from "../models/notes.model";
import { buildLeadQueryFilter, formatPaginationResponse } from "../services/leads.filter";
import { LeadFilterQueryParams } from "../common/types";
import { asyncHandler, ApiError } from "../middleware/error.handler";

// add new lead record
export const createLead = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const data = await Lead.create(req.body);
    return res.status(201).json({ data, message: "Lead saved successfully" });
});

// get all leads
export const getAllLeads = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    // extract filters and pagination helpers
    const { filterObj, pagination } = buildLeadQueryFilter(req.query as LeadFilterQueryParams);
    const { pageNumber, limitNumber, skip } = pagination;
    // fetch leads and count total documents
    const [data, total] = await Promise.all([
        Lead.find(filterObj)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limitNumber),
        Lead.countDocuments(filterObj)
    ]);
    return res.status(200).json({
        data,
        pagination: formatPaginationResponse(total, pageNumber, limitNumber),
        message: "All lead records fetched successfully"
    });
});

// get lead record by id
export const getLeadById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const data = await Lead.findById(id);
    if (!data) throw new ApiError(404, "Lead record not found");
    return res.status(200).json({
        data,
        message: "Lead record fetched successfully"
    });
});

// update lead
export const updateLead = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const data = await Lead.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!data) throw new ApiError(404, "Lead not found");
    return res.status(200).json({ data, message: "Lead updated successfully" });
});

// delete lead
export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const data = await Lead.findByIdAndDelete(id, { session });
            if (!data) throw new ApiError(404, "Lead record not found");
            // delete associated notes
            await Note.deleteMany({ lead_id: id }, { session });
        });
        return res.status(200).json({ message: "Lead record deleted successfully" });
    } catch (error: unknown) {
        if (error instanceof ApiError) throw error;
        // fallback if transactions are not supported by the deployed MongoDB topology
        const isNotReplicaSet = error instanceof Error && /replica set|transaction numbers/i.test(error.message);
        if (isNotReplicaSet) {
            const data = await Lead.findByIdAndDelete(id);
            if (!data) throw new ApiError(404, "Lead record not found");
            await Note.deleteMany({ lead_id: id });
            return res.status(200).json({ message: "Lead record deleted successfully" });
        }
        throw error;
    } finally {
        await session.endSession();
    }
});