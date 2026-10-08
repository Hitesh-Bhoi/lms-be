import { Request, Response } from "express";
import mongoose from "mongoose";
import { Lead } from "../models/leads.model";
import { Note } from "../models/notes.model";
import { formatPaginationResponse } from "../services/leads.filter";

// add a note to a lead
export const createNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        // verify that the lead exists
        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
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

// get all notes for a specific lead
export const getNotesByLeadId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid lead ID format" });
        }
        // verify that the lead exists
        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        const { page, limit } = req.query;
        const parsedPage = parseInt(page as string, 10);
        const parsedLimit = parseInt(limit as string, 10);
        const pageNumber = parsedPage > 0 ? parsedPage : 1;
        const limitNumber = parsedLimit > 0 ? Math.min(parsedLimit, 100) : 10;
        const skip = (pageNumber - 1) * limitNumber;

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
    } catch (error: unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};