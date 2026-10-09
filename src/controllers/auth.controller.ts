import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/users.model";
import { AuthTokenPayload } from "../common/types";

// admin login
export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // find admin record by email
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "JWT_SECRET is not configured in server environment" });
        }
        const expiresIn = (process.env.JWT_EXPIRES_IN || "24h") as SignOptions["expiresIn"];

        const payload: AuthTokenPayload = {
            id: admin._id.toString(),
            email: admin.email,
            role: admin.role
        };

        const token = jwt.sign(payload, secret, { expiresIn });

        const { exp } = jwt.decode(token) as { exp: number };

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: exp * 1000 - Date.now()
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
    } catch (error: unknown) {
        console.error("adminLogin failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// get current authenticated admin profile
export const getAdminProfile = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            data: req.user,
            message: "Admin profile fetched successfully"
        });
    } catch (error: unknown) {
        console.error("getAdminProfile failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// admin logout
export const adminLogout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error: unknown) {
        console.error("adminLogout failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};