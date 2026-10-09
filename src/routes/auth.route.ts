import { Router } from "express";
import { adminLogin, adminLogout, getAdminProfile } from "../controllers/auth.controller";
import { validateLoginPayload } from "../middleware/auth.validation";
import { authenticateAdmin } from "../middleware/auth.middleware";

const router = Router();

// admin login route
router.post("/login", validateLoginPayload, adminLogin);
// get authenticated admin profile route
router.get("/me", authenticateAdmin, getAdminProfile);
// admin logout route
router.post("/logout", adminLogout);

// export auth router
export default router;
