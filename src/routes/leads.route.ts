import { Router } from "express";
import { createLead, getAllLeadRecords, getLeadById, updateLeadRecord } from "../controllers/leads.controller";
const route = Router();

route.post("/", createLead);
route.get("/", getAllLeadRecords);
route.get("/:id", getLeadById);
route.patch("/:id", updateLeadRecord);

export default route;