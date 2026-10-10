import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/users.model";
import { AuthTokenPayload } from "../common/types";
import { asyncHandler, ApiError } from "../middleware/error.handler";

// admin login
export const adminLogin = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    // find admin record by email
    const admin = await User.findOne({ email });
    if (!admin) {
        throw new ApiError(404, "User not found");
    }

    // compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new ApiError(500, "JWT_SECRET is not configured in server environment");
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN || "24h") as SignOptions["expiresIn"];

    const payload: AuthTokenPayload = {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role
    };

    const token = jwt.sign(payload, secret, { expiresIn });

    const decoded = jwt.decode(token) as { exp?: number } | null;
    const maxAge = decoded?.exp ? decoded.exp * 1000 - Date.now() : 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge
    });

    return res.status(200).json({
        data: {
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role
            }
        },
        message: "Login successful"
    });
});

// get current authenticated admin profile
export const getAdminProfile = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
        data: req.user,
        message: "Admin profile fetched successfully"
    });
});

// admin logout
export const adminLogout = asyncHandler(async (_req: Request, res: Response): Promise<Response> => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });
    return res.status(200).json({ message: "Logout successful" });
});