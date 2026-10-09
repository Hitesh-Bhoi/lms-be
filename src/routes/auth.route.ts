import { Router } from "express";
import { adminLogin, adminLogout, getAdminProfile } from "../controllers/auth.controller";
import { validateLoginPayload } from "../middleware/auth.validation";
import { authenticateAdmin } from "../middleware/auth.middleware";

const route = Router();

// admin login route
route.post("/login", validateLoginPayload, adminLogin);
// get authenticated admin profile route
route.get("/me", authenticateAdmin, getAdminProfile);
// admin logout route
route.post("/logout", adminLogout);

// export auth router
export default route;
