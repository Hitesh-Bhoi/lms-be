import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) throw new Error("MONGO_URI environment variable is not defined in .env");
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error: unknown) {
        console.error("MongoDB connection failed:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
};