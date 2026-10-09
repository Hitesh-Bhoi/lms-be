import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../common/types";

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Authentication token is required" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "JWT_SECRET is not configured in server environment" });
        }
        const decoded = jwt.verify(token, secret) as AuthTokenPayload;

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access forbidden: admin privileges required" });
        }

        req.user = decoded;
        next();
    } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired, please log in again" });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid authentication token" });
        }
        return res.status(401).json({ message: "Authentication failed" });
    }
};
