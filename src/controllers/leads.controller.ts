import { Request, Response } from "express";
import mongoose from "mongoose";
import { Lead } from "../models/leads.model";
import { Note } from "../models/notes.model";
import { buildLeadQueryFilter, formatPaginationResponse } from "../services/leads.filter";
import { LeadFilterQueryParams } from "../common/types";

// add new lead record
export const createLead = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data = await Lead.create(req.body);
        return res.status(201).json({ data, message: "Lead saved successfully" });
    } catch (error: unknown) {
        if (
            error instanceof mongoose.Error.ValidationError ||
            error instanceof mongoose.Error.CastError ||
            error instanceof mongoose.Error.StrictModeError
        ) {
            return res.status(400).json({ message: error.message });
        }
        console.error("createLead failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// get all leads
export const getAllLeads = async (req: Request, res: Response): Promise<Response> => {
    try {
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
    } catch (error: unknown) {
        console.error("getAllLeads failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// get lead record by id
export const getLeadById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const data = await Lead.findById(id);
        if (!data) return res.status(404).json({ message: "Lead record not found" });
        return res.status(200).json({
            data,
            message: "Lead record fetched successfully"
        });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: error.message });
        }
        console.error("getLeadById failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// update lead
export const updateLead = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const data = await Lead.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!data) return res.status(404).json({ message: "Lead not found" });
        return res.status(200).json({ data, message: "Lead updated successfully" });
    } catch (error: unknown) {
        if (
            error instanceof mongoose.Error.ValidationError ||
            error instanceof mongoose.Error.CastError ||
            error instanceof mongoose.Error.StrictModeError
        ) {
            return res.status(400).json({ message: error.message });
        }
        console.error("updateLead failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// delete lead
export const deleteLead = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const data = await Lead.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ message: "Lead record not found" });
        // delete associated notes
        await Note.deleteMany({ lead_id: id });
        return res.status(200).json({ message: "Lead record deleted successfully" });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: error.message });
        }
        console.error("deleteLead failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};