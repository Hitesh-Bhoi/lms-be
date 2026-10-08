import { Request, Response } from "express";
import mongoose from "mongoose";
import { Lead } from "../models/leads.model";
import { LeadQueryFilter, formatPaginationResponse } from "../services/leads-filter";

// add new lead record
export const createLead = async (req: Request, res: Response) => {
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
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};

// get all lead records
export const getAllLeadRecords = async (req: Request, res: Response) => {
    try {
        // extract necessary flags from service helpers
        const { filterObj, pagination } = LeadQueryFilter(req.query);
        const { pageNumber, limitNumber, skip } = pagination;
        // fetch leads record and total count of leads
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
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};

// get lead record by id
export const getLeadById = async (req: Request, res: Response) => {
    try {
        const data = await Lead.findById(req.params.id);
        if (!data) return res.status(404).json({ message: "Lead record not found" });
        return res.status(200).json({
            data,
            message: "Lead record fetched successfully"
        });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};

// update lead record
export const updateLeadRecord = async (req: Request, res: Response) => {
    try {
        const data = await Lead.findByIdAndUpdate(req.params.id,
            { $set: req.body },// return updated document
            { new: true, runValidators: true });// make sure mongoose schema rules are enforced
        if (!data) return res.status(404).json({ message: "Lead not found" })
        return res.status(200).json({ data, message: "Lead updated successfully" });
    } catch (error: unknown) {
        if (
            error instanceof mongoose.Error.ValidationError ||
            error instanceof mongoose.Error.CastError ||
            error instanceof mongoose.Error.StrictModeError
        ) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};

// delete lead record
export const deleteLeadRecord = async (req: Request, res: Response) => {
    try {
        const id: string | string[] = req.params.id;
        if (!id) return res.status(400).json({ message: "Lead record id is required" });
        const data = await Lead.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).json({ message: "Lead record not found" });
        return res.status(200).json({ message: "Lead record delete successfully" });
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};