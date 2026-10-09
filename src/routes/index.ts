import { Router } from "express";
import leadRoutes from "./leads.route";
import authRoutes from "./auth.route";
import { authenticateAdmin } from "../middleware/auth.middleware";

const router = Router();

// auth route
router.use("/auth", authRoutes);

// protected routes of leads & notes
router.use("/leads", authenticateAdmin, leadRoutes);

export default router;