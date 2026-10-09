import mongoose from "mongoose";

// connect to mongodb database
export const connectDB = async () => {
    try {
        // get mongodb uri from environment variables
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) throw new Error("MONGO_URI environment variable is not defined in .env");
        // establish database connection
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error: unknown) {
        console.error("MongoDB connection failed:", error instanceof Error ? error.message : error);
        // exit process on connection failure
        process.exit(1);
    }
};