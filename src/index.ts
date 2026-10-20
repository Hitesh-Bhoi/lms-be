import "dotenv/config";

import { connectDB } from "./config/db";
import { connectServer } from "./config/server";
import { redisClient } from "./config/redis";

const startApp = async () => {
    try {
        if(!process.env.REDIS_URL) throw new Error("Redis URL is not defined");
        
        await connectDB(); // database connection
        await redisClient.connect(); //redis connection
        await connectServer(); // server connection
    } catch (error: unknown) {
        console.error("Error occurred during startup:", error instanceof Error ? error.message : error);
        process.exit(1); // exit process if database/server fails to initialize
    }
};
startApp();