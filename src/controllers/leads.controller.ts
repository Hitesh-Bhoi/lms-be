import { Request, Response } from "express";
import { Lead } from "../models/leads.model";
import { isValidEmail, isValidPhone } from "../common";
import { LEADS_STATUS_ENUM } from "../common/enums";

// add new lead record
export const createLead = async (req: Request, res: Response) => {
    try {
        let { name, email, phone, status } = req.body;
        // payload validation
        if (!name || !email || !phone) {
            return res.status(400).json({ message: "missing required field" });
        };
        // type validation & trimming
        if (typeof name !== "string" || typeof email !== "string" || typeof phone !== "string") {
            return res.status(400).json({ message: "Required fields must be strings" });
        }
        // remove space from all fields and make email lowercase
        name = name.trim();
        email = email.trim().toLowerCase();
        phone = phone.trim();
        // validation
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "invalid email format" });
        };
        if (!isValidPhone(phone)) {
            return res.status(400).json({ message: "invalid phone number" });
        };
        if (status !== LEADS_STATUS_ENUM.CONTACTED && status !== LEADS_STATUS_ENUM.QUALIFIED &&
            status !== LEADS_STATUS_ENUM.NEW && status !== LEADS_STATUS_ENUM.LOST
        ) {
            return res.status(400).json({ message: "incorrect status type" });
        }
        // insert into db
        const data = await Lead.create({ name, email, phone, status });
        return res.status(201).json({ data, message: "Lead saved successfully" });
    } catch (error: unknown) {
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};

// get all lead records
export const getAllLeadRecords = async (req: Request, res: Response) => {
    try {
        const data = await Lead.find();
        return res.status(200).json({
            data,
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
        return res.status(200).json({
            data,
            message: "Lead record fetched successfully"
        });
    } catch (error: unknown) {
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};

// update lead record
export const updateLeadRecord = async (req: Request, res: Response) => {
    try {
        let { name, email, phone, status } = req.body;
        // payload validation
        if (!name || !email || !phone) {
            return res.status(400).json({ message: "missing required field" });
        };
        // type validation & trimming
        if (typeof name !== "string" || typeof email !== "string" || typeof phone !== "string") {
            return res.status(400).json({ message: "Required fields must be strings" });
        }
        // remove space from all fields and make email lowercase
        name = name.trim();
        email = email.trim().toLowerCase();
        phone = phone.trim();
        // validation
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "invalid email format" });
        };
        if (!isValidPhone(phone)) {
            return res.status(400).json({ message: "invalid phone number" });
        };
        if (status !== LEADS_STATUS_ENUM.CONTACTED && status !== LEADS_STATUS_ENUM.QUALIFIED &&
            status !== LEADS_STATUS_ENUM.NEW && status !== LEADS_STATUS_ENUM.LOST
        ) {
            return res.status(400).json({ message: "incorrect status type" });
        }
        // update lead record in db
        const data = await Lead.findByIdAndUpdate(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: "Lead not found" })
        return res.status(200).json({ data, message: "Lead updated successfully" });
    } catch (error: unknown) {
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
        return res.status(500).json({ message: error instanceof Error ? error.message : error });
    }
};