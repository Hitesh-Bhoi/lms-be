import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateNotePayload = (req: Request, res: Response, next: NextFunction): void | Response => {
    // check if request body is missing
    if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ message: "Request body is required" });
    }
    const { id } = req.params;
    const { content } = req.body;
    // validate lead id format
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid lead ID format" });
    }
    // check if content is not provided
    if ( !content || content === "") {
        return res.status(400).json({ message: "Content is required" });
    }
    // check if content is not a string
    if (typeof content !== "string") {
        return res.status(400).json({ message: "Content must be a string" });
    }
    // validate non-empty content after trimming
    const trimmedContent = content.trim();
    if (!trimmedContent) {
        return res.status(400).json({ message: "Content cannot be empty" });
    }
    req.body.content = trimmedContent;
    next();
};