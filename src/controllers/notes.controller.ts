import { Request, Response } from "express";
import mongoose from "mongoose";
import { Lead } from "../models/leads.model";
import { Note } from "../models/notes.model";
import { formatPaginationResponse } from "../services/leads.filter";
import { asyncHandler, ApiError } from "../middleware/error.handler";

// add a note to a lead
export const createNote = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { content } = req.body;
    // verify that the lead exists
    const lead = await Lead.findById(id);
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }
    // create the note
    const data = await Note.create({
        lead_id: id,
        content
    });
    return res.status(201).json({
        data,
        message: "Note added successfully"
    });
});

// get all notes for a specific lead
export const getNotesByLeadId = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid lead ID format");
    }
    // verify that the lead exists
    const lead = await Lead.findById(id);
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    // parse pagination query parameters
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const pageNumber = parsedPage > 0 ? parsedPage : 1;
    const limitNumber = parsedLimit > 0 ? Math.min(parsedLimit, 100) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    // fetch notes and count total documents
    const [data, total] = await Promise.all([
        Note.find({ lead_id: id })
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limitNumber),
        Note.countDocuments({ lead_id: id })
    ]);

    return res.status(200).json({
        data,
        pagination: formatPaginationResponse(total, pageNumber, limitNumber),
        message: "Notes fetched successfully"
    });
});