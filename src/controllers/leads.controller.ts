import { Request, Response } from "express";
import { Lead } from "../models/leads.model";

export const createLead = async (req: Request, res: Response) => {
    try {
        //create lead business logic
        const data = await Lead.create(req.body);
        res.status(201).json({ data, message: "Lead added successfully" });
    } catch (error) {
        res.status(500).json({ data: [], message: error })
    }
};
