import express from 'express';
import cors from 'cors';
import router from '../routes/index';
import cookieParser from 'cookie-parser';

// initialize express server
export const connectServer = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const app: express.Application = express();
        const PORT: number = Number(process.env.PORT) || 5000;
        // enable cors for allowed origins with credentials
        const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map(o => o.trim()).filter(Boolean);
        app.use(cors({ origin: allowedOrigins, credentials: true }));
        // parse cookies
        app.use(cookieParser());
        // parse incoming json requests
        app.use(express.json());
        // mount api router
        app.use("/api", router);
        // start server and listen on port
        const server = app.listen(PORT,
            () => {
                console.log(`Server is listening on port ${PORT}`)
                resolve()
            }
        );
        server.on("error", (err) => {
            reject(err); // reject on startup error
        });
    });
};