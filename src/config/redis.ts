import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;
export const redisClient = createClient({
    url: redisUrl,
});

redisClient.on("error", (err)=>{
    console.error("Redis error:", err);
});

redisClient.on("ready", ()=>{
    console.log("Redis connected successfully");
});