import { Router } from "express";
import { createLead, deleteLeadRecord, getAllLeadRecords, getLeadById, updateLeadRecord } from "../controllers/leads.controller";
import { validateLeadPayload } from "../middleware/leadValidation";
const route = Router();

route.post("/", createLead, validateLeadPayload(false));
route.get("/", getAllLeadRecords);
route.get("/:id", getLeadById);
route.put("/:id", updateLeadRecord, validateLeadPayload(true));
route.delete("/:id", deleteLeadRecord);

export default route;