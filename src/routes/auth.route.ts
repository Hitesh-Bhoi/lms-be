import { Router } from "express";
import { adminLogin, getAdminProfile } from "../controllers/auth.controller";
import { validateLoginPayload } from "../middleware/auth.validation";
import { authenticateAdmin } from "../middleware/auth.middleware";

const route = Router();

// admin login routes
route.post("/login", validateLoginPayload, adminLogin);

// get authenticated admin profile
route.get("/me", authenticateAdmin, getAdminProfile);

export default route;
