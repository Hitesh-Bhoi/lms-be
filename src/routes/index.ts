import { Router } from "express";
import leadRoutes from "./leads.route";
const router = Router();

router.use("/leads", leadRoutes);

export default router;