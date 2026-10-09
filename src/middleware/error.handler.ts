import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// custom api error class with status code
export class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

// wrapper to catch async controller errors and forward to error handler
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// centralized error handling middleware
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): Response => {
    // handle mongoose validation, cast, and strict mode errors
    if (
        err instanceof mongoose.Error.ValidationError ||
        err instanceof mongoose.Error.CastError ||
        err instanceof mongoose.Error.StrictModeError
    ) {
        return res.status(400).json({ message: err.message });
    }

    // handle custom api errors
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // handle jwt authentication errors
    if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired, please login again" });
    }
    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid authentication token" });
    }

    // log unexpected errors and return generic response
    console.error("unhandled error:", err);
    return res.status(500).json({ message: "Internal server error" });
};
