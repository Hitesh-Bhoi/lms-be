import { Request, Response, NextFunction } from "express";
import { isValidEmail, isValidPhone, normalizePhone } from "../common";
import { LEADS_STATUS_ENUM } from "../common/enums";

export const validateLeadPayload = (isUpdate = false) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // check if request body is missing
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({ message: "Request body is required" });
        }

        // strip immutable fields on update
        if (isUpdate) {
            delete req.body._id;
            delete req.body.created_at;
            delete req.body.updated_at;
        }

        // check if no fields provided to update
        if (isUpdate && Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        let { name, email, phone, status } = req.body;
        // check all primary fields are required
        if (!isUpdate && (!name || !email || !phone)) {
            return res.status(400).json({ message: "missing required field" });
        }
        // type validation for provided fields
        if (
            (name && typeof name !== "string") ||
            (email && typeof email !== "string") ||
            (phone && typeof phone !== "string")
        ) {
            return res.status(400).json({ message: "Required fields must be strings" });
        }
        // sanitize and validate fields if provided
        if (name) {
            req.body.name = name.trim();
        }
        if (email) {
            const trimmedEmail = email.trim().toLowerCase();
            if (!isValidEmail(trimmedEmail)) {
                return res.status(400).json({ message: "invalid email format" });
            }
            req.body.email = trimmedEmail;
        }
        if (phone) {
            const trimmedPhone = phone.trim();
            if (!isValidPhone(trimmedPhone)) {
                return res.status(400).json({ message: "invalid phone number" });
            }
            req.body.phone = normalizePhone(trimmedPhone);
        }
        if (status) {
            const validStatuses = Object.values(LEADS_STATUS_ENUM);
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "incorrect status type" });
            }
        }
        next();
    };
};