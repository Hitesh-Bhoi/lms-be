import { connectDB } from "./config/db";
import { connectServer } from "./config/server";
import dotenv from "dotenv";
const startApp = async () => {
    try {
        dotenv.config();//load environment variables from .env file
        await connectDB();//database connection
        await connectServer();//server connection
    } catch (error: unknown) {
        console.error("Error occurred during startup:", error instanceof Error ? error.message : error);
        process.exit(1); // exit process if database/server fails to initialize
    }
};
startApp();