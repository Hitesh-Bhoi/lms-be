import { Router } from "express";
import { createLead, deleteLeadRecord, getAllLeadRecords, getLeadById, updateLeadRecord } from "../controllers/leads.controller";
const route = Router();

route.post("/", createLead);
route.get("/", getAllLeadRecords);
route.get("/:id", getLeadById);
route.patch("/:id", updateLeadRecord);
route.delete("/:id", deleteLeadRecord);

export default route;