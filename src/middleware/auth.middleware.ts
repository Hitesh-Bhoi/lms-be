import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../common/types";
import { ApiError } from "./error.handler";

export const authenticateAdmin = (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) {
        throw new ApiError(401, "Authentication token is required");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new ApiError(500, "JWT_SECRET is not configured in server environment");
    }

    const decoded = jwt.verify(token, secret) as AuthTokenPayload;

    if (decoded.role !== "admin") {
        throw new ApiError(403, "Access forbidden: admin privileges required");
    }

    req.user = decoded;
    next();
};
