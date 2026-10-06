import { Router } from "express";
import { createLead, getAllLeadRecords, getLeadById } from "../controllers/leads.controller";
const route = Router();

route.post("/", createLead);
route.get("/", getAllLeadRecords);
route.get("/:id", getLeadById);

export default route;