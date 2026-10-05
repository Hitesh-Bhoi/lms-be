import express from 'express';
import cors from 'cors';
import router from '../routes/index.js';
export const connectServer = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const app: express.Application = express();
        const PORT: number = Number(process.env.PORT) || 5000;
        //enable CORS for all routes
        app.use(cors());
        //parse incoming JSON requests
        app.use(express.json());
        //mount the router at /api
        app.use("/api", router);
        //start the server and listen on the specified port
        const server = app.listen(PORT,
            () => {
                console.log(`Server is listening on port ${PORT}`)
                resolve()
            }
        );
        server.on("error", (err) => {
            reject(err); // port blocked or startup error caught here!
        });
    });
};