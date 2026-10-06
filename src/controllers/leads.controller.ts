import { Request, Response } from "express";
import { Lead } from "../models/leads.model";
import { isValidEmail, isValidPhone } from "../common";
import { LEADS_STATUS_ENUM } from "../common/enums";

export const createLead = async (req: Request, res: Response) => {
    try {
        let { name, email, phone, status } = req.body;
        // payload validation
        if (!name || !email || !phone) {
            return res.status(400).json({ message: "missing required field" });
        };
        // type validation & trimming
        if (typeof name !== "string" || typeof email !== "string" ||
            typeof phone !== "string" || typeof status !== "string") {
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
        return res.status(500).json({ message: error instanceof Error ? error.message : error })
    }
};