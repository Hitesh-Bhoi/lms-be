import { Router } from "express";
import { createLead } from "../controllers/leads.controller";
const route = Router();

route.post("/", createLead);

export default route;