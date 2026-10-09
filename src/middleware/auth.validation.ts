import { Request, Response, NextFunction } from "express";
import { isValidEmail } from "../common";

export const validateLoginPayload = (req: Request, res: Response, next: NextFunction) => {
    // check if request body is missing
    if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ message: "Request body is required" });
    }

    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // check if types are strings
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Email and password must be strings" });
    }

    // validate email format
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    req.body.email = trimmedEmail;
    next();
};
